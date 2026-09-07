<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Heart, Play, Search } from 'lucide-vue-next'
import { formatPlayCount } from '../../data/db'
import { useAdminStore } from '../../data/adminStore'
import { usePlayerStore } from '../../stores/player'
import { ALBUM_FALLBACK, ARTIST_FALLBACK, imgFallback } from '../../utils/img'

const route = useRoute()
const router = useRouter()
const admin = useAdminStore()
const player = usePlayerStore()

const kw = ref(String(route.query.kw ?? ''))
const tab = ref('song')
const tabs = [
  { key: 'song', name: '单曲' },
  { key: 'artist', name: '歌手' },
  { key: 'playlist', name: '歌单' },
  { key: 'album', name: '专辑' },
]
watch(() => route.query.kw, (v) => { kw.value = String(v ?? '') })

const hit = (text: string) => text.toLowerCase().includes(kw.value.trim().toLowerCase())
const songHits = computed(() => (kw.value ? admin.state.songs.filter((s) => hit(s.name) || hit(s.artistName) || hit(s.album)) : []))
const artistHits = computed(() => (kw.value ? admin.state.artists.filter((a) => hit(a.name) || hit(a.region)) : []))
const playlistHits = computed(() => (kw.value ? admin.state.playlists.filter((p) => hit(p.name) || hit(p.desc) || p.tags.some(hit)) : []))
const albumHits = computed(() => (kw.value ? admin.state.albums.filter((a) => hit(a.name)) : []))

const artistOf = (id: string) => admin.state.artists.find((a) => a.id === id)

function doSearch() {
  const k = kw.value.trim()
  if (!k) return
  router.replace({ path: '/search', query: { kw: k } })
}
const playingId = computed(() => player.current?.id)
</script>

<template>
  <div>
    <!-- 搜索框 -->
    <div class="flex items-center gap-3 bg-ink-850 rounded-full px-5 h-12 max-w-[560px] border border-white/5 focus-within:border-gold-500/40 transition-colors">
      <Search class="w-4.5 h-4.5 text-mist-500 shrink-0" />
      <input
        v-model="kw" type="text" placeholder="搜索音乐、歌手、专辑、歌单"
        class="bg-transparent outline-none text-sm text-mist-100 placeholder:text-mist-500 w-full"
        data-test="search-page-input"
        @keydown.enter="doSearch"
      />
      <button class="text-xs text-mist-400 hover:text-gold-300 shrink-0" @click="doSearch">搜索</button>
    </div>

    <!-- 热门搜索 -->
    <div v-if="!kw.trim()" class="mt-6">
      <div class="text-sm text-mist-400">热门搜索</div>
      <div class="mt-3 flex flex-wrap gap-2">
        <button v-for="h in ['若月亮没来', '薛之谦', 'Jay Chou', '轻音乐', '学习']" :key="h" class="px-4 h-9 rounded-full bg-ink-850 text-xs text-mist-300 hover:text-gold-300 hover:bg-ink-800 transition-colors" @click="kw = h; doSearch()">
          {{ h }}
        </button>
      </div>
    </div>

    <template v-else>
      <div class="mt-6 flex items-center gap-6 border-b border-white/5">
        <button
          v-for="t in tabs" :key="t.key"
          class="relative pb-3 text-sm transition-colors"
          :class="tab === t.key ? 'text-gold-300 font-medium' : 'text-mist-400 hover:text-mist-100'"
          :data-test="`search-tab-${t.key}`"
          @click="tab = t.key"
        >
          {{ t.name }}<span v-if="tab === t.key" class="absolute left-1/2 -translate-x-1/2 bottom-0 w-5 h-0.5 rounded bg-gold-300"></span>
        </button>
        <span class="ml-auto text-xs text-mist-500">找到相关结果约 {{ songHits.length + artistHits.length + playlistHits.length + albumHits.length }} 条</span>
      </div>

      <!-- 单曲 -->
      <div v-if="tab === 'song'" class="mt-4" data-test="search-songs">
        <div v-if="!songHits.length" class="py-16 text-center text-sm text-mist-500">没有找到相关单曲</div>
        <div
          v-for="s in songHits" :key="s.id"
          class="flex items-center gap-4 h-16 rounded-xl px-3 hover:bg-white/[0.04] transition-colors group cursor-pointer"
          :data-test="`search-song-${s.id}`"
          @click="player.playSong(s.id, songHits.map((x) => x.id))"
        >
          <img :src="s.cover" :alt="s.name" class="w-11 h-11 rounded-lg object-cover bg-ink-750 shrink-0" @error="imgFallback($event, ALBUM_FALLBACK)" />
          <div class="flex-1 min-w-0">
            <div class="text-sm truncate" :class="playingId === s.id ? 'text-gold-300' : 'text-mist-100'">{{ s.name }}</div>
            <div class="text-xs text-mist-500 truncate mt-0.5">{{ s.artistName }} · {{ s.album }}</div>
          </div>
          <span class="text-xs text-mist-500">{{ formatPlayCount(s.playCount) }}</span>
          <button
            class="transition-colors"
            :class="player.liked(s.id) ? 'text-red-500' : 'text-mist-500 hover:text-red-400'"
            @click.stop="player.toggleLike(s.id)"
          >
            <Heart class="w-4 h-4" :fill="player.liked(s.id) ? 'currentColor' : 'none'" />
          </button>
        </div>
      </div>

      <!-- 歌手 -->
      <div v-else-if="tab === 'artist'" class="mt-5 grid grid-cols-6 gap-4" data-test="search-artists">
        <div v-if="!artistHits.length" class="col-span-6 py-16 text-center text-sm text-mist-500">没有找到相关歌手</div>
        <div v-for="a in artistHits" :key="a.id" class="group cursor-pointer" @click="router.push(`/artists/${a.id}`)">
          <div class="rounded-xl overflow-hidden aspect-square bg-ink-800">
            <img :src="a.avatar" :alt="a.name" class="w-full h-full object-cover" @error="imgFallback($event, ARTIST_FALLBACK)" />
          </div>
          <div class="mt-2.5 text-sm text-mist-100 truncate">{{ a.name }}</div>
        </div>
      </div>

      <!-- 歌单 -->
      <div v-else-if="tab === 'playlist'" class="mt-5 grid grid-cols-6 gap-4" data-test="search-playlists">
        <div v-if="!playlistHits.length" class="col-span-6 py-16 text-center text-sm text-mist-500">没有找到相关歌单</div>
        <div v-for="p in playlistHits" :key="p.id" class="group cursor-pointer" @click="router.push(`/playlists/${p.id}`)">
          <div class="rounded-xl overflow-hidden aspect-square bg-ink-800">
            <img :src="p.cover" :alt="p.name" class="w-full h-full object-cover" @error="imgFallback($event, ALBUM_FALLBACK)" />
          </div>
          <div class="mt-2.5 text-sm text-mist-100 truncate">{{ p.name }}</div>
        </div>
      </div>

      <!-- 专辑 -->
      <div v-else class="mt-5 grid grid-cols-6 gap-4" data-test="search-albums">
        <div v-if="!albumHits.length" class="col-span-6 py-16 text-center text-sm text-mist-500">没有找到相关专辑</div>
        <div v-for="al in albumHits" :key="al.id" class="group cursor-pointer" @click="player.playSong(al.songIds[0], [...al.songIds]); ElMessage.success(`播放专辑「${al.name}」`)">
          <div class="rounded-xl overflow-hidden aspect-square bg-ink-800">
            <img :src="al.cover" :alt="al.name" class="w-full h-full object-cover" @error="imgFallback($event, ALBUM_FALLBACK)" />
          </div>
          <div class="mt-2.5 text-sm text-mist-100 truncate">{{ al.name }}</div>
          <div class="mt-1 text-xs text-mist-500 truncate">{{ artistOf(al.artistId)?.name }}</div>
        </div>
      </div>
    </template>
  </div>
</template>
