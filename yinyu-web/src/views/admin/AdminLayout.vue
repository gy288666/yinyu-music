<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Bell, PanelLeftClose, PanelLeftOpen } from 'lucide-vue-next'
import { ChevronDown } from 'lucide-vue-next'
import { useAdminStore } from '../../data/adminStore'

const route = useRoute()
const router = useRouter()
const admin = useAdminStore()
const collapsed = ref(false)
import { ref } from 'vue'

interface MenuGroup {
  label: string
  items: { name: string; to: string }[]
}
const menuGroups: MenuGroup[] = [
  {
    label: '内容管理',
    items: [
      { name: '音乐管理', to: '/admin/music' },
      { name: '歌单管理', to: '/admin/playlists' },
      { name: '专辑管理', to: '/admin/albums' },
      { name: '歌手管理', to: '/admin/artists' },
      { name: '分类管理', to: '/admin/categories' },
      { name: '版权管理', to: '/admin/copyright' },
    ],
  },
  {
    label: '用户管理',
    items: [
      { name: '用户列表', to: '/admin/users' },
      { name: '会员管理', to: '/admin/vip' },
      { name: '用户等级', to: '/admin/levels' },
      { name: '用户反馈', to: '/admin/feedback' },
    ],
  },
  {
    label: '运营中心',
    items: [
      { name: '轮播图管理', to: '/admin/banners' },
      { name: '公告管理', to: '/admin/notices' },
      { name: '活动管理', to: '/admin/activities' },
      { name: '数据统计', to: '/admin/stats' },
    ],
  },
  {
    label: '系统管理',
    items: [
      { name: '管理员管理', to: '/admin/admins' },
      { name: '角色管理', to: '/admin/roles' },
      { name: '权限管理', to: '/admin/permissions' },
      { name: '系统设置', to: '/admin/settings' },
      { name: '操作日志', to: '/admin/logs' },
    ],
  },
]

const activePath = computed(() => route.path)
const pageTitle = computed(() => String(route.meta.title ?? '首页'))

const menuIcons: Record<string, string> = {
  '音乐管理': 'M9 18V6l12-2v12M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm12-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z',
  '歌单管理': 'M4 6h12M4 12h12M4 18h8m6-5v7m0-7a3 3 0 1 0 0 .01',
  '专辑管理': 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Zm0-7a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
  '歌手管理': 'M12 15a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm8 6a8 8 0 0 0-16 0',
  '分类管理': 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  '版权管理': 'M12 22s8-3 8-10V5l-8-3-8 3v7c0 7 8 10 8 10Zm-2.5-11.5 5 5m0-5-5 5',
  '用户列表': 'M17 20a5 5 0 0 0-10 0m5-8a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm8 8a5 5 0 0 0-4-4.9',
  '会员管理': 'M3 17h18M4 17 3 7l5 4 4-7 4 7 5-4-1 10',
  '用户等级': 'M6 3h12l-3 6H9L6 3Zm3 6 3 12 3-12',
  '用户反馈': 'M21 12a8 8 0 0 1-8 8H4l2-3a8 8 0 1 1 15-5Z',
  '轮播图管理': 'M4 5h16v11H4zM8 20h8M12 16v4',
  '公告管理': 'M3 11v3l14 5V6L3 11Zm14-1a3 3 0 0 1 0 5M7 13v5a1 1 0 0 0 1 1h2',
  '活动管理': 'M4 5h16v16H4zM4 9h16M8 3v4m8-4v4m-7 9 2 2 4-4',
  '数据统计': 'M4 20V10m6 10V4m6 16v-7m5 7H3',
  '管理员管理': 'M12 15a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm8 6a8 8 0 0 0-16 0m14-17 2 2 3-3',
  '角色管理': 'M16 19a4 4 0 0 0-8 0m4-6a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm9-4-1.5 1.5L20 7',
  '权限管理': 'M7 11V8a5 5 0 0 1 10 0v3M5 11h14v10H5z',
  '系统设置': 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm8-3-.1 1.2 2 1.5-2 3.4-2.3-1a7.6 7.6 0 0 1-2 1.2L15.4 21h-4l-.4-2.7a7.6 7.6 0 0 1-2-1.2l-2.3 1-2-3.4 2-1.5A7.4 7.4 0 0 1 6.6 12',
  '操作日志': 'M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01',
}
</script>

<template>
  <div class="min-h-screen bg-[#f5f7fa] text-gray-800 flex">
    <!-- 侧边栏 -->
    <aside
      class="shrink-0 min-h-screen bg-[#232b3a] text-[#a3adc2] transition-all duration-300 flex flex-col sticky top-0 h-screen"
      :class="collapsed ? 'w-[64px]' : 'w-[220px]'"
      data-test="admin-sidebar"
    >
      <div class="h-16 flex items-center gap-2.5 px-4 border-b border-white/5 overflow-hidden whitespace-nowrap">
        <svg viewBox="0 0 32 32" class="w-8 h-8 shrink-0">
          <rect x="3" y="12" width="3" height="8" rx="1.5" fill="#d9b36a" />
          <rect x="9" y="7" width="3" height="18" rx="1.5" fill="#d9b36a" />
          <rect x="15" y="3" width="3" height="26" rx="1.5" fill="#d9b36a" />
          <rect x="21" y="9" width="3" height="14" rx="1.5" fill="#d9b36a" />
          <rect x="27" y="13" width="3" height="6" rx="1.5" fill="#d9b36a" />
        </svg>
        <div v-if="!collapsed" class="leading-none">
          <div class="text-[15px] font-semibold text-white tracking-wider">{{ admin.state.settings.siteName }} <span class="font-normal text-xs text-[#8b95ab]">管理系统</span></div>
          <div class="text-[9px] text-[#6b7590] tracking-[0.35em] mt-1">YINYU</div>
        </div>
      </div>

      <nav class="flex-1 overflow-y-auto no-scrollbar py-2">
        <router-link
          to="/admin/dashboard"
          class="flex items-center gap-2.5 mx-2.5 h-11 px-3.5 rounded-lg text-sm transition-colors"
          :class="activePath === '/admin/dashboard' ? 'bg-blue-500 text-white' : 'hover:bg-white/5 hover:text-white'"
          data-test="menu-home"
        >
          <svg viewBox="0 0 24 24" class="menu-ico" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1Z" stroke-linecap="round" stroke-linejoin="round" /></svg>
          <span v-if="!collapsed">首页</span>
        </router-link>
        <template v-for="g in menuGroups" :key="g.label">
          <div v-if="!collapsed" class="px-5 pt-4 pb-1.5 text-[11px] text-[#5d6880]">{{ g.label }}</div>
          <router-link
            v-for="item in g.items" :key="item.name" :to="item.to"
            class="flex items-center gap-2.5 mx-2.5 h-11 px-3.5 rounded-lg text-sm transition-colors"
            :class="activePath === item.to ? 'bg-blue-500 text-white' : 'hover:bg-white/5 hover:text-white'"
            :data-test="`menu-${item.name}`"
            :title="item.name"
          >
            <svg viewBox="0 0 24 24" class="menu-ico shrink-0" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path :d="menuIcons[item.name]" />
            </svg>
            <span v-if="!collapsed" class="truncate">{{ item.name }}</span>
          </router-link>
        </template>
      </nav>

      <button
        class="h-12 flex items-center gap-2.5 px-5 text-sm text-[#a3adc2] hover:text-white border-t border-white/5 transition-colors shrink-0"
        data-test="admin-collapse"
        @click="collapsed = !collapsed"
      >
        <PanelLeftClose v-if="!collapsed" class="w-4 h-4" />
        <PanelLeftOpen v-else class="w-4 h-4" />
        <span v-if="!collapsed">收起菜单</span>
      </button>
    </aside>

    <!-- 右侧主体 -->
    <div class="flex-1 min-w-0 flex flex-col">
      <!-- 顶栏 -->
      <header class="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-5 sticky top-0 z-10">
        <div class="flex items-center gap-3">
          <PanelLeftClose class="w-5 h-5 text-gray-300" />
          <span class="text-[15px] text-gray-700" data-test="admin-breadcrumb">{{ pageTitle }}</span>
        </div>
        <div class="flex items-center gap-5">
          <button class="text-xs text-gray-400 hover:text-blue-500 transition-colors" @click="router.push('/')">返回前台</button>
          <el-badge :value="admin.state.feedbacks.filter((f) => f.status === '待处理').length" :offset="[-2, 4]" data-test="admin-notify">
            <Bell class="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-700" @click="router.push('/admin/feedback')" />
          </el-badge>
          <el-dropdown>
            <span class="flex items-center gap-2.5 cursor-pointer">
              <el-avatar :size="34" src="/images/avatars/avatar_admin.jpg">
                <span class="text-sm">管</span>
              </el-avatar>
              <span class="text-sm text-gray-700">管理员</span>
              <ChevronDown class="w-3.5 h-3.5 text-gray-400" />
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="ElMessage.info('个人资料开发中')">个人资料</el-dropdown-item>
                <el-dropdown-item divided @click="router.push('/')">返回前台</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </header>

      <!-- 内容 -->
      <main class="p-5 flex-1">
        <router-view />
        <footer class="text-center text-xs text-gray-400 py-4">© 2024 {{ admin.state.settings.siteName }} · 管理系统 v2.1.0</footer>
      </main>
    </div>
  </div>
</template>

<style scoped>
.menu-ico {
  width: 17px;
  height: 17px;
  flex-shrink: 0;
}
</style>
