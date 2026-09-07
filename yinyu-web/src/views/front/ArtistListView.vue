<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Play } from 'lucide-vue-next'
import { formatPlayCount } from '../../data/db'
import { useAdminStore } from '../../data/adminStore'
import { usePlayerStore } from '../../stores/player'
import { ARTIST_FALLBACK, imgFallback } from '../../utils/img'

const router = useRouter()
const admin = useAdminStore()
const player = usePlayerStore()

const letter = ref('全部')
const gender = ref('全部')
const letters = ['全部', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')]

const list = computed(() =>
  admin.state.artists.filter((a) => {
    if (a.status === 'off') return false
    if (gender.value !== '全部' && a.gender !== gender.value) return false
    if (letter.value !== '全部' && !a.name.toUpperCase().startsWith(letter.value)) return false
    return true
  }),
)
const songCount = (id: string) => admin.state.songs.filter((s) => s.artistId === id).length
const playArtist = (id: string) => {
  const songs = admin.state.songs.filter((s) => s.artistId === id)
  if (!songs.length) return
  player.playSong(songs[0].id, songs.map((s) => s.id))
}
</script>

<template>
  <div>
    <h1 class="text-2xl font-semibold">歌手</h1>
    <p class="mt-2 text-sm text-mist-500">共 {{ list.length }} 位歌手</p>

    <div class="mt-5 flex items-center gap-2 flex-wrap">
      <span class="text-xs text-mist-500 w-10">性别</span>
      <button
        v-for="g in ['全部', '男', '女', '组合']" :key="g"
        class="px-4 h-8 rounded-full text-xs transition-colors"
        :class="gender === g ? 'bg-gold-500/15 text-gold-300' : 'bg-ink-850 text-mist-400 hover:text-white'"
        @click="gender = g"
      >{{ g }}</button>
    </div>
    <div class="mt-2 flex items-center gap-1.5 flex-wrap">
      <span class="text-xs text-mist-500 w-10">字母</span>
      <button
        v-for="l in letters" :key="l"
        class="w-9 h-8 rounded-md text-xs transition-colors"
        :class="letter === l ? 'bg-gold-500/15 text-gold-300' : 'text-mist-400 hover:text-white'"
        @click="letter = l"
      >{{ l }}</button>
    </div>

    <div class="mt-6 grid grid-cols-6 gap-4" data-test="artist-grid">
      <div v-for="a in list" :key="a.id" class="group cursor-pointer" :data-test="`artist-card-${a.id}`" @click="router.push(`/artists/${a.id}`)">
        <div class="relative rounded-xl overflow-hidden aspect-square bg-ink-800">
          <img :src="a.avatar" :alt="a.name" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" @error="imgFallback($event, ARTIST_FALLBACK)" />
          <span class="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors"></span>
          <span
            class="absolute right-2.5 bottom-2.5 w-9 h-9 rounded-full bg-black/45 border border-white/50 backdrop-blur-sm items-center justify-center text-white hidden group-hover:flex transition hover:scale-110"
            title="播放热门歌曲"
            @click.stop="playArtist(a.id)"
          >
            <Play class="w-4 h-4 ml-0.5" fill="currentColor" />
          </span>
        </div>
        <div class="mt-2.5 text-sm text-mist-100 truncate">{{ a.name }}</div>
        <div class="mt-1 text-xs text-mist-500">{{ songCount(a.id) }} 首歌曲 · {{ formatPlayCount(a.fans ?? 0) }} 粉丝</div>
      </div>
    </div>
  </div>
</template>
