<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  ArrowRight, BarChart3, CalendarCheck, ChevronLeft, ChevronRight, Heart, LayoutGrid, MoreHorizontal, Play, Radio,
} from 'lucide-vue-next'
import { charts, formatPlayCount, quickEntries, songById } from '../../data/db'
import type { Song } from '../../data/db'
import { useAdminStore } from '../../data/adminStore'
import { usePlayerStore } from '../../stores/player'
import { ALBUM_FALLBACK, ARTIST_FALLBACK, imgFallback } from '../../utils/img'

const router = useRouter()
const admin = useAdminStore()
const player = usePlayerStore()

// ---------------- Banner 轮播（管理端可增删，这里读 store） ----------------
const visibleBanners = computed(() => admin.state.banners.filter((b) => b.status === 'on').sort((a, b) => (a.sort ?? 9) - (b.sort ?? 9)))
const bannerIndex = ref(0)
let timer: number | undefined
function startBanner() {
  stopBanner()
  timer = window.setInterval(() => {
    bannerIndex.value = (bannerIndex.value + 1) % Math.max(1, visibleBanners.value.length)
  }, 5000)
}
function stopBanner() {
  if (timer) window.clearInterval(timer)
}
function goBanner(i: number) {
  bannerIndex.value = i
  startBanner()
}
function clickBanner() {
  const b = visibleBanners.value[bannerIndex.value]
  if (b?.link) router.push(b.link)
}
onMounted(startBanner)
onBeforeUnmount(stopBanner)

function startExplore() {
  document.getElementById('sec-recommend')?.scrollIntoView({ behavior: 'smooth' })
}

// ---------------- 快捷入口 ----------------
function onQuickEntry(key: string) {
  switch (key) {
    case 'daily': router.push('/recommend'); break
    case 'square': router.push('/playlists'); break
    case 'rank': router.push('/rank'); break
    case 'radio': router.push('/radio'); break
    case 'hires': router.push('/vip'); break
  }
}

// ---------------- 播放 ----------------
const playingId = computed(() => player.current?.id)
function playPlaylist(id: string) {
  const p = admin.state.playlists.find((x) => x.id === id)
  if (!p || !p.songIds.length) return
  player.playSong(p.songIds[0], [...p.songIds])
  ElMessage.success(`正在播放歌单「${p.name}」`)
}
function playSongInList(id: string, list: string[]) {
  player.playSong(id, list)
}
function rankSongIds(): string[] {
  return charts.find((c) => c.key === activeChart.value)?.songIds ?? []
}

// ---------------- 排行榜 ----------------
const activeChart = ref('hot')
function rankSongs(): Song[] {
  const ids = rankSongIds()
  return ids.map((id) => songById(id)!).filter(Boolean)
}

// ---------------- 新歌速递 ----------------
const newSongIds = ['S6', 'S7', 'S8', 'S9', 'S10', 'S11']
const newSongs = computed(() => newSongIds.map((id) => songById(id)!).filter(Boolean))
const newSongScroll = ref<HTMLElement | null>(null)
function scrollNewSongs() {
  newSongScroll.value?.scrollBy({ left: 480, behavior: 'smooth' })
}

const artistOfSong = (s: Song) => admin.state.artists.find((a) => a.id === s.artistId)

const hotList = computed(() => admin.state.playlists.filter((p) => p.hot && p.status === 'on'))
const recList = computed(() => admin.state.playlists.filter((p) => p.recommended && p.status === 'on'))
const myList = computed(() => admin.state.playlists.filter((p) => p.mine))
</script>

<template>
  <div>
    <!-- Banner -->
    <section
      class="relative h-72 rounded-2xl overflow-hidden bg-ink-850 cursor-pointer"
      @mouseenter="stopBanner" @mouseleave="startBanner"
      data-test="banner" @click="clickBanner"
    >
      <transition-group name="banner-fade">
        <img
          v-for="(b, i) in visibleBanners" v-show="i === bannerIndex" :key="b.id"
          :src="b.image" :alt="b.title"
          class="absolute inset-0 w-full h-full object-cover"
          @error="imgFallback($event, '/images/banners/background_001.jpg')"
        />
      </transition-group>
      <div class="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent"></div>
      <div class="absolute left-12 top-1/2 -translate-y-1/2 max-w-[520px] pointer-events-none">
        <h1 class="font-songti text-4xl tracking-wide text-white drop-shadow-lg">{{ visibleBanners[bannerIndex]?.title }}</h1>
        <p class="mt-4 text-mist-300 tracking-[0.3em] text-sm">{{ visibleBanners[bannerIndex]?.subtitle }}</p>
        <button
          class="mt-7 px-7 h-10 rounded-full bg-gradient-to-r from-gold-200 to-gold-500 text-ink-900 text-sm font-medium hover:brightness-105 transition shadow-lg shadow-black/30 pointer-events-auto"
          data-test="banner-cta"
          @click.stop="startExplore"
        >
          开始探索
        </button>
      </div>
      <button
        class="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 text-white/80 hover:bg-black/60 flex items-center justify-center transition"
        @click.stop="goBanner((bannerIndex + visibleBanners.length - 1) % visibleBanners.length)"
      >
        <ChevronLeft class="w-5 h-5" />
      </button>
      <button
        class="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 text-white/80 hover:bg-black/60 flex items-center justify-center transition"
        @click.stop="goBanner((bannerIndex + 1) % visibleBanners.length)"
      >
        <ChevronRight class="w-5 h-5" />
      </button>
      <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
        <button
          v-for="(b, i) in visibleBanners" :key="b.id"
          class="h-1.5 rounded-full transition-all"
          :class="i === bannerIndex ? 'w-6 bg-gold-300' : 'w-1.5 bg-white/40 hover:bg-white/70'"
          :data-test="`banner-dot-${i}`"
          @click.stop="goBanner(i)"
        ></button>
      </div>
    </section>

    <!-- 快捷入口 -->
    <section class="mt-6 bg-ink-850 rounded-2xl px-4 grid grid-cols-5" data-test="quick-entries">
      <button
        v-for="q in quickEntries" :key="q.key"
        class="flex items-center justify-center gap-3.5 py-5 rounded-xl hover:bg-white/[0.03] transition group"
        @click="onQuickEntry(q.key)"
      >
        <span class="w-11 h-11 rounded-full border border-gold-500/50 flex items-center justify-center text-gold-400 group-hover:bg-gold-500/10 transition">
          <CalendarCheck v-if="q.key === 'daily'" class="w-5 h-5" />
          <LayoutGrid v-else-if="q.key === 'square'" class="w-5 h-5" />
          <BarChart3 v-else-if="q.key === 'rank'" class="w-5 h-5" />
          <Radio v-else-if="q.key === 'radio'" class="w-5 h-5" />
          <svg v-else viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M2 13.38a5.5 5.5 0 0 0 3.5 4.6 5 5 0 0 0 8.34-1.8" stroke-linecap="round" />
            <path d="M22 10.62a5.5 5.5 0 0 0-3.5-4.6 5 5 0 0 0-8.34 1.8" stroke-linecap="round" />
            <path d="M2 10.62 5.5 12l2-3.5" stroke-linecap="round" />
            <path d="M22 13.38 18.5 12l-2 3.5" stroke-linecap="round" />
          </svg>
        </span>
        <span class="text-left">
          <span class="block text-sm text-mist-100">{{ q.name }}</span>
          <span class="block text-xs text-mist-500 mt-0.5">{{ q.desc }}</span>
        </span>
      </button>
    </section>

    <!-- 为你推荐 -->
    <section id="sec-recommend" class="mt-9" data-test="sec-recommend">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-semibold">为你推荐</h2>
        <router-link to="/playlists" class="text-xs text-mist-400 hover:text-gold-300 transition-colors flex items-center">
          更多 <ChevronRight class="w-3.5 h-3.5" />
        </router-link>
      </div>
      <div class="mt-4 grid grid-cols-6 gap-4">
        <div v-for="p in recList" :key="p.id" class="group cursor-pointer" :data-test="`rec-${p.id}`" @click="router.push(`/playlists/${p.id}`)">
          <div class="relative rounded-xl overflow-hidden aspect-square bg-ink-800">
            <img
              :src="p.cover" :alt="p.name"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              @error="imgFallback($event, ALBUM_FALLBACK)"
            />
            <span class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></span>
            <span
              class="absolute right-2.5 bottom-2.5 w-9 h-9 rounded-full bg-black/45 border border-white/50 backdrop-blur-sm flex items-center justify-center text-white opacity-90 group-hover:opacity-100 transition hover:scale-110"
              title="播放歌单"
              @click.stop="playPlaylist(p.id)"
            >
              <Play class="w-4 h-4 ml-0.5" fill="currentColor" />
            </span>
          </div>
          <div class="mt-2.5 text-sm text-mist-100 truncate">{{ p.name }}</div>
          <div class="mt-1 text-xs text-mist-500 truncate">{{ p.tags.join(' · ') }}</div>
        </div>
      </div>
    </section>

    <!-- 热门歌单 + 排行榜 -->
    <section class="mt-9 grid grid-cols-2 gap-6">
      <div id="sec-hot" class="bg-ink-850 rounded-2xl p-5" data-test="sec-hot">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold">热门歌单</h2>
          <router-link to="/playlists" class="text-xs text-mist-400 hover:text-gold-300 transition-colors flex items-center">
            更多 <ChevronRight class="w-3.5 h-3.5" />
          </router-link>
        </div>
        <div class="mt-3">
          <div
            v-for="(p, i) in hotList" :key="p.id"
            class="flex items-center gap-3.5 h-16 rounded-xl px-2 hover:bg-white/[0.04] transition-colors group cursor-pointer"
            :data-test="`hot-${p.id}`"
            @click="router.push(`/playlists/${p.id}`)"
          >
            <span class="w-6 text-sm text-mist-500 tabular-nums">{{ String(i + 1).padStart(2, '0') }}</span>
            <img
              :src="p.cover" :alt="p.name"
              class="w-10 h-10 rounded-lg object-cover bg-ink-750 shrink-0"
              @error="imgFallback($event, ALBUM_FALLBACK)"
            />
            <span class="flex-1 text-sm text-mist-100 truncate">{{ p.name }}</span>
            <span class="text-xs text-mist-500 tabular-nums">{{ p.playCountText }}</span>
            <span
              class="w-8 h-8 rounded-full bg-ink-700 flex items-center justify-center text-mist-300 group-hover:text-gold-300 transition-colors hover:!text-gold-300"
              title="播放歌单"
              @click.stop="playPlaylist(p.id)"
            >
              <Play class="w-3.5 h-3.5 ml-0.5" fill="currentColor" />
            </span>
          </div>
        </div>
      </div>

      <div id="sec-rank" class="bg-ink-850 rounded-2xl p-5" data-test="sec-rank">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold">排行榜</h2>
          <router-link to="/rank" class="text-xs text-mist-400 hover:text-gold-300 transition-colors flex items-center">
            更多 <ChevronRight class="w-3.5 h-3.5" />
          </router-link>
        </div>
        <div class="mt-2 flex items-center gap-6 border-b border-white/5">
          <button
            v-for="c in charts" :key="c.key"
            class="relative pb-2.5 text-sm transition-colors"
            :class="activeChart === c.key ? 'text-gold-300 font-medium' : 'text-mist-400 hover:text-mist-100'"
            :data-test="`chart-tab-${c.key}`"
            @click="activeChart = c.key"
          >
            {{ c.name }}
            <span v-if="activeChart === c.key" class="absolute left-1/2 -translate-x-1/2 bottom-0 w-5 h-0.5 rounded bg-gold-300"></span>
          </button>
        </div>
        <div class="mt-1">
          <div
            v-for="(s, i) in rankSongs().slice(0, 5)" :key="s.id"
            class="flex items-center gap-3 h-[58px] rounded-xl px-2 hover:bg-white/[0.04] transition-colors group cursor-pointer"
            :data-test="`rank-song-${s.id}`"
            @click="playSongInList(s.id, rankSongIds())"
          >
            <span
              class="w-5 text-center text-base font-medium tabular-nums"
              :class="i === 0 ? 'text-gold-400' : i === 1 ? 'text-mist-100' : i === 2 ? 'text-amber-600' : 'text-mist-500'"
            >{{ i + 1 }}</span>
            <img
              :src="artistOfSong(s)?.avatar ?? ALBUM_FALLBACK" :alt="s.artistName"
              class="w-11 h-11 rounded-lg object-cover bg-ink-750 shrink-0"
              @error="imgFallback($event, ARTIST_FALLBACK)"
            />
            <div class="flex-1 min-w-0">
              <div class="text-sm truncate" :class="playingId === s.id ? 'text-gold-300' : 'text-mist-100'">{{ s.name }}</div>
              <div class="text-xs text-mist-500 truncate mt-0.5">{{ s.artistName }}</div>
            </div>
            <button
              class="transition-colors"
              :class="player.liked(s.id) ? 'text-red-500' : 'text-mist-500 hover:text-red-400'"
              :data-test="`rank-like-${s.id}`"
              @click.stop="player.toggleLike(s.id)"
            >
              <Heart class="w-4 h-4" :fill="player.liked(s.id) ? 'currentColor' : 'none'" />
            </button>
            <button class="text-mist-500 hover:text-mist-100 transition-colors" title="更多操作" @click.stop="router.push(`/artists/${s.artistId}`)">
              <MoreHorizontal class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- 新歌速递 -->
    <section class="mt-9" data-test="sec-new">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-semibold">新歌速递</h2>
        <router-link to="/rank" class="text-xs text-mist-400 hover:text-gold-300 transition-colors flex items-center">
          更多 <ChevronRight class="w-3.5 h-3.5" />
        </router-link>
      </div>
      <div class="relative mt-4">
        <div ref="newSongScroll" class="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth">
          <div
            v-for="s in newSongs" :key="s.id"
            class="w-44 shrink-0 group cursor-pointer"
            :data-test="`new-${s.id}`"
            @click="playSongInList(s.id, newSongIds)"
          >
            <div class="relative rounded-xl overflow-hidden aspect-square bg-ink-800">
              <img
                :src="s.cover" :alt="s.name"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                @error="imgFallback($event, ALBUM_FALLBACK)"
              />
              <span class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></span>
              <span class="absolute right-2.5 bottom-2.5 w-9 h-9 rounded-full bg-black/45 border border-white/50 backdrop-blur-sm flex items-center justify-center text-white opacity-90 group-hover:opacity-100 transition">
                <Play class="w-4 h-4 ml-0.5" fill="currentColor" />
              </span>
            </div>
            <div class="mt-2.5 text-sm text-mist-100 truncate">{{ s.name }}</div>
            <div class="mt-1 text-xs text-mist-500 truncate">{{ s.artistName }}</div>
            <div class="mt-0.5 text-xs text-mist-500">{{ s.releaseDate }}</div>
          </div>
        </div>
        <button
          class="absolute -right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-ink-750 border border-white/10 text-mist-300 hover:text-white hover:bg-ink-700 flex items-center justify-center shadow-lg transition"
          data-test="new-scroll-btn"
          @click="scrollNewSongs"
        >
          <ArrowRight class="w-5 h-5" />
        </button>
      </div>
    </section>

    <!-- 我的歌单快捷区 -->
    <section class="mt-9">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-semibold">我的歌单</h2>
        <router-link to="/liked" class="text-xs text-mist-400 hover:text-gold-300 transition-colors flex items-center">
          我喜欢的音乐 <ChevronRight class="w-3.5 h-3.5" />
        </router-link>
      </div>
      <div class="mt-4 grid grid-cols-6 gap-4">
        <div v-for="p in myList" :key="p.id" class="group cursor-pointer" @click="router.push(`/playlists/${p.id}`)">
          <div class="relative rounded-xl overflow-hidden aspect-square bg-ink-800">
            <img :src="p.cover" :alt="p.name" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" @error="imgFallback($event, ALBUM_FALLBACK)" />
            <span class="absolute right-2.5 bottom-2.5 w-9 h-9 rounded-full bg-black/45 border border-white/50 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition hover:scale-110" title="播放歌单" @click.stop="playPlaylist(p.id)">
              <Play class="w-4 h-4 ml-0.5" fill="currentColor" />
            </span>
          </div>
          <div class="mt-2.5 text-sm text-mist-100 truncate">{{ p.name }}</div>
          <div class="mt-1 text-xs text-mist-500 truncate">{{ p.songIds.length }} 首</div>
        </div>
      </div>
    </section>

    <div class="h-2"></div>
    <span class="hidden">{{ formatPlayCount(0) }}</span>
  </div>
</template>

<style scoped>
.banner-fade-enter-active,
.banner-fade-leave-active {
  transition: opacity 0.8s ease;
}
.banner-fade-enter-from,
.banner-fade-leave-to {
  opacity: 0;
}
</style>
