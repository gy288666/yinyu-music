<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Play, Radio as RadioIcon } from 'lucide-vue-next'
import { useAdminStore } from '../../data/adminStore'
import { usePlayerStore } from '../../stores/player'
import { formatPlayCount, songById } from '../../data/db'
import { ALBUM_FALLBACK, imgFallback } from '../../utils/img'

const admin = useAdminStore()
const player = usePlayerStore()

const category = ref('全部')
const categories = computed(() => ['全部', ...new Set(admin.state.radios.map((r) => r.category))])
const list = computed(() => admin.state.radios.filter((r) => category.value === '全部' || r.category === category.value))

function listen(radioId: string) {
  const r = admin.state.radios.find((x) => x.id === radioId)
  if (!r) return
  const song = songById(r.songId)
  if (!song) return
  player.playSong(r.songId, admin.state.radios.map((x) => x.songId))
  ElMessage.success(`正在收听「${r.name}」电台`)
}
</script>

<template>
  <div>
    <div class="flex items-center gap-3">
      <span class="w-11 h-11 rounded-full bg-gold-500/15 text-gold-300 flex items-center justify-center">
        <RadioIcon class="w-5 h-5" />
      </span>
      <div>
        <h1 class="text-2xl font-semibold">电台 · 私人FM</h1>
        <p class="mt-1 text-sm text-mist-500">不用选歌，交给电台</p>
      </div>
    </div>

    <div class="mt-5 flex flex-wrap items-center gap-2">
      <button
        v-for="c in categories" :key="c"
        class="px-4 h-9 rounded-full text-xs transition-colors border"
        :class="category === c ? 'bg-gold-500/15 text-gold-300 border-gold-500/40' : 'bg-ink-850 text-mist-300 hover:text-white border-transparent'"
        @click="category = c"
      >{{ c }}</button>
    </div>

    <div class="mt-6 grid grid-cols-3 gap-5" data-test="radio-grid">
      <div v-for="r in list" :key="r.id" class="bg-ink-850 rounded-2xl overflow-hidden group cursor-pointer hover:bg-ink-800 transition-colors" :data-test="`radio-${r.id}`" @click="listen(r.id)">
        <div class="relative aspect-[16/9] overflow-hidden">
          <img :src="r.cover" :alt="r.name" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" @error="imgFallback($event, ALBUM_FALLBACK)" />
          <span class="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors"></span>
          <span class="absolute right-3 bottom-3 w-11 h-11 rounded-full bg-gold-500 text-ink-900 flex items-center justify-center opacity-90 group-hover:opacity-100 transition shadow-lg">
            <Play class="w-5 h-5 ml-0.5" fill="currentColor" />
          </span>
          <span class="absolute left-3 top-3 px-2 h-6 rounded-full bg-black/50 text-[10px] text-mist-300 flex items-center">{{ r.category }}电台</span>
        </div>
        <div class="p-4">
          <div class="text-sm text-mist-100">{{ r.name }}</div>
          <div class="mt-1.5 text-xs text-mist-500 leading-5 line-clamp-2">{{ r.desc }}</div>
          <div class="mt-2 text-[11px] text-mist-500">{{ formatPlayCount(r.listeners) }} 人在收听</div>
        </div>
      </div>
    </div>
  </div>
</template>
