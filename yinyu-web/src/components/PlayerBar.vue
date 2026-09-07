<script setup lang="ts">
import { computed, ref } from 'vue'
import { Heart, ListMusic, Pause, Play, Repeat, Repeat1, Shuffle, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-vue-next'
import { ElMessage } from 'element-plus'
import { usePlayerStore } from '../stores/player'
import { artistOf, formatTime, songById } from '../data/db'

const player = usePlayerStore()
const showQueue = ref(false)

const song = computed(() => player.current)
const st = computed(() => player.state)

const artistName = computed(() => {
  const s = song.value
  return s ? s.artistName : '—'
})

const coverSrc = ref('')
const cover = computed(() => song.value?.cover ?? '')
function onCoverError() {
  coverSrc.value = '/images/albums/album_011.jpg'
}

function onSeek(e: MouseEvent) {
  const el = e.currentTarget as HTMLElement
  const rect = el.getBoundingClientRect()
  const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width))
  player.seek(ratio * st.value.duration)
}

function toggleQueue() {
  showQueue.value = !showQueue.value
}

function modeLabel(): string {
  switch (st.value.mode) {
    case 'order': return '顺序播放'
    case 'loop': return '列表循环'
    case 'one': return '单曲循环'
    case 'shuffle': return '随机播放'
  }
  return ''
}

function playFromQueue(i: number) {
  const id = st.value.queue[i]
  if (id) player.playSong(id)
}

const progressPercent = computed(() => (st.value.duration > 0 ? (st.value.currentTime / st.value.duration) * 100 : 0))
</script>

<template>
  <div v-if="song" class="fixed bottom-0 left-0 right-0 z-40 h-20 bg-ink-900/95 backdrop-blur border-t border-white/5">
    <div class="h-full px-5 flex items-center gap-4 max-w-[1600px] mx-auto">
      <!-- 左：歌曲信息 -->
      <div class="flex items-center gap-3 w-[280px] shrink-0 min-w-0">
        <img
          :src="cover || coverSrc" @error="onCoverError"
          class="w-12 h-12 rounded-md object-cover bg-ink-750"
          :alt="song.name"
          data-test="player-cover"
        />
        <div class="min-w-0">
          <div class="text-sm text-mist-100 truncate" data-test="player-title">{{ song.name }}</div>
          <div class="text-xs text-mist-400 truncate" data-test="player-artist">{{ artistName }}</div>
        </div>
        <button
          class="ml-1 shrink-0 transition-colors"
          :class="player.liked(song.id) ? 'text-red-500' : 'text-mist-400 hover:text-mist-300'"
          data-test="player-like"
          @click="player.toggleLike(song.id)"
        >
          <Heart class="w-4.5 h-4.5" :fill="player.liked(song.id) ? 'currentColor' : 'none'" />
        </button>
      </div>

      <!-- 中：控制按钮 -->
      <div class="flex-1 flex items-center justify-center gap-5">
        <button
          class="text-mist-400 hover:text-mist-100 transition-colors"
          :class="st.mode === 'shuffle' ? '!text-gold-400' : ''"
          title="随机播放"
          data-test="player-shuffle"
          @click="player.setMode(st.mode === 'shuffle' ? 'order' : 'shuffle')"
        >
          <Shuffle class="w-[18px] h-[18px]" />
        </button>
        <button class="text-mist-300 hover:text-white transition-colors" data-test="player-prev" @click="player.prev()">
          <SkipBack class="w-5 h-5" fill="currentColor" />
        </button>
        <button
          class="w-12 h-12 rounded-full bg-gradient-to-b from-gold-300 to-gold-500 text-ink-900 flex items-center justify-center shadow-lg shadow-gold-500/20 hover:brightness-105 transition"
          data-test="player-toggle"
          :aria-label="st.playing ? '暂停' : '播放'"
          @click="player.toggle()"
        >
          <Pause v-if="st.playing" class="w-5 h-5" fill="currentColor" />
          <Play v-else class="w-5 h-5 ml-0.5" fill="currentColor" />
        </button>
        <button class="text-mist-300 hover:text-white transition-colors" data-test="player-next" @click="player.next()">
          <SkipForward class="w-5 h-5" fill="currentColor" />
        </button>
        <button
          class="text-mist-400 hover:text-mist-100 transition-colors"
          :class="st.mode === 'loop' || st.mode === 'one' ? '!text-gold-400' : ''"
          :title="modeLabel()"
          data-test="player-mode"
          @click="player.cycleMode()"
        >
          <Repeat1 v-if="st.mode === 'one'" class="w-[18px] h-[18px]" />
          <Repeat v-else class="w-[18px] h-[18px]" />
        </button>
      </div>

      <!-- 右：进度与音量 -->
      <div class="flex items-center gap-3 w-[380px] shrink-0">
        <span class="text-xs text-mist-400 tabular-nums w-10 text-right" data-test="player-current">{{ formatTime(st.currentTime) }}</span>
        <div
          class="flex-1 h-1 rounded-full bg-ink-600 cursor-pointer relative group"
          data-test="player-progress"
          @click="onSeek"
        >
          <div class="h-full rounded-full bg-gradient-to-r from-gold-300 to-gold-500 relative" :style="{ width: progressPercent + '%' }">
            <span class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-2.5 h-2.5 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity"></span>
          </div>
        </div>
        <span class="text-xs text-mist-400 tabular-nums w-10" data-test="player-duration">{{ formatTime(st.duration) }}</span>
        <button class="text-mist-400 hover:text-mist-100 transition-colors" data-test="player-mute" @click="player.toggleMute()">
          <VolumeX v-if="st.muted" class="w-[18px] h-[18px]" />
          <Volume2 v-else class="w-[18px] h-[18px]" />
        </button>
        <div class="relative">
          <button
            class="text-mist-400 hover:text-mist-100 transition-colors"
            :class="showQueue ? '!text-gold-400' : ''"
            title="播放列表"
            data-test="player-queue"
            @click="toggleQueue"
          >
            <ListMusic class="w-[18px] h-[18px]" />
          </button>
          <!-- 播放队列弹层 -->
          <div
            v-if="showQueue"
            class="absolute bottom-10 right-0 w-80 max-h-96 overflow-auto rounded-xl bg-ink-850 border border-white/10 shadow-2xl p-2"
            data-test="player-queue-panel"
          >
            <div class="px-3 py-2 text-xs text-mist-400 flex justify-between items-center">
              <span>当前播放（{{ st.queue.length }}）</span>
              <span>{{ modeLabel() }}</span>
            </div>
            <div
              v-for="(id, i) in st.queue"
              :key="id"
              class="px-3 py-2 rounded-lg flex items-center gap-2 cursor-pointer hover:bg-white/5"
              :class="i === st.index ? 'bg-white/5' : ''"
              @click="playFromQueue(i)"
            >
              <span class="text-xs w-4" :class="i === st.index ? 'text-gold-400' : 'text-mist-500'">{{ i + 1 }}</span>
              <span class="text-xs text-mist-100 truncate flex-1">{{ songById(id)?.name }}</span>
              <span class="text-xs text-mist-500 truncate max-w-[90px]">{{ songById(id)?.artistName }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
