<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Clock3, Download, Heart, Play } from 'lucide-vue-next'
import { designatedAudioOf, formatTime, songById } from '../../data/db'
import { useAdminStore } from '../../data/adminStore'
import { usePlayerStore } from '../../stores/player'
import { ALBUM_FALLBACK, imgFallback } from '../../utils/img'

const route = useRoute()
const router = useRouter()
const admin = useAdminStore()
const player = usePlayerStore()

const playlist = computed(() => admin.state.playlists.find((p) => p.id === route.params.id))
const songs = computed(() => (playlist.value?.songIds ?? []).map((id) => songById(id)!).filter(Boolean))
const collected = computed(() => player.state.collectedPlaylistIds.includes(playlist.value?.id ?? ''))
const totalDuration = computed(() => songs.value.reduce((acc, s) => acc + designatedAudioOf(s).duration, 0))
const playingId = computed(() => player.current?.id)

function playAll() {
  if (!playlist.value) return
  player.playSong(playlist.value.songIds[0], [...playlist.value.songIds])
  ElMessage.success(`正在播放歌单「${playlist.value.name}」`)
}
function playOne(id: string) {
  if (!playlist.value) return
  player.playSong(id, [...playlist.value.songIds])
}
function toggleCollect() {
  const added = player.toggleCollectPlaylist(playlist.value?.id ?? '')
  ElMessage.success(added ? '已收藏歌单' : '已取消收藏')
}
function downloadAll() {
  let added = 0
  songs.value.forEach((s) => {
    if (player.download(s.id)) added++
  })
  ElMessage.success(added ? `已加入下载列表（${added} 首）` : '歌曲均已在下载列表')
}
</script>

<template>
  <div v-if="playlist">
    <!-- 歌单头部 -->
    <div class="flex gap-7">
      <img
        :src="playlist.cover" :alt="playlist.name"
        class="w-48 h-48 rounded-2xl object-cover bg-ink-800 shrink-0 shadow-lg shadow-black/40"
        @error="imgFallback($event, ALBUM_FALLBACK)"
      />
      <div class="min-w-0 flex-1">
        <div class="inline-block px-2 h-6 rounded-full bg-gold-500/15 text-gold-300 text-[11px] leading-6">歌单</div>
        <h1 class="mt-3 text-3xl font-semibold">{{ playlist.name }}</h1>
        <div class="mt-3 text-xs text-mist-400 flex items-center gap-3">
          <span>创建者：{{ playlist.creator }}</span>
          <span>·</span>
          <span>分类：{{ playlist.category }}</span>
          <span>·</span>
          <span>{{ songs.length }} 首 · 约 {{ formatTime(totalDuration) }}</span>
        </div>
        <div class="mt-3 flex items-center gap-2 flex-wrap">
          <span v-for="t in playlist.tags" :key="t" class="px-2.5 h-6 rounded-full bg-ink-800 text-[11px] text-mist-400 leading-6"># {{ t }}</span>
        </div>
        <p class="mt-4 text-sm text-mist-400 leading-6 max-w-[640px]">{{ playlist.desc }}</p>
        <div class="mt-5 flex items-center gap-3">
          <button class="h-10 px-6 rounded-full bg-gradient-to-r from-gold-200 to-gold-500 text-ink-900 text-sm font-medium hover:brightness-105 transition flex items-center gap-2" data-test="pl-play-all" @click="playAll">
            <Play class="w-4 h-4" fill="currentColor" /> 播放全部
          </button>
          <button
            class="h-10 px-5 rounded-full text-sm transition flex items-center gap-2"
            :class="collected ? 'bg-red-500/15 text-red-400' : 'bg-ink-800 text-mist-300 hover:bg-ink-750'"
            :data-test="`pl-collect`"
            @click="toggleCollect"
          >
            <Heart class="w-4 h-4" :fill="collected ? 'currentColor' : 'none'" /> {{ collected ? '已收藏' : '收藏' }} ({{ playlist.collectCount ?? 0 }})
          </button>
          <button class="h-10 px-5 rounded-full bg-ink-800 text-mist-300 hover:bg-ink-750 text-sm transition flex items-center gap-2" data-test="pl-download" @click="downloadAll">
            <Download class="w-4 h-4" /> 下载全部
          </button>
        </div>
      </div>
    </div>

    <!-- 歌曲列表 -->
    <div class="mt-8 bg-ink-850 rounded-2xl p-4" data-test="pl-songs">
      <div class="grid grid-cols-[48px_1fr_1fr_80px_100px] gap-3 px-3 pb-2 text-xs text-mist-500 border-b border-white/5">
        <span>#</span><span>歌曲</span><span>歌手</span><span>时长</span><span class="text-right">操作</span>
      </div>
      <div
        v-for="(s, i) in songs" :key="s.id"
        class="grid grid-cols-[48px_1fr_1fr_80px_100px] gap-3 items-center px-3 h-14 rounded-xl hover:bg-white/[0.04] transition-colors group cursor-pointer"
        :data-test="`pl-song-${s.id}`"
        @click="playOne(s.id)"
      >
        <span class="text-sm text-mist-500 tabular-nums text-center">{{ String(i + 1).padStart(2, '0') }}</span>
        <div class="flex items-center gap-3 min-w-0">
          <img :src="s.cover" :alt="s.name" class="w-9 h-9 rounded object-cover bg-ink-750 shrink-0" @error="imgFallback($event, ALBUM_FALLBACK)" />
          <span class="text-sm truncate" :class="playingId === s.id ? 'text-gold-300' : 'text-mist-100'">{{ s.name }}</span>
        </div>
        <router-link :to="`/artists/${s.artistId}`" class="text-xs text-mist-400 hover:text-gold-300 truncate" @click.stop>{{ s.artistName }}</router-link>
        <span class="text-xs text-mist-500 flex items-center gap-1"><Clock3 class="w-3 h-3" /> {{ formatTime(designatedAudioOf(s).duration) }}</span>
        <div class="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <button title="播放" class="text-mist-400 hover:text-gold-300" @click.stop="playOne(s.id)">
            <Play class="w-4 h-4" fill="currentColor" />
          </button>
          <button
            title="喜欢"
            class="transition-colors"
            :class="player.liked(s.id) ? 'text-red-500' : 'text-mist-400 hover:text-red-400'"
            @click.stop="player.toggleLike(s.id)"
          >
            <Heart class="w-4 h-4" :fill="player.liked(s.id) ? 'currentColor' : 'none'" />
          </button>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="py-24 text-center text-mist-500">
    歌单不存在
    <button class="ml-2 text-gold-300" @click="router.push('/playlists')">返回歌单广场</button>
  </div>
</template>
