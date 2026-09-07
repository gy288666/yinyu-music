<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Check, Crown, Download, Disc3, ShieldCheck, Sparkles, Zap } from 'lucide-vue-next'
import { userInfo } from '../../data/db'
import { usePlayerStore } from '../../stores/player'

const player = usePlayerStore()

const plans = [
  { id: 'month', name: '连续包月', price: 15, unit: '元/月', desc: '首月仅 8 元，随时取消', tag: '推荐' },
  { id: 'single', name: '单月会员', price: 25, unit: '元/月', desc: '不自动续费', tag: '' },
  { id: 'year', name: '年卡会员', price: 128, unit: '元/年', desc: '折合 10.7 元/月，立省 58%', tag: '超值' },
]
const selected = ref('year')
const payVisible = ref(false)

const benefits = [
  { icon: Disc3, name: 'Hi-Res 无损音质', desc: '畅听母带级音质' },
  { icon: Download, name: '会员免费下载', desc: '每月 300 首免费下载额度' },
  { icon: Zap, name: '专属推荐', desc: '更懂你的个性化推荐' },
  { icon: Crown, name: '会员曲库', desc: '解锁全部会员专属歌曲' },
  { icon: Sparkles, name: '装扮特权', desc: '专属播放器主题与挂件' },
  { icon: ShieldCheck, name: '广告免打扰', desc: '纯净聆听体验' },
]

function openPay() {
  payVisible.value = true
}
function confirmPay() {
  payVisible.value = false
  userInfo.vip = true
  ElMessage.success(`开通成功！已解锁「${plans.find((p) => p.id === selected.value)?.name}」全部权益`)
}
</script>

<template>
  <div>
    <!-- 会员横幅 -->
    <div class="relative h-44 rounded-2xl overflow-hidden bg-gradient-to-r from-[#2a2113] via-[#1d1a24] to-ink-850">
      <div class="absolute inset-0 flex items-center px-12">
        <div>
          <div class="flex items-center gap-2 text-gold-300">
            <Crown class="w-6 h-6" />
            <span class="text-2xl font-semibold tracking-wide">音域 VIP 会员中心</span>
          </div>
          <p class="mt-3 text-sm text-mist-400">解锁 Hi-Res 无损音质 · 会员曲库 · 免费下载 · 专属装扮</p>
          <p class="mt-2 text-xs text-mist-500">当前状态：{{ userInfo.vip ? '已是会员，感谢你的支持 ♪' : '尚未开通会员' }}</p>
        </div>
      </div>
      <svg viewBox="0 0 32 32" class="absolute right-16 top-1/2 -translate-y-1/2 w-40 h-40 opacity-25">
        <rect x="3" y="12" width="3" height="8" rx="1.5" fill="#d9b36a" />
        <rect x="9" y="7" width="3" height="18" rx="1.5" fill="#d9b36a" />
        <rect x="15" y="3" width="3" height="26" rx="1.5" fill="#d9b36a" />
        <rect x="21" y="9" width="3" height="14" rx="1.5" fill="#d9b36a" />
        <rect x="27" y="13" width="3" height="6" rx="1.5" fill="#d9b36a" />
      </svg>
    </div>

    <!-- 权益 -->
    <h2 class="mt-9 text-lg font-semibold">会员权益</h2>
    <div class="mt-4 grid grid-cols-6 gap-4">
      <div v-for="b in benefits" :key="b.name" class="bg-ink-850 rounded-2xl p-5 text-center hover:bg-ink-800 transition-colors">
        <span class="mx-auto w-11 h-11 rounded-full bg-gold-500/15 text-gold-300 flex items-center justify-center">
          <component :is="b.icon" class="w-5 h-5" />
        </span>
        <div class="mt-3 text-sm text-mist-100">{{ b.name }}</div>
        <div class="mt-1 text-xs text-mist-500 leading-5">{{ b.desc }}</div>
      </div>
    </div>

    <!-- 订阅方案 -->
    <h2 class="mt-9 text-lg font-semibold">选择订阅方案</h2>
    <div class="mt-4 grid grid-cols-3 gap-5" data-test="vip-plans">
      <div
        v-for="p in plans" :key="p.id"
        class="relative rounded-2xl p-6 cursor-pointer border-2 transition-all"
        :class="selected === p.id ? 'border-gold-500 bg-gold-500/10' : 'border-white/5 bg-ink-850 hover:border-white/15'"
        :data-test="`vip-plan-${p.id}`"
        @click="selected = p.id"
      >
        <span v-if="p.tag" class="absolute -top-2.5 right-5 px-2.5 h-6 rounded-full bg-gold-500 text-ink-900 text-[11px] font-medium leading-6">{{ p.tag }}</span>
        <div class="text-sm text-mist-300">{{ p.name }}</div>
        <div class="mt-3 flex items-end gap-1">
          <span class="text-4xl font-semibold text-gold-300">{{ p.price }}</span>
          <span class="text-xs text-mist-500 pb-1.5">{{ p.unit }}</span>
        </div>
        <div class="mt-3 text-xs text-mist-500">{{ p.desc }}</div>
        <div class="mt-4 space-y-2">
          <div v-for="b in benefits.slice(0, 4)" :key="b.name" class="flex items-center gap-2 text-xs text-mist-400">
            <Check class="w-3.5 h-3.5 text-gold-400" /> {{ b.name }}
          </div>
        </div>
      </div>
    </div>

    <div class="mt-8 flex justify-center">
      <button class="h-12 px-14 rounded-full bg-gradient-to-r from-gold-200 to-gold-500 text-ink-900 text-base font-medium hover:brightness-105 transition" data-test="vip-buy" @click="openPay">
        立即开通
      </button>
    </div>

    <!-- 模拟支付弹窗 -->
    <el-dialog v-model="payVisible" title="确认开通" width="380" align-center>
      <div class="text-center py-3">
        <div class="text-sm text-mist-400">您选择了</div>
        <div class="mt-2 text-lg font-medium">{{ plans.find((p) => p.id === selected)?.name }}</div>
        <div class="mt-3 text-3xl font-semibold text-gold-300">¥ {{ plans.find((p) => p.id === selected)?.price }}</div>
        <div class="mt-5 text-xs text-mist-500">点击下方按钮模拟支付完成开通（演示环境）</div>
      </div>
      <template #footer>
        <el-button @click="payVisible = false">取消</el-button>
        <el-button type="warning" data-test="vip-pay-confirm" @click="confirmPay">模拟支付</el-button>
      </template>
    </el-dialog>
  </div>
</template>
