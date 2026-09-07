<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Bell, RefreshCw } from 'lucide-vue-next'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, PieChart } from 'echarts/charts'
import { GridComponent, LegendComponent, TitleComponent, TooltipComponent } from 'echarts/components'
import { useAdminStore } from '../../data/adminStore'
import { ARTIST_FALLBACK, imgFallback } from '../../utils/img'

use([CanvasRenderer, LineChart, PieChart, GridComponent, TooltipComponent, LegendComponent, TitleComponent])

const admin = useAdminStore()

// ---------------- 指标卡（实时来自 store） ----------------
const metrics = computed(() => [
  { label: '音乐总数', value: admin.state.songs.length.toLocaleString() + '+', delta: '128', iconBg: 'bg-blue-500', icon: 'music' },
  { label: '用户总数', value: '1,258,764', delta: '3,264', iconBg: 'bg-green-500', icon: 'users' },
  { label: '今日播放量', value: '8,764,215', delta: '12.5%', iconBg: 'bg-amber-500', icon: 'play' },
  { label: '付费会员数', value: admin.state.vipRecords.filter((v) => v.status === '有效').length.toLocaleString() + '+', delta: '1,257', iconBg: 'bg-violet-500', icon: 'crown' },
  { label: '收益（元）', value: '¥ 456,782.30', delta: '8.2%', iconBg: 'bg-cyan-500', icon: 'wallet' },
])

// ---------------- 播放量趋势 ----------------
const trendRanges = ['今日', '近7日', '近30日', '自定义']
const activeRange = ref('近7日')
const trendMetric = ref('播放量')
const trendSource: Record<string, { x: string[]; v: number[] }> = {
  '今日': { x: ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'], v: [120, 86, 64, 92, 310, 486, 562, 604, 588, 655, 720, 540] },
  '近7日': { x: ['05-12', '05-13', '05-14', '05-15', '05-16', '05-17', '05-18'], v: [520, 612, 748, 826, 876.4, 792, 654] },
  '近30日': {
    x: Array.from({ length: 15 }, (_, i) => `05-${String(i + 2).padStart(2, '0')}`),
    v: [420, 465, 512, 498, 545, 590, 623, 610, 668, 702, 738, 715, 780, 812, 876.4],
  },
}
function onRangeChange(r: string) {
  if (r === '自定义') {
    ElMessage.info('自定义时间范围开发中，已为您展示近 30 日数据')
    activeRange.value = '近30日'
    return
  }
  activeRange.value = r
}
const lineOption = computed(() => {
  const src = trendSource[activeRange.value] ?? trendSource['近7日']
  return {
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const p = params[0]
        const val = Math.round(p.value * 10000).toLocaleString()
        return `${p.axisValue}<br/>播放量：${val}`
      },
    },
    grid: { left: 56, right: 24, top: 24, bottom: 32 },
    xAxis: {
      type: 'category',
      data: src.x,
      boundaryGap: false,
      axisLine: { lineStyle: { color: '#e5e9f0' } },
      axisLabel: { color: '#7b8494' },
      axisTick: { show: false },
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 1200,
      interval: 200,
      axisLabel: { color: '#7b8494', formatter: '{value}万' },
      splitLine: { lineStyle: { color: '#eef1f6' } },
    },
    series: [
      {
        type: 'line',
        data: src.v,
        smooth: false,
        symbol: 'circle',
        symbolSize: 8,
        itemStyle: { color: '#ffffff', borderColor: '#3b82f6', borderWidth: 2 },
        lineStyle: { color: '#3b82f6', width: 2.5 },
        areaStyle: {
          color: {
            type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(59,130,246,0.22)' },
              { offset: 1, color: 'rgba(59,130,246,0.01)' },
            ],
          },
        },
      },
    ],
  }
})

// ---------------- 用户来源渠道分布 ----------------
const channelTotal = '1,258,764'
const channels = reactive([
  { name: 'iOS', pct: '35.6%', value: 448121, color: '#3b82f6' },
  { name: 'Android', pct: '32.8%', value: 412875, color: '#22c55e' },
  { name: 'Web', pct: '18.7%', value: 235389, color: '#f59e0b' },
  { name: '小程序', pct: '7.9%', value: 99442, color: '#8b5cf6' },
  { name: '其他', pct: '5.0%', value: 62937, color: '#9ca3af' },
])
const pieOption = computed(() => ({
  tooltip: { trigger: 'item', formatter: '{b}：{d}%' },
  title: {
    text: '总数',
    subtext: channelTotal,
    left: 'center',
    top: '34%',
    textStyle: { fontSize: 13, color: '#6b7280', fontWeight: 400 },
    subtextStyle: { fontSize: 20, color: '#1f2937', fontWeight: 600 },
    itemGap: 4,
  },
  series: [
    {
      type: 'pie',
      radius: ['58%', '82%'],
      label: { show: false },
      data: channels.map((c) => ({ name: c.name, value: c.value, itemStyle: { color: c.color } })),
    },
  ],
}))

// ---------------- 实时动态 ----------------
interface FeedItem {
  avatar: string
  parts: { text: string; blue?: boolean }[]
  time: string
}
const feedBase: FeedItem[] = [
  { avatar: '/images/avatars/avatar_001.jpg', parts: [{ text: '用户 ' }, { text: '张*宇', blue: true }, { text: ' 购买了年度会员' }], time: '1分钟前' },
  { avatar: '/images/avatars/avatar_002.jpg', parts: [{ text: '歌曲《夏日微风》被收藏' }], time: '2分钟前' },
  { avatar: '/images/avatars/avatar_003.jpg', parts: [{ text: '用户 ' }, { text: '188****5678', blue: true }, { text: ' 注册成功' }], time: '3分钟前' },
  { avatar: '/images/avatars/avatar_004.jpg', parts: [{ text: '歌单《深夜治愈》播放量破10万' }], time: '5分钟前' },
  { avatar: '/images/avatars/avatar_005.jpg', parts: [{ text: '用户 ' }, { text: '李*', blue: true }, { text: ' 购买了单曲《星空》' }], time: '7分钟前' },
]
const feed = ref<FeedItem[]>(feedBase.map((f) => ({ ...f, parts: [...f.parts] })))
const refreshing = ref(false)
function refreshFeed() {
  refreshing.value = true
  window.setTimeout(() => {
    feed.value = [...feed.value.slice(1), { ...feed.value[0], parts: [...feed.value[0].parts], time: '刚刚' }]
    refreshing.value = false
  }, 500)
}

// ---------------- 快捷操作 ----------------
const quickActions = [
  { name: '上传音乐', to: '/admin/music' },
  { name: '添加歌单', to: '/admin/playlists' },
  { name: '添加歌手', to: '/admin/artists' },
  { name: '用户管理', to: '/admin/users' },
  { name: '会员管理', to: '/admin/vip' },
  { name: '数据统计', to: '/admin/stats' },
  { name: '公告发布', to: '/admin/notices' },
  { name: '系统设置', to: '/admin/settings' },
]
const quickIcons: Record<string, string> = {
  upload: 'M12 16V4m0 0L7 9m5-5 5 5M4 20h16',
  playlist: 'M4 6h12M4 12h12M4 18h8m6-5v7m0-7a3 3 0 1 0 0 .01',
  userplus: 'M15 19a5 5 0 0 0-10 0m5-8a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm9 2v6m3-3h-6',
  users: 'M17 20a5 5 0 0 0-10 0m5-8a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm8 8a5 5 0 0 0-4-4.9M16 3.5a4 4 0 0 1 0 7.7',
  crown: 'M3 17h18M4 17 3 7l5 4 4-7 4 7 5-4-1 10',
  chart: 'M4 20V10m6 10V4m6 16v-7m5 7H3',
  megaphone: 'M3 11v3l14 5V6L3 11Zm14-1a3 3 0 0 1 0 5M7 13v5a1 1 0 0 0 1 1h2',
  settings: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm7.4-3a7.4 7.4 0 0 0-.1-1.2l2-1.5-2-3.4-2.3 1a7.6 7.6 0 0 0-2-1.2L14.6 3h-4l-.4 2.7a7.6 7.6 0 0 0-2 1.2l-2.3-1-2 3.4 2 1.5a7.4 7.4 0 0 0 0 2.4l-2 1.5 2 3.4 2.3-1a7.6 7.6 0 0 0 2 1.2l.4 2.7h4l.4-2.7a7.6 7.6 0 0 0 2-1.2l2.3 1 2-3.4-2-1.5c.1-.4.1-.8.1-1.2Z',
}
const quickColors: Record<string, { color: string; bg: string }> = {
  上传音乐: { color: '#3b82f6', bg: '#eff6ff' },
  添加歌单: { color: '#22c55e', bg: '#f0fdf4' },
  添加歌手: { color: '#0ea5e9', bg: '#f0f9ff' },
  用户管理: { color: '#ef4444', bg: '#fef2f2' },
  会员管理: { color: '#f59e0b', bg: '#fffbeb' },
  数据统计: { color: '#06b6d4', bg: '#ecfeff' },
  公告发布: { color: '#8b5cf6', bg: '#f5f3ff' },
  系统设置: { color: '#6b7280', bg: '#f9fafb' },
}

// ---------------- 音乐审核（直接操作版权 store，与版权管理模块联动） ----------------
const auditPending = computed(() => admin.state.copyrights.filter((c) => c.status === '待审核'))
const auditPassed = computed(() => admin.state.copyrights.filter((c) => c.status === '已通过'))
const auditRejected = computed(() => admin.state.copyrights.filter((c) => c.status === '已驳回'))
const activeAuditTab = ref('pending')
const auditExpanded = ref(false)
const auditShown = computed(() => (auditExpanded.value ? auditPending.value : auditPending.value.slice(0, 4)))
function auditPass(row: { id: string; name: string }) {
  admin.update('copyrights', row.id, { status: '已通过' })
  admin.log('管理员', '内容管理', '审核通过', `《${row.name}》`)
  ElMessage.success(`已通过《${row.name}》`)
}
function auditReject(row: { id: string; name: string }) {
  admin.update('copyrights', row.id, { status: '已驳回' })
  admin.log('管理员', '内容管理', '审核驳回', `《${row.name}》`)
  ElMessage.warning(`已驳回《${row.name}》`)
}

// ---------------- 热门歌曲 TOP5 ----------------
const topSongs = computed(() =>
  [...admin.state.songs].sort((a, b) => b.playCount - a.playCount).slice(0, 5)
    .map((s, i) => ({ rank: i + 1, name: s.name, artist: s.artistName, plays: s.playCount.toLocaleString() })),
)
function rankBadgeClass(rank: number): string {
  if (rank <= 2) return 'bg-amber-100 text-amber-600'
  if (rank === 3) return 'bg-blue-100 text-blue-600'
  return 'bg-gray-100 text-gray-500'
}

// ---------------- 系统公告 ----------------
const notices = computed(() => admin.state.notices.filter((n) => n.status === 'on').slice(0, 4))
</script>

<template>
  <div class="space-y-4">
    <!-- 指标卡 -->
    <div class="grid grid-cols-5 gap-4" data-test="admin-metrics">
      <div v-for="m in metrics" :key="m.label" class="bg-white rounded-xl p-4 flex items-center gap-4 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
        <span class="w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0" :class="m.iconBg">
          <svg viewBox="0 0 24 24" class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path v-if="m.icon === 'music'" d="M9 18V6l12-2v12M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm12-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            <path v-else-if="m.icon === 'users'" d="M17 20a5 5 0 0 0-10 0m5-8a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm8 8a5 5 0 0 0-4-4.9" />
            <template v-else-if="m.icon === 'play'">
              <circle cx="12" cy="12" r="9" />
              <path d="m10 8 6 4-6 4Z" fill="currentColor" stroke="none" />
            </template>
            <path v-else-if="m.icon === 'crown'" d="M3 17h18M4 17 3 7l5 4 4-7 4 7 5-4-1 10" />
            <template v-else>
              <rect x="3" y="6" width="18" height="13" rx="2" />
              <path d="M3 10h18M16 15h2" />
            </template>
          </svg>
        </span>
        <div class="min-w-0">
          <div class="text-[13px] text-gray-500">{{ m.label }}</div>
          <div class="text-[22px] font-semibold text-gray-800 leading-7 mt-0.5 truncate">{{ m.value }}</div>
          <div class="text-xs text-gray-400 mt-0.5">
            较昨日 <span class="text-green-500">↑ {{ m.delta }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 趋势 + 饼图 + 实时动态 -->
    <div class="grid grid-cols-12 gap-4">
      <div class="col-span-5 bg-white rounded-xl p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04)]" data-test="admin-trend">
        <div class="flex items-center justify-between flex-wrap gap-2">
          <h3 class="text-[15px] font-semibold text-gray-800">播放量趋势</h3>
          <div class="flex items-center gap-4">
            <div class="flex items-center rounded-lg bg-gray-50 p-0.5 gap-0.5">
              <button
                v-for="r in trendRanges" :key="r"
                class="px-2.5 h-7 rounded-md text-xs transition-colors"
                :class="activeRange === r ? 'bg-blue-500 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'"
                :data-test="`trend-tab-${r}`"
                @click="onRangeChange(r)"
              >{{ r }}</button>
            </div>
            <el-select v-model="trendMetric" size="small" style="width: 96px">
              <el-option label="播放量" value="播放量" />
              <el-option label="用户量" value="用户量" />
            </el-select>
          </div>
        </div>
        <VChart :option="lineOption" autoresize class="h-[300px] mt-3" />
      </div>

      <div class="col-span-4 bg-white rounded-xl p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04)]" data-test="admin-channel">
        <h3 class="text-[15px] font-semibold text-gray-800">用户来源渠道分布</h3>
        <div class="flex items-center gap-4 mt-2">
          <VChart :option="pieOption" autoresize style="width: 190px; height: 190px" class="shrink-0" />
          <ul class="flex-1 space-y-2.5 min-w-0">
            <li v-for="c in channels" :key="c.name" class="flex items-center gap-2 text-xs">
              <span class="w-2 h-2 rounded-full shrink-0" :style="{ background: c.color }"></span>
              <span class="text-gray-600 w-14 shrink-0">{{ c.name }}</span>
              <span class="text-gray-400 ml-auto tabular-nums">{{ c.pct }}</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="col-span-3 bg-white rounded-xl p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04)]" data-test="admin-feed">
        <div class="flex items-center justify-between">
          <h3 class="text-[15px] font-semibold text-gray-800">实时动态</h3>
          <RefreshCw class="w-4 h-4 text-gray-400 cursor-pointer hover:text-blue-500 transition-colors" :class="refreshing ? 'animate-spin' : ''" data-test="feed-refresh" @click="refreshFeed" />
        </div>
        <ul class="mt-3 space-y-4">
          <li v-for="(f, i) in feed" :key="i" class="flex items-start gap-3">
            <el-avatar :size="34" :src="f.avatar" class="shrink-0">
              <span class="text-xs">用</span>
            </el-avatar>
            <div class="flex-1 min-w-0 text-[13px] leading-5">
              <span v-for="(p, j) in f.parts" :key="j" :class="p.blue ? 'text-blue-500' : 'text-gray-700'">{{ p.text }}</span>
            </div>
            <span class="text-xs text-gray-400 shrink-0 pt-0.5">{{ f.time }}</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- 快捷操作+审核 / TOP5+公告 -->
    <div class="grid grid-cols-12 gap-4">
      <div class="col-span-6 space-y-4">
        <div class="bg-white rounded-xl p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04)]" data-test="admin-quick">
          <h3 class="text-[15px] font-semibold text-gray-800">快捷操作</h3>
          <div class="mt-4 grid grid-cols-8 gap-2">
            <router-link
              v-for="q in quickActions" :key="q.name" :to="q.to"
              class="flex flex-col items-center gap-2 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              :data-test="`quick-${q.name}`"
            >
              <span class="w-10 h-10 rounded-full flex items-center justify-center" :style="{ background: quickColors[q.name]?.bg, color: quickColors[q.name]?.color }">
                <svg viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <path :d="quickIcons[{ 上传音乐: 'upload', 添加歌单: 'playlist', 添加歌手: 'userplus', 用户管理: 'users', 会员管理: 'crown', 数据统计: 'chart', 公告发布: 'megaphone', 系统设置: 'settings' }[q.name] ?? 'chart']" />
                </svg>
              </span>
              <span class="text-xs text-gray-600 whitespace-nowrap">{{ q.name }}</span>
            </router-link>
          </div>
        </div>

        <div class="bg-white rounded-xl p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04)]" data-test="admin-audit">
          <div class="flex items-center justify-between">
            <h3 class="text-[15px] font-semibold text-gray-800">音乐审核</h3>
            <router-link to="/admin/copyright" class="text-xs text-gray-400 hover:text-blue-500 transition-colors">前往版权管理 ›</router-link>
          </div>
          <div class="mt-2 flex items-center gap-6 border-b border-gray-100">
            <button
              v-for="t in [
                { key: 'pending', label: `待审核（${auditPending.length}）` },
                { key: 'passed', label: `审核通过（${auditPassed.length}）` },
                { key: 'rejected', label: `审核驳回（${auditRejected.length}）` },
              ]" :key="t.key"
              class="relative pb-2.5 text-sm transition-colors"
              :class="activeAuditTab === t.key ? 'text-blue-500 font-medium' : 'text-gray-500 hover:text-gray-700'"
              :data-test="`audit-tab-${t.key}`"
              @click="activeAuditTab = t.key"
            >
              {{ t.label }}
              <span v-if="activeAuditTab === t.key" class="absolute left-1/2 -translate-x-1/2 bottom-0 w-6 h-0.5 rounded bg-blue-500"></span>
            </button>
          </div>
          <div class="mt-1">
            <div v-if="activeAuditTab === 'pending'">
              <div v-for="row in auditShown" :key="row.id" class="flex items-center gap-2.5 py-2.5 border-b border-gray-50" :data-test="`audit-row-${row.id}`">
                <img :src="`/images/albums/album_0${30 + (Number(row.id.replace(/\D/g, '')) % 9)}.jpg`" :alt="row.name" class="w-10 h-10 rounded object-cover bg-gray-100 shrink-0" @error="imgFallback($event, ARTIST_FALLBACK)" />
                <div class="w-[110px] min-w-0 shrink-0">
                  <div class="text-[13px] text-gray-800 truncate">{{ row.name }}</div>
                  <div class="text-xs text-gray-400 mt-0.5">{{ row.artist }}</div>
                </div>
                <div class="w-[110px] min-w-0 shrink-0 text-[13px] text-gray-600 truncate">{{ row.source }}</div>
                <div class="flex-1 min-w-0 text-[11px] text-gray-400 tabular-nums whitespace-nowrap overflow-hidden">{{ row.submitTime }}</div>
                <div class="flex items-center gap-1.5 shrink-0">
                  <el-button size="small" plain type="success" :data-test="`audit-pass-${row.id}`" @click="auditPass(row)">通过</el-button>
                  <el-button size="small" plain type="danger" :data-test="`audit-reject-${row.id}`" @click="auditReject(row)">驳回</el-button>
                </div>
              </div>
              <div v-if="!auditPending.length" class="py-8 text-center text-sm text-gray-400">待审核列表已清空，干得漂亮 ✓</div>
              <div class="pt-3 text-center">
                <button v-if="auditPending.length > 4" class="text-xs text-gray-400 hover:text-blue-500 transition-colors" data-test="audit-more" @click="auditExpanded = !auditExpanded">
                  {{ auditExpanded ? '收起' : '查看更多' }} <span v-if="!auditExpanded">›</span>
                </button>
              </div>
            </div>
            <div v-else>
              <div v-for="row in (activeAuditTab === 'passed' ? auditPassed : auditRejected)" :key="row.id" class="flex items-center gap-2.5 py-2.5 border-b border-gray-50">
                <div class="w-[110px] min-w-0 shrink-0">
                  <div class="text-[13px] text-gray-800 truncate">{{ row.name }}</div>
                  <div class="text-xs text-gray-400 mt-0.5">{{ row.artist }}</div>
                </div>
                <div class="flex-1 text-[13px] text-gray-500 truncate">{{ row.source }}</div>
                <el-tag :type="activeAuditTab === 'passed' ? 'success' : 'danger'" size="small" effect="plain">
                  {{ activeAuditTab === 'passed' ? '已通过' : '已驳回' }}
                </el-tag>
              </div>
              <div v-if="(activeAuditTab === 'passed' ? auditPassed : auditRejected).length === 0" class="py-8 text-center text-sm text-gray-400">
                {{ activeAuditTab === 'passed' ? '暂无审核通过的记录' : '暂无审核驳回的记录' }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-span-6 space-y-4">
        <div class="bg-white rounded-xl p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04)]" data-test="admin-top5">
          <div class="flex items-center justify-between">
            <h3 class="text-[15px] font-semibold text-gray-800">热门歌曲 TOP5</h3>
            <router-link to="/admin/music" class="text-xs text-gray-400 hover:text-blue-500 transition-colors">前往音乐管理 ›</router-link>
          </div>
          <table class="w-full mt-3 text-[13px]">
            <thead>
              <tr class="text-left text-xs text-gray-400 bg-gray-50/70 rounded">
                <th class="font-normal py-2 px-3 rounded-l-md">排名</th>
                <th class="font-normal py-2">歌曲</th>
                <th class="font-normal py-2">歌手</th>
                <th class="font-normal py-2 text-right rounded-r-md">播放量</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="s in topSongs" :key="s.rank" class="border-b border-gray-50 last:border-0">
                <td class="py-3 px-3">
                  <span class="inline-flex w-6 h-6 items-center justify-center rounded-md text-xs font-medium" :class="rankBadgeClass(s.rank)">{{ s.rank }}</span>
                </td>
                <td class="text-gray-800">{{ s.name }}</td>
                <td class="text-gray-500">{{ s.artist }}</td>
                <td class="text-gray-600 text-right tabular-nums">{{ s.plays }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="bg-white rounded-xl p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04)]" data-test="admin-notices">
          <div class="flex items-center justify-between">
            <h3 class="text-[15px] font-semibold text-gray-800">系统公告</h3>
            <router-link to="/admin/notices" class="text-xs text-gray-400 hover:text-blue-500 transition-colors">前往公告管理 ›</router-link>
          </div>
          <ul class="mt-2">
            <li v-for="n in notices" :key="n.id" class="flex items-center justify-between py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50/60 rounded px-1 cursor-pointer" @click="ElMessage.info(n.content)">
              <span class="text-[13px] text-gray-700">{{ n.title }}</span>
              <span class="text-xs text-gray-400 tabular-nums">{{ n.date }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
