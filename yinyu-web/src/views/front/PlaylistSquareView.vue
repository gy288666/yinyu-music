<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Play } from 'lucide-vue-next'
import { useAdminStore } from '../../data/adminStore'
import { usePlayerStore } from '../../stores/player'
import { ALBUM_FALLBACK, imgFallback } from '../../utils/img'

const router = useRouter()
const admin = useAdminStore()
const player = usePlayerStore()

const category = ref('全部')
const categories = computed(() => ['全部', ...new Set(admin.state.playlists.map((p) => p.category))])
const list = computed(() =>
  admin.state.playlists.filter((p) => p.status === 'on' && (category.value === '全部' || p.category === category.value)),
)

function playPlaylist(id: string) {
  const p = admin.state.playlists.find((x) => x.id === id)
  if (!p || !p.songIds.length) return
  player.playSong(p.songIds[0], [...p.songIds])
}
</script>

<template>
  <div>
    <h1 class="text-2xl font-semibold">歌单广场</h1>
    <p class="mt-2 text-sm text-mist-500">发现好音乐，从一份好歌单开始</p>

    <div class="mt-5 flex flex-wrap items-center gap-2">
      <button
        v-for="c in categories" :key="c"
        class="px-4 h-9 rounded-full text-xs transition-colors border"
        :class="category === c ? 'bg-gold-500/15 text-gold-300 border-gold-500/40' : 'bg-ink-850 text-mist-300 hover:text-white border-transparent'"
        :data-test="`pl-cat-${c}`"
        @click="category = c"
      >{{ c }}</button>
    </div>

    <div class="mt-6 grid grid-cols-6 gap-4" data-test="pl-grid">
      <div v-for="p in list" :key="p.id" class="group cursor-pointer" :data-test="`pl-card-${p.id}`" @click="router.push(`/playlists/${p.id}`)">
        <div class="relative rounded-xl overflow-hidden aspect-square bg-ink-800">
          <img :src="p.cover" :alt="p.name" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" @error="imgFallback($event, ALBUM_FALLBACK)" />
          <span class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></span>
          <span class="absolute left-2 top-2 px-2 h-6 rounded-full bg-black/50 text-[10px] text-mist-300 flex items-center">{{ p.category }}</span>
          <span
            class="absolute right-2.5 bottom-2.5 w-9 h-9 rounded-full bg-black/45 border border-white/50 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition hover:scale-110"
            title="播放歌单"
            @click.stop="playPlaylist(p.id)"
          >
            <Play class="w-4 h-4 ml-0.5" fill="currentColor" />
          </span>
          <span v-if="p.playCountText" class="absolute left-2 bottom-2 text-[10px] text-white/90 bg-black/40 rounded px-1.5 py-0.5">{{ p.playCountText }}</span>
        </div>
        <div class="mt-2.5 text-sm text-mist-100 truncate">{{ p.name }}</div>
        <div class="mt-1 text-xs text-mist-500 truncate">{{ p.creator }} · {{ p.songIds.length }}首</div>
      </div>
    </div>
  </div>
</template>
