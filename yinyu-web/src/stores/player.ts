import { defineStore } from 'pinia'
import { computed, reactive, watch } from 'vue'
import { designatedAudioOf, songs, songById, type Song } from '../data/db'

export type PlayMode = 'order' | 'loop' | 'one' | 'shuffle'

interface PlayerState {
  queue: string[]
  index: number
  playing: boolean
  currentTime: number
  duration: number
  volume: number
  muted: boolean
  mode: PlayMode
  likedIds: string[]
  /** 最近播放（新的在前） */
  recentIds: string[]
  /** 已下载歌曲 */
  downloadIds: string[]
  /** 已收藏歌单 */
  collectedPlaylistIds: string[]
}

/**
 * 全局播放器。
 * 无论点播哪首歌曲，实际加载的音频都是该歌手在资源库中被「指定」的那一首本地 mp3。
 */
let audio: HTMLAudioElement | null = null

function ensureAudio(): HTMLAudioElement {
  if (!audio) {
    audio = new Audio()
    audio.preload = 'auto'
    // 测试钩子：供浏览器端自动化验证实际播放状态
    ;(window as any).__yyAudio = audio
  }
  return audio
}

export const usePlayerStore = defineStore('player', () => {
  const state = reactive<PlayerState>({
    queue: ['S1', 'S2', 'S3', 'S4', 'S5'],
    index: 0,
    playing: false,
    currentTime: 0,
    duration: 0,
    volume: 0.8,
    muted: false,
    mode: 'order',
    likedIds: songs.filter((s) => s.liked).map((s) => s.id),
    recentIds: [],
    downloadIds: [],
    collectedPlaylistIds: ['M2'],
  })

  const current = computed<Song | null>(() => {
    const id = state.queue[state.index]
    return id ? songById(id) ?? null : null
  })

  const liked = computed(() => (songId: string) => state.likedIds.includes(songId))

  function loadCurrent(preserveTime = false) {
    const song = current.value
    if (!song) return
    const a = ensureAudio()
    const { url } = designatedAudioOf(song)
    const abs = new URL(url, window.location.origin).href
    if (!a.src.endsWith(url)) {
      a.src = abs
    }
    if (!preserveTime) {
      state.currentTime = 0
    }
    state.duration = designatedAudioOf(song).duration
  }

  function playSong(songId: string, queue?: string[]) {
    if (queue && queue.length) {
      state.queue = queue
      const idx = queue.indexOf(songId)
      state.index = idx >= 0 ? idx : 0
    } else if (!state.queue.includes(songId)) {
      // 不在当前队列：插入到当前播放位置之后
      state.queue.splice(state.index + 1, 0, songId)
      state.index += 1
    } else {
      state.index = state.queue.indexOf(songId)
    }
    // 记录最近播放
    const ri = state.recentIds.indexOf(songId)
    if (ri >= 0) state.recentIds.splice(ri, 1)
    state.recentIds.unshift(songId)
    if (state.recentIds.length > 30) state.recentIds.pop()
    loadCurrent()
    void ensureAudio().play().then(() => {
      state.playing = true
    }).catch(() => {
      state.playing = false
    })
  }

  function download(songId: string): boolean {
    if (state.downloadIds.includes(songId)) return false
    state.downloadIds.push(songId)
    return true
  }

  function removeDownload(songId: string) {
    const i = state.downloadIds.indexOf(songId)
    if (i >= 0) state.downloadIds.splice(i, 1)
  }

  function toggleCollectPlaylist(playlistId: string): boolean {
    const i = state.collectedPlaylistIds.indexOf(playlistId)
    if (i >= 0) {
      state.collectedPlaylistIds.splice(i, 1)
      return false
    }
    state.collectedPlaylistIds.push(playlistId)
    return true
  }

  function toggle() {
    const a = ensureAudio()
    if (!current.value) {
      if (state.queue.length) playSong(state.queue[0])
      return
    }
    if (a.paused) {
      if (!a.src) loadCurrent()
      void a.play().then(() => {
        state.playing = true
      }).catch(() => {
        state.playing = false
      })
    } else {
      a.pause()
      state.playing = false
    }
  }

  function pickNextIndex(direction: 1 | -1): number {
    const n = state.queue.length
    if (n === 0) return 0
    if (state.mode === 'shuffle' && n > 1) {
      let r = state.index
      while (r === state.index) r = Math.floor(Math.random() * n)
      return r
    }
    let i = state.index + direction
    if (i >= n) i = 0
    if (i < 0) i = n - 1
    return i
  }

  function next() {
    if (!state.queue.length) return
    state.index = pickNextIndex(1)
    loadCurrent()
    void ensureAudio().play().then(() => {
      state.playing = true
    }).catch(() => {
      state.playing = false
    })
  }

  function prev() {
    if (!state.queue.length) return
    state.index = pickNextIndex(-1)
    loadCurrent()
    void ensureAudio().play().then(() => {
      state.playing = true
    }).catch(() => {
      state.playing = false
    })
  }

  function seek(t: number) {
    const a = ensureAudio()
    a.currentTime = t
    state.currentTime = t
  }

  function setVolume(v: number) {
    state.volume = Math.min(1, Math.max(0, v))
    state.muted = state.volume === 0
  }

  function toggleMute() {
    state.muted = !state.muted
  }

  function toggleLike(songId: string) {
    const i = state.likedIds.indexOf(songId)
    if (i >= 0) state.likedIds.splice(i, 1)
    else state.likedIds.push(songId)
  }

  function cycleMode() {
    const order: PlayMode[] = ['order', 'loop', 'one', 'shuffle']
    const i = order.indexOf(state.mode)
    state.mode = order[(i + 1) % order.length]
  }

  function setMode(mode: PlayMode) {
    state.mode = mode
  }

  // 音频元素事件 → 状态
  watch(
    () => state.queue[state.index],
    () => {
      const a = ensureAudio()
      const onTime = () => {
        state.currentTime = a.currentTime
      }
      const onMeta = () => {
        if (isFinite(a.duration) && a.duration > 0) state.duration = a.duration
      }
      const onEnd = () => {
        if (state.mode === 'one') {
          a.currentTime = 0
          void a.play()
        } else {
          next()
        }
      }
      a.removeEventListener('timeupdate', onTime)
      a.removeEventListener('loadedmetadata', onMeta)
      a.removeEventListener('ended', onEnd)
      a.addEventListener('timeupdate', onTime)
      a.addEventListener('loadedmetadata', onMeta)
      a.addEventListener('ended', onEnd)
    },
    { immediate: true },
  )

  watch(
    () => [state.volume, state.muted],
    () => {
      const a = ensureAudio()
      a.volume = state.muted ? 0 : state.volume
    },
    { immediate: true },
  )

  return {
    state,
    current,
    liked,
    playSong,
    toggle,
    next,
    prev,
    seek,
    setVolume,
    toggleMute,
    toggleLike,
    cycleMode,
    setMode,
    download,
    removeDownload,
    toggleCollectPlaylist,
  }
})
