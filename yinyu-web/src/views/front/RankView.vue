<script setup lang="ts">
import { computed, ref } from 'vue'
import { Heart, Play } from 'lucide-vue-next'
import { charts, formatPlayCount, songById } from '../../data/db'
import type { Song } from '../../data/db'
import { useAdminStore } from '../../data/adminStore'
import { usePlayerStore } from '../../stores/player'
import { ALBUM_FALLBACK, ARTIST_FALLBACK, imgFallback } from '../../utils/img'

const admin = useAdminStore()
const player = usePlayerStore()

const activeChart = ref('hot')
const activeRange = ref('周榜')
const ranges = ['日榜', '周榜', '月榜']

const playingId = computed(() => player.current?.id)
const artistOf = (s: Song) => admin.state.artists.find((a) => a.id === s.artistId)

// 不同时间维度对榜单做确定性重排，模拟日/周/月差异
function rotate<T>(arr: T[], n: number): T[] {
  const k = n % arr.length
  return [...arr.slice(k), ...arr.slice(0, k)]
}
const offset = computed(() => (activeRange.value === '日榜' ? 1 : activeRange.value === '月榜' ? 3 : 0))
const chartSongs = computed<Song[]>(() => {
  const c = charts.find((x) => x.key === activeChart.value)
  const ids = rotate(c?.songIds ?? [], offset.value)
  return ids.map((id) => songById(id)!).filter(Boolean)
})

function play(list: string[], id?: string) {
  player.playSong(id ?? list[0], list)
}
</script>

<template>
  <div>
    <div class="flex items-end justify-between">
      <div>
        <h1 class="text-2xl font-semibold">排行榜</h1>
        <p class="mt-2 text-sm text-mist-500">每天更新 · 汇集全平台最热门的音乐</p>
      </div>
      <div class="flex items-center rounded-lg bg-ink-850 p-1 gap-1">
        <button
          v-for="r in ranges" :key="r"
          class="px-4 h-8 rounded-md text-xs transition-colors"
          :class="activeRange === r ? 'bg-gold-500/20 text-gold-300' : 'text-mist-400 hover:text-mist-100'"
          :data-test="`rank-range-${r}`"
          @click="activeRange = r"
        >{{ r }}</button>
      </div>
    </div>

    <div class="mt-6 flex items-center gap-4">
      <button
        v-for="c in charts" :key="c.key"
        class="relative px-5 h-11 rounded-xl text-sm transition-colors"
        :class="activeChart === c.key ? 'bg-gold-500/15 text-gold-300 border border-gold-500/40' : 'bg-ink-850 text-mist-300 hover:text-white border border-transparent'"
        :data-test="`rank-tab-${c.key}`"
        @click="activeChart = c.key"
      >
        {{ c.name }}
      </button>
    </div>

    <div class="mt-5 bg-ink-850 rounded-2xl p-5" data-test="rank-table">
      <div
        v-for="(s, i) in chartSongs" :key="s.id"
        class="flex items-center gap-4 h-[68px] rounded-xl px-3 hover:bg-white/[0.04] transition-colors group cursor-pointer"
        :data-test="`rank-row-${s.id}`"
        @click="play(charts.find((c) => c.key === activeChart)!.songIds, s.id)"
      >
        <span
          class="w-8 text-center text-xl font-semibold tabular-nums"
          :class="i === 0 ? 'text-gold-400' : i === 1 ? 'text-mist-100' : i === 2 ? 'text-amber-600' : 'text-mist-500'"
        >{{ i + 1 }}</span>
        <div class="relative shrink-0">
          <img
            :src="artistOf(s)?.avatar ?? ALBUM_FALLBACK" :alt="s.artistName"
            class="w-12 h-12 rounded-lg object-cover bg-ink-750"
            @error="imgFallback($event, ARTIST_FALLBACK)"
          />
          <span
            class="absolute inset-0 rounded-lg bg-black/40 items-center justify-center hidden group-hover:flex text-white"
            title="播放"
          >
            <Play class="w-4 h-4 ml-0.5" fill="currentColor" />
          </span>
        </div>
        <div class="flex-1 min-w-0">
          <div class="text-sm truncate" :class="playingId === s.id ? 'text-gold-300' : 'text-mist-100'">{{ s.name }}</div>
          <div class="text-xs text-mist-500 truncate mt-1">{{ s.artistName }} · {{ s.album }}</div>
        </div>
        <span class="text-xs text-mist-500 tabular-nums w-20 text-right">{{ formatPlayCount(s.playCount) }}</span>
        <button
          class="transition-colors"
          :class="player.liked(s.id) ? 'text-red-500' : 'text-mist-500 hover:text-red-400'"
          :data-test="`rank-like-${s.id}`"
          @click.stop="player.toggleLike(s.id)"
        >
          <Heart class="w-4 h-4" :fill="player.liked(s.id) ? 'currentColor' : 'none'" />
        </button>
      </div>
    </div>
  </div>
</template>
