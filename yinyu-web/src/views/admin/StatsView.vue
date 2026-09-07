<script setup lang="ts">
import { computed, ref } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart, LineChart, PieChart } from 'echarts/charts'
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components'
import { useAdminStore } from '../../data/adminStore'

use([CanvasRenderer, LineChart, BarChart, PieChart, GridComponent, TooltipComponent, LegendComponent])

const admin = useAdminStore()
const range = ref('近30日')

// 注册趋势
const registerOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  grid: { left: 48, right: 20, top: 30, bottom: 30 },
  xAxis: { type: 'category', boundaryGap: false, data: Array.from({ length: 14 }, (_, i) => `${i + 5}月${i + 5}日`).map((_, i) => `05-${String(i + 5).padStart(2, '0')}`), axisLabel: { color: '#7b8494' } },
  yAxis: { type: 'value', axisLabel: { color: '#7b8494' }, splitLine: { lineStyle: { color: '#eef1f6' } } },
  series: [{
    name: '新增注册',
    type: 'line',
    smooth: true,
    data: [3200, 3560, 4120, 3890, 4420, 4780, 4560, 5230, 5610, 5480, 6120, 6540, 6890, 7230],
    itemStyle: { color: '#3b82f6' },
    areaStyle: { color: 'rgba(59,130,246,0.12)' },
  }],
}))

// 内容数据：播放/收藏/分享
const contentOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  legend: { data: ['播放量', '收藏量', '分享量'], textStyle: { color: '#7b8494' }, top: 0 },
  grid: { left: 48, right: 20, top: 36, bottom: 30 },
  xAxis: { type: 'category', data: admin.state.songs.slice(0, 8).map((s) => s.name.length > 6 ? s.name.slice(0, 6) + '…' : s.name), axisLabel: { color: '#7b8494', interval: 0, rotate: 24 } },
  yAxis: { type: 'value', axisLabel: { color: '#7b8494' }, splitLine: { lineStyle: { color: '#eef1f6' } } },
  series: [
    { name: '播放量', type: 'bar', data: admin.state.songs.slice(0, 8).map((s) => Math.round(s.playCount / 1000)), itemStyle: { color: '#3b82f6' }, barWidth: 12 },
    { name: '收藏量', type: 'bar', data: admin.state.songs.slice(0, 8).map((s) => Math.round(s.playCount / 8000)), itemStyle: { color: '#22c55e' }, barWidth: 12 },
    { name: '分享量', type: 'bar', data: admin.state.songs.slice(0, 8).map((s) => Math.round(s.playCount / 40000)), itemStyle: { color: '#f59e0b' }, barWidth: 12 },
  ],
}))

// 收入构成
const incomeOption = computed(() => ({
  tooltip: { trigger: 'item', formatter: '{b}：¥{c}（{d}%）' },
  legend: { bottom: 0, textStyle: { color: '#7b8494' } },
  series: [{
    type: 'pie',
    radius: ['40%', '68%'],
    center: ['50%', '44%'],
    data: [
      { name: '会员收入', value: 286420, itemStyle: { color: '#3b82f6' } },
      { name: '付费单曲', value: 96450, itemStyle: { color: '#22c55e' } },
      { name: '数字专辑', value: 51230, itemStyle: { color: '#f59e0b' } },
      { name: '广告合作', value: 22682, itemStyle: { color: '#8b5cf6' } },
    ],
    label: { show: false },
  }],
}))

// 歌手歌曲数排行（来自 store 实时计算）
const artistRank = computed(() =>
  admin.state.artists
    .map((a) => ({ name: a.name, count: admin.state.songs.filter((s) => s.artistId === a.id).length }))
    .sort((x, y) => y.count - x.count)
    .slice(0, 8),
)
const artistOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  grid: { left: 90, right: 30, top: 10, bottom: 30 },
  xAxis: { type: 'value', minInterval: 1, axisLabel: { color: '#7b8494' }, splitLine: { lineStyle: { color: '#eef1f6' } } },
  yAxis: { type: 'category', data: artistRank.value.map((a) => a.name).reverse(), axisLabel: { color: '#7b8494' } },
  series: [{ type: 'bar', data: artistRank.value.map((a) => a.count).reverse(), itemStyle: { color: '#8b5cf6' }, barWidth: 14, label: { show: true, position: 'right', color: '#7b8494' } }],
}))

const summary = computed(() => [
  { label: '总收益（30日）', value: '¥ 456,782', delta: '+8.2%' },
  { label: '新增注册（30日）', value: '78,436', delta: '+12.4%' },
  { label: '曲库总量', value: String(admin.state.songs.length), delta: `+${admin.state.songs.length}` },
  { label: '活跃歌手', value: String(admin.state.artists.length), delta: '在架' },
])
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-end justify-between flex-wrap gap-3">
      <div>
        <h1 class="text-xl font-semibold">数据统计</h1>
        <p class="mt-1.5 text-xs text-gray-400">用户、内容与收入三大维度的运营数据分析</p>
      </div>
      <div class="flex items-center rounded-lg bg-gray-100 p-0.5 gap-0.5">
        <button
          v-for="r in ['今日', '近7日', '近30日']" :key="r"
          class="px-3.5 h-8 rounded-md text-xs transition-colors"
          :class="range === r ? 'bg-blue-500 text-white' : 'text-gray-500 hover:text-gray-700'"
          @click="range = r"
        >{{ r }}</button>
      </div>
    </div>

    <div class="grid grid-cols-4 gap-4">
      <div v-for="s in summary" :key="s.label" class="bg-white rounded-xl p-4 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
        <div class="text-xs text-gray-400">{{ s.label }}</div>
        <div class="mt-1.5 text-2xl font-semibold text-gray-800">{{ s.value }}</div>
        <div class="mt-1 text-xs text-green-500">{{ s.delta }}</div>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div class="bg-white rounded-xl p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
        <h3 class="text-[15px] font-semibold text-gray-800">注册趋势</h3>
        <VChart :option="registerOption" autoresize class="h-[280px] mt-2" />
      </div>
      <div class="bg-white rounded-xl p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
        <h3 class="text-[15px] font-semibold text-gray-800">内容数据（按歌曲）</h3>
        <VChart :option="contentOption" autoresize class="h-[280px] mt-2" />
      </div>
      <div class="bg-white rounded-xl p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
        <h3 class="text-[15px] font-semibold text-gray-800">收入构成</h3>
        <VChart :option="incomeOption" autoresize class="h-[280px] mt-2" />
      </div>
      <div class="bg-white rounded-xl p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
        <h3 class="text-[15px] font-semibold text-gray-800">歌手歌曲数排行</h3>
        <VChart :option="artistOption" autoresize class="h-[280px] mt-2" />
      </div>
    </div>
  </div>
</template>
