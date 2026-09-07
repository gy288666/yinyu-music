<script setup lang="ts">
import { computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Clock3, Download, Heart, Play, Trash2 } from 'lucide-vue-next'
import { designatedAudioOf, formatTime, songById } from '../../data/db'
import { useAdminStore } from '../../data/adminStore'
import { usePlayerStore } from '../../stores/player'
import { ALBUM_FALLBACK, imgFallback } from '../../utils/img'

const props = defineProps<{ mode: 'recent' | 'liked' | 'downloads' }>()
const admin = useAdminStore()
const player = usePlayerStore()

const titles = { recent: '最近播放', liked: '我喜欢的音乐', downloads: '下载管理' }
const list = computed(() => {
  const ids = props.mode === 'recent' ? player.state.recentIds : props.mode === 'liked' ? player.state.likedIds : player.state.downloadIds
  return ids.map((id) => songById(id)!).filter(Boolean)
})
const playingId = computed(() => player.current?.id)

function playAll() {
  const ids = list.value.map((s) => s.id)
  if (!ids.length) return
  player.playSong(ids[0], ids)
  ElMessage.success(`播放${titles[props.mode]}列表`)
}
function removeItem(id: string) {
  if (props.mode === 'liked') player.toggleLike(id)
  else player.removeDownload(id)
  ElMessage.success('已移除')
}
function downloadAll() {
  let added = 0
  list.value.forEach((s) => { if (player.download(s.id)) added++ })
  ElMessage.success(added ? `已下载 ${added} 首歌曲` : '均已下载')
}
</script>

<template>
  <div>
    <div class="flex items-end justify-between">
      <div>
        <h1 class="text-2xl font-semibold">{{ titles[mode] }}</h1>
        <p class="mt-2 text-sm text-mist-500">{{ list.length }} 首歌曲</p>
      </div>
      <div v-if="list.length" class="flex items-center gap-3">
        <button class="h-10 px-6 rounded-full bg-gradient-to-r from-gold-200 to-gold-500 text-ink-900 text-sm font-medium hover:brightness-105 transition flex items-center gap-2" @click="playAll">
          <Play class="w-4 h-4" fill="currentColor" /> 播放全部
        </button>
        <button v-if="mode === 'liked'" class="h-10 px-5 rounded-full bg-ink-800 text-mist-300 hover:bg-ink-750 text-sm transition flex items-center gap-2" @click="downloadAll">
          <Download class="w-4 h-4" /> 全部下载
        </button>
      </div>
    </div>

    <div v-if="list.length" class="mt-6 bg-ink-850 rounded-2xl p-3">
      <div
        v-for="(s, i) in list" :key="s.id"
        class="flex items-center gap-4 h-16 rounded-xl px-3 hover:bg-white/[0.04] transition-colors group cursor-pointer"
        :data-test="`lib-song-${s.id}`"
        @click="player.playSong(s.id, list.map((x) => x.id))"
      >
        <span class="w-6 text-sm text-mist-500 tabular-nums text-center">{{ i + 1 }}</span>
        <img :src="s.cover" :alt="s.name" class="w-11 h-11 rounded-lg object-cover bg-ink-750 shrink-0" @error="imgFallback($event, ALBUM_FALLBACK)" />
        <div class="flex-1 min-w-0">
          <div class="text-sm truncate" :class="playingId === s.id ? 'text-gold-300' : 'text-mist-100'">{{ s.name }}</div>
          <div class="text-xs text-mist-500 truncate mt-0.5">{{ s.artistName }} · {{ s.album }}</div>
        </div>
        <span class="text-xs text-mist-500 flex items-center gap-1"><Clock3 class="w-3 h-3" /> {{ formatTime(designatedAudioOf(s).duration) }}</span>
        <button
          v-if="mode !== 'recent'"
          class="text-mist-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
          :title="mode === 'liked' ? '取消喜欢' : '删除下载'"
          :data-test="`lib-remove-${s.id}`"
          @click.stop="removeItem(s.id)"
        >
          <Trash2 v-if="mode === 'downloads'" class="w-4 h-4" />
          <Heart v-else class="w-4 h-4" fill="currentColor" />
        </button>
      </div>
    </div>
    <div v-else class="py-28 text-center">
      <Heart class="mx-auto w-10 h-10 text-ink-600" />
      <p class="mt-4 text-sm text-mist-500">{{ mode === 'recent' ? '还没有播放记录，去发现页听听吧' : mode === 'liked' ? '还没有喜欢的音乐，点击歌曲旁的 ♥ 收藏' : '下载列表为空' }}</p>
    </div>
  </div>
</template>
