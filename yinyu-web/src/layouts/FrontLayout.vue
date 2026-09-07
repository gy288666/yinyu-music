<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Compass, Crown, Download, Heart, History, Plus, Radio, Search, Sparkles } from 'lucide-vue-next'
import { getMyPlaylists, userInfo } from '../data/db'
import { useAdminStore } from '../data/adminStore'
import { usePlayerStore } from '../stores/player'
import { ALBUM_FALLBACK, imgFallback } from '../utils/img'

const route = useRoute()
const router = useRouter()
const admin = useAdminStore()
const player = usePlayerStore()

const navItems = [
  { name: '发现', to: '/' },
  { name: '推荐', to: '/recommend' },
  { name: '排行榜', to: '/rank' },
  { name: '歌单', to: '/playlists' },
  { name: '歌手', to: '/artists' },
  { name: '电台', to: '/radio' },
  { name: '会员', to: '/vip' },
]

const sideItems = [
  { name: '发现', icon: Compass, to: '/' },
  { name: '为你推荐', icon: Sparkles, to: '/recommend' },
  { name: '私人FM', icon: Radio, to: '/radio' },
  { name: '最近播放', icon: History, to: '/recent' },
  { name: '我喜欢的音乐', icon: Heart, to: '/liked' },
  { name: '下载管理', icon: Download, to: '/downloads' },
]

const activeNav = computed(() => String(route.meta.nav || ''))
const activeSide = computed(() => String(route.meta.side || ''))
const keyword = ref('')
const playingPlaylistId = ref('')

const myPlaylists = getMyPlaylists()

function onSearch() {
  const kw = keyword.value.trim()
  if (!kw) return
  router.push({ path: '/search', query: { kw } })
}

function playMyPlaylist(id: string) {
  const p = admin.state.playlists.find((x) => x.id === id)
  if (!p || !p.songIds.length) return
  playingPlaylistId.value = id
  player.playSong(p.songIds[0], [...p.songIds])
  ElMessage.success(`正在播放歌单「${p.name}」`)
}
</script>

<template>
  <div class="min-h-screen bg-ink-950 text-mist-100">
    <!-- 顶部导航 -->
    <header class="fixed top-0 left-0 right-0 h-16 z-30 bg-ink-950/90 backdrop-blur border-b border-white/5">
      <div class="h-full px-6 flex items-center gap-8 max-w-[1600px] mx-auto">
        <router-link to="/" class="flex items-center gap-2.5 w-40 shrink-0">
          <svg viewBox="0 0 32 32" class="w-8 h-8">
            <rect x="3" y="12" width="3" height="8" rx="1.5" fill="#d9b36a" />
            <rect x="9" y="7" width="3" height="18" rx="1.5" fill="#d9b36a" />
            <rect x="15" y="3" width="3" height="26" rx="1.5" fill="#d9b36a" />
            <rect x="21" y="9" width="3" height="14" rx="1.5" fill="#d9b36a" />
            <rect x="27" y="13" width="3" height="6" rx="1.5" fill="#d9b36a" />
          </svg>
          <div class="leading-none">
            <div class="text-lg font-semibold tracking-widest">音域</div>
            <div class="text-[10px] text-mist-500 tracking-[0.4em] mt-0.5">YINYU</div>
          </div>
        </router-link>
        <nav class="flex items-center gap-7 flex-1">
          <router-link
            v-for="n in navItems" :key="n.name" :to="n.to"
            class="text-sm transition-colors relative py-2"
            :class="activeNav === n.name ? 'text-gold-300 font-medium' : 'text-mist-300 hover:text-white'"
          >
            {{ n.name }}
            <span v-if="activeNav === n.name" class="absolute left-1/2 -translate-x-1/2 -bottom-0.5 w-1 h-1 rounded-full bg-gold-300"></span>
          </router-link>
        </nav>
        <div class="flex items-center gap-4 shrink-0">
          <div class="flex items-center gap-2 bg-ink-800 rounded-full px-3.5 h-9 w-60 border border-white/5 focus-within:border-gold-500/40 transition-colors">
            <Search class="w-4 h-4 text-mist-500 shrink-0" />
            <input
              v-model="keyword" type="text" placeholder="搜索音乐、歌手、专辑"
              class="bg-transparent outline-none text-xs text-mist-100 placeholder:text-mist-500 w-full"
              data-test="search-input"
              @keydown.enter="onSearch"
            />
          </div>
          <router-link to="/vip" title="会员中心">
            <img
              :src="userInfo.avatar" alt="用户头像" data-test="user-avatar"
              class="w-9 h-9 rounded-full object-cover border border-white/10 bg-ink-750"
              @error="imgFallback($event, ALBUM_FALLBACK)"
            />
          </router-link>
        </div>
      </div>
    </header>

    <!-- 左侧边栏 -->
    <aside class="fixed left-0 top-16 bottom-20 w-56 z-20 px-4 flex flex-col overflow-y-auto no-scrollbar">
      <nav class="space-y-1">
        <router-link
          v-for="item in sideItems" :key="item.name" :to="item.to"
          class="flex items-center gap-3 px-4 h-10 rounded-xl text-sm transition-colors"
          :class="activeSide === item.name ? 'bg-ink-750 text-gold-300' : 'text-mist-300 hover:bg-ink-800 hover:text-white'"
        >
          <component :is="item.icon" class="w-[18px] h-[18px]" />
          {{ item.name }}
        </router-link>
      </nav>

      <div class="mt-7">
        <div class="flex items-center justify-between px-4">
          <span class="text-xs text-mist-500">创建的歌单</span>
          <button class="text-mist-500 hover:text-mist-100 transition-colors" title="新建歌单" @click="ElMessage.info('新建歌单功能开发中')">
            <Plus class="w-4 h-4" />
          </button>
        </div>
        <div class="mt-2 space-y-0.5">
          <router-link
            v-for="p in myPlaylists" :key="p.id" :to="`/playlists/${p.id}`"
            class="flex items-center gap-3 px-4 h-11 rounded-xl hover:bg-ink-800 transition-colors group"
            :title="p.name"
          >
            <img
              :src="p.cover" :alt="p.name"
              class="w-8 h-8 rounded-md object-cover bg-ink-750 shrink-0"
              @error="imgFallback($event, ALBUM_FALLBACK)"
            />
            <span class="text-sm truncate flex-1" :class="playingPlaylistId === p.id ? 'text-gold-300' : 'text-mist-300 group-hover:text-white'">{{ p.name }}</span>
            <button
              v-if="p.songIds.length" title="播放歌单"
              class="opacity-0 group-hover:opacity-100 text-mist-500 hover:text-gold-300 transition"
              @click.prevent.stop="playMyPlaylist(p.id)"
            >
              <svg viewBox="0 0 24 24" class="w-4 h-4" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            </button>
          </router-link>
        </div>
      </div>

      <div class="mt-auto pt-8 pb-2">
        <router-link
          to="/vip"
          class="w-full h-11 rounded-full flex items-center justify-center gap-2 text-sm transition-colors"
          :class="route.path === '/vip' ? 'bg-gold-500/20 text-gold-300' : 'bg-ink-800 hover:bg-ink-750 text-mist-100'"
        >
          <Crown class="w-4 h-4 text-gold-400" />
          会员中心
        </router-link>
      </div>
    </aside>

    <!-- 主内容 -->
    <main class="pl-60 pr-6 pt-20 pb-32 max-w-[1520px]">
      <router-view />

      <!-- 页脚 -->
      <footer class="mt-14 border-t border-white/5 pt-9 pb-4">
        <div class="grid grid-cols-[1.4fr_1fr_1fr_1fr_1fr] gap-6">
          <div>
            <div class="flex items-center gap-2.5">
              <svg viewBox="0 0 32 32" class="w-7 h-7">
                <rect x="3" y="12" width="3" height="8" rx="1.5" fill="#d9b36a" />
                <rect x="9" y="7" width="3" height="18" rx="1.5" fill="#d9b36a" />
                <rect x="15" y="3" width="3" height="26" rx="1.5" fill="#d9b36a" />
                <rect x="21" y="9" width="3" height="14" rx="1.5" fill="#d9b36a" />
                <rect x="27" y="13" width="3" height="6" rx="1.5" fill="#d9b36a" />
              </svg>
              <div class="leading-none">
                <div class="text-base font-semibold tracking-widest">音域</div>
                <div class="text-[9px] text-mist-500 tracking-[0.4em] mt-0.5">YINYU</div>
              </div>
            </div>
            <p class="mt-4 text-xs text-mist-500 leading-6 max-w-[220px]">音域，探索音乐的无限可能。<br />让每一个音符，找到共鸣的旋律。</p>
          </div>
          <div>
            <div class="text-sm text-mist-300">关于我们</div>
            <ul class="mt-4 space-y-2.5">
              <li v-for="l in ['关于音域', '加入我们', '媒体报道', '联系我们']" :key="l">
                <a href="javascript:;" class="text-xs text-mist-500 hover:text-mist-300 transition-colors" @click="ElMessage.info(`「${l}」页面开发中`)">{{ l }}</a>
              </li>
            </ul>
          </div>
          <div>
            <div class="text-sm text-mist-300">帮助中心</div>
            <ul class="mt-4 space-y-2.5">
              <li v-for="l in ['常见问题', '使用指南', '意见反馈', '版权声明']" :key="l">
                <a href="javascript:;" class="text-xs text-mist-500 hover:text-mist-300 transition-colors" @click="ElMessage.info(`「${l}」页面开发中`)">{{ l }}</a>
              </li>
            </ul>
          </div>
          <div>
            <div class="text-sm text-mist-300">服务条款</div>
            <ul class="mt-4 space-y-2.5">
              <li v-for="l in ['用户协议', '隐私政策', '会员协议', '未成年人保护']" :key="l">
                <a href="javascript:;" class="text-xs text-mist-500 hover:text-mist-300 transition-colors" @click="ElMessage.info(`「${l}」页面开发中`)">{{ l }}</a>
              </li>
            </ul>
          </div>
          <div>
            <div class="text-sm text-mist-300">关注我们</div>
            <div class="mt-4 flex items-center gap-3">
              <a v-for="i in 4" :key="i" href="javascript:;" class="w-8 h-8 rounded-full bg-ink-800 flex items-center justify-center text-mist-400 hover:text-gold-300 transition-colors" @click="ElMessage.info('扫码关注（演示）')">
                <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M8 12h.01M12 12h.01M16 12h.01" stroke-linecap="round" stroke-width="2.5" />
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div class="mt-9 text-center text-xs text-mist-500">© 2024 音域 YINYU · 版权所有</div>
      </footer>
    </main>
  </div>
</template>
