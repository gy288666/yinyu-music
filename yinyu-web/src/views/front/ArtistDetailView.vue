<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Heart, Play } from 'lucide-vue-next'
import { formatPlayCount } from '../../data/db'
import { useAdminStore } from '../../data/adminStore'
import { usePlayerStore } from '../../stores/player'
import { ALBUM_FALLBACK, ARTIST_FALLBACK, imgFallback } from '../../utils/img'

const route = useRoute()
const router = useRouter()
const admin = useAdminStore()
const player = usePlayerStore()

const artist = computed(() => admin.state.artists.find((a) => a.id === route.params.id))
const hotSongs = computed(() =>
  admin.state.songs.filter((s) => s.artistId === artist.value?.id).sort((a, b) => b.playCount - a.playCount),
)
const albums = computed(() => admin.state.albums.filter((al) => al.artistId === artist.value?.id))
const similar = computed(() =>
  admin.state.artists.filter((a) => a.id !== artist.value?.id && a.status !== 'off').slice(0, 6),
)
const playingId = computed(() => player.current?.id)

function playAll() {
  if (!hotSongs.value.length) return
  player.playSong(hotSongs.value[0].id, hotSongs.value.map((s) => s.id))
}
function playAlbum(albumId: string) {
  const al = admin.state.albums.find((a) => a.id === albumId)
  if (!al?.songIds.length) return
  player.playSong(al.songIds[0], [...al.songIds])
  ElMessage.success(`正在播放专辑「${al.name}」`)
}
</script>

<template>
  <div v-if="artist">
    <!-- 歌手头部 -->
    <div class="flex gap-8">
      <img
        :src="artist.avatar" :alt="artist.name"
        class="w-52 h-52 rounded-2xl object-cover bg-ink-800 shrink-0 shadow-lg shadow-black/40"
        @error="imgFallback($event, ARTIST_FALLBACK)"
      />
      <div class="min-w-0 flex-1">
        <h1 class="text-3xl font-semibold">{{ artist.name }}</h1>
        <div class="mt-3 text-xs text-mist-400">{{ artist.gender }} · {{ artist.region }}</div>
        <p class="mt-4 text-sm text-mist-400 leading-6 max-w-[640px]">{{ artist.intro }}</p>
        <div class="mt-5 flex items-center gap-8">
          <div><span class="text-xl font-semibold text-mist-100">{{ hotSongs.length }}</span><span class="ml-1 text-xs text-mist-500">歌曲</span></div>
          <div><span class="text-xl font-semibold text-mist-100">{{ albums.length }}</span><span class="ml-1 text-xs text-mist-500">专辑</span></div>
          <div><span class="text-xl font-semibold text-mist-100">{{ formatPlayCount(artist.fans ?? 0) }}</span><span class="ml-1 text-xs text-mist-500">粉丝</span></div>
        </div>
        <button class="mt-6 h-10 px-6 rounded-full bg-gradient-to-r from-gold-200 to-gold-500 text-ink-900 text-sm font-medium hover:brightness-105 transition flex items-center gap-2" data-test="artist-play-all" @click="playAll">
          <Play class="w-4 h-4" fill="currentColor" /> 播放热门歌曲
        </button>
      </div>
    </div>

    <!-- 热门歌曲 -->
    <section class="mt-10">
      <h2 class="text-lg font-semibold">热门歌曲</h2>
      <div class="mt-4 grid grid-cols-2 gap-x-8">
        <div
          v-for="s in hotSongs.slice(0, 10)" :key="s.id"
          class="flex items-center gap-3 h-14 rounded-xl px-2 hover:bg-white/[0.04] transition-colors group cursor-pointer"
          :data-test="`artist-song-${s.id}`"
          @click="player.playSong(s.id, hotSongs.map((x) => x.id))"
        >
          <span class="w-4 text-center text-sm text-mist-500 tabular-nums">{{ hotSongs.indexOf(s) + 1 }}</span>
          <img :src="s.cover" :alt="s.name" class="w-10 h-10 rounded object-cover bg-ink-750 shrink-0" @error="imgFallback($event, ALBUM_FALLBACK)" />
          <div class="flex-1 min-w-0">
            <div class="text-sm truncate" :class="playingId === s.id ? 'text-gold-300' : 'text-mist-100'">{{ s.name }}</div>
          </div>
          <span class="text-xs text-mist-500">{{ formatPlayCount(s.playCount) }}</span>
          <button
            class="transition-colors"
            :class="player.liked(s.id) ? 'text-red-500' : 'text-mist-500 hover:text-red-400 opacity-0 group-hover:opacity-100'"
            @click.stop="player.toggleLike(s.id)"
          >
            <Heart class="w-4 h-4" :fill="player.liked(s.id) ? 'currentColor' : 'none'" />
          </button>
        </div>
      </div>
    </section>

    <!-- 专辑 -->
    <section class="mt-10">
      <h2 class="text-lg font-semibold">专辑列表</h2>
      <div class="mt-4 grid grid-cols-6 gap-4">
        <div v-for="al in albums" :key="al.id" class="group cursor-pointer" :data-test="`artist-album-${al.id}`" @click="playAlbum(al.id)">
          <div class="relative rounded-xl overflow-hidden aspect-square bg-ink-800">
            <img :src="al.cover" :alt="al.name" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" @error="imgFallback($event, ALBUM_FALLBACK)" />
            <span class="absolute right-2.5 bottom-2.5 w-9 h-9 rounded-full bg-black/45 border border-white/50 backdrop-blur-sm items-center justify-center text-white hidden group-hover:flex" title="播放专辑">
              <Play class="w-4 h-4 ml-0.5" fill="currentColor" />
            </span>
          </div>
          <div class="mt-2.5 text-sm text-mist-100 truncate">{{ al.name }}</div>
          <div class="mt-1 text-xs text-mist-500">{{ al.releaseDate }} · {{ al.songIds.length }}首</div>
        </div>
        <div v-if="!albums.length" class="col-span-6 text-sm text-mist-500 py-6">暂无专辑</div>
      </div>
    </section>

    <!-- 相似歌手 -->
    <section class="mt-10">
      <h2 class="text-lg font-semibold">相似歌手</h2>
      <div class="mt-4 grid grid-cols-6 gap-4">
        <div v-for="a in similar" :key="a.id" class="group cursor-pointer" :data-test="`similar-artist-${a.id}`" @click="router.push(`/artists/${a.id}`)">
          <div class="rounded-xl overflow-hidden aspect-square bg-ink-800">
            <img :src="a.avatar" :alt="a.name" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" @error="imgFallback($event, ARTIST_FALLBACK)" />
          </div>
          <div class="mt-2.5 text-sm text-mist-100 truncate">{{ a.name }}</div>
        </div>
      </div>
    </section>
  </div>
  <div v-else class="py-24 text-center text-mist-500">
    歌手不存在
    <button class="ml-2 text-gold-300" @click="router.push('/artists')">返回歌手列表</button>
  </div>
</template>
