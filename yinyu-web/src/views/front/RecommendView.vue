<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Heart, Play, ThumbsDown } from 'lucide-vue-next'
import type { Song } from '../../data/db'
import { useAdminStore } from '../../data/adminStore'
import { usePlayerStore } from '../../stores/player'
import { ALBUM_FALLBACK, imgFallback } from '../../utils/img'

const admin = useAdminStore()
const player = usePlayerStore()

const excluded = ref<string[]>([])
const list = computed<Song[]>(() =>
  admin.state.songs.filter((s) => s.status === 'on' && !excluded.value.includes(s.id)).slice(0, 12),
)
const playingId = computed(() => player.current?.id)

function playAll() {
  const ids = list.value.map((s) => s.id)
  if (ids.length) player.playSong(ids[0], ids)
  ElMessage.success('已开始播放今日推荐')
}
function dislike(id: string) {
  excluded.value.push(id)
  ElMessage.info('已减少此类推荐')
}
</script>

<template>
  <div>
    <div class="flex items-end justify-between">
      <div>
        <h1 class="text-2xl font-semibold">每日推荐</h1>
        <p class="mt-2 text-sm text-mist-500">根据你的口味生成 · 每天更新</p>
      </div>
      <button class="h-10 px-6 rounded-full bg-gradient-to-r from-gold-200 to-gold-500 text-ink-900 text-sm font-medium hover:brightness-105 transition" data-test="rec-play-all" @click="playAll">
        播放全部
      </button>
    </div>

    <div class="mt-6 grid grid-cols-4 gap-4" data-test="rec-grid">
      <div v-for="s in list" :key="s.id" class="bg-ink-850 rounded-2xl overflow-hidden group hover:bg-ink-800 transition-colors">
        <div class="relative aspect-square overflow-hidden cursor-pointer" @click="player.playSong(s.id, list.map((x) => x.id))">
          <img :src="s.cover" :alt="s.name" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" @error="imgFallback($event, ALBUM_FALLBACK)" />
          <span class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></span>
          <span class="absolute right-2.5 bottom-2.5 w-9 h-9 rounded-full bg-black/45 border border-white/50 backdrop-blur-sm items-center justify-center text-white hidden group-hover:flex">
            <Play class="w-4 h-4 ml-0.5" fill="currentColor" />
          </span>
        </div>
        <div class="p-3">
          <div class="text-sm truncate" :class="playingId === s.id ? 'text-gold-300' : 'text-mist-100'">{{ s.name }}</div>
          <div class="mt-1 text-xs text-mist-500 truncate">{{ s.artistName }}</div>
          <div class="mt-2.5 flex items-center gap-3">
            <button
              class="transition-colors"
              :class="player.liked(s.id) ? 'text-red-500' : 'text-mist-500 hover:text-red-400'"
              :data-test="`rec-like-${s.id}`"
              @click="player.toggleLike(s.id)"
            >
              <Heart class="w-4 h-4" :fill="player.liked(s.id) ? 'currentColor' : 'none'" />
            </button>
            <button class="text-mist-600 hover:text-mist-300 transition-colors flex items-center gap-1 text-[11px]" :data-test="`rec-dislike-${s.id}`" title="不感兴趣" @click="dislike(s.id)">
              <ThumbsDown class="w-3.5 h-3.5" /> 不感兴趣
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
