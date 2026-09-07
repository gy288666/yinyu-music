<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ChevronRight, Clock3, Mail, MapPin, MessageCircle, Music4, Send, ShieldCheck, Users } from 'lucide-vue-next'
import { CONTACT, infoPageMap } from '../../data/infoPages'
import { useAdminStore } from '../../data/adminStore'

const route = useRoute()
const router = useRouter()
const admin = useAdminStore()

const page = computed(() => infoPageMap.get(String(route.params.slug)))
const openFaq = ref<number | null>(0)

// 意见反馈表单
const fbForm = reactive({ type: '产品建议', content: '', contact: '' })
const fbTypes = ['产品建议', '功能异常', '内容投诉', '其他']
function submitFeedback() {
  if (!fbForm.content.trim()) {
    ElMessage.warning('请填写反馈内容')
    return
  }
  admin.add('feedbacks', {
    user: fbForm.contact.trim() || '匿名用户',
    type: fbTypes.includes(fbForm.type) ? fbForm.type : '其他',
    content: fbForm.content.trim(),
    time: new Date().toLocaleString('zh-CN', { hour12: false }).replaceAll('/', '-'),
    status: '待处理',
    persist: true,
  })
  admin.log('前台用户', '用户管理', '提交反馈', (fbForm.contact.trim() || '匿名用户') + '：' + fbForm.content.trim().slice(0, 20))
  fbForm.content = ''
  ElMessage.success('反馈已提交，感谢你的建议！我们会在 1-3 个工作日内处理。')
}

// 联系卡片
const contactCards = [
  { icon: Users, name: '用户支持', desc: '账号、播放与会员问题', qq: CONTACT.qq, email: CONTACT.email },
  { icon: Music4, name: '版权合作', desc: '授权合作与侵权举报', qq: CONTACT.qq, email: CONTACT.email },
  { icon: Send, name: '商务洽谈', desc: '品牌、广告与异业合作', qq: CONTACT.qq, email: CONTACT.email },
  { icon: ShieldCheck, name: '内容举报', desc: '违规内容 24 小时核实处理', qq: CONTACT.qq, email: CONTACT.email },
]

function copyText(text: string) {
  navigator.clipboard?.writeText(text).then(
    () => ElMessage.success(`已复制：${text}`),
    () => ElMessage.info(text),
  )
}
</script>

<template>
  <div v-if="page" class="max-w-[880px]">
    <!-- 页头 -->
    <header class="border-b border-white/5 pb-7">
      <div class="flex items-center gap-1.5 text-xs text-mist-500">
        <router-link to="/" class="hover:text-gold-300 transition-colors">首页</router-link>
        <ChevronRight class="w-3 h-3" />
        <span>{{ page.group }}</span>
        <ChevronRight class="w-3 h-3" />
        <span class="text-mist-300">{{ page.title }}</span>
      </div>
      <h1 class="mt-4 text-3xl font-semibold">{{ page.title }}</h1>
      <p class="mt-3 text-sm text-mist-400">{{ page.subtitle }}</p>
    </header>

    <div class="mt-8 space-y-10">
      <!-- ========== 文章 / 条款类 ========== -->
      <template v-if="page.kind === 'article'">
        <section v-for="(b, i) in page.blocks" :key="i" class="scroll-mt-24">
          <h2 v-if="b.heading" class="text-lg font-semibold text-gold-300">{{ b.heading }}</h2>
          <p v-for="(p, j) in b.paragraphs" :key="j" class="mt-3 text-sm leading-7 text-mist-300">{{ p }}</p>
          <ul v-if="b.list" class="mt-3 space-y-2.5">
            <li v-for="(li, j) in b.list" :key="j" class="flex gap-2.5 text-sm leading-6 text-mist-300">
              <span class="mt-2 w-1.5 h-1.5 rounded-full bg-gold-500/70 shrink-0"></span>{{ li }}
            </li>
          </ul>
        </section>
      </template>

      <!-- ========== 常见问题 ========== -->
      <template v-else-if="page.kind === 'faq'">
        <section class="space-y-3">
          <div
            v-for="(f, i) in page.faqs" :key="i"
            class="bg-ink-850 rounded-2xl overflow-hidden border border-white/5"
            :data-test="`faq-item-${i}`"
          >
            <button
              class="w-full flex items-center justify-between gap-4 px-5 py-4 text-left text-sm text-mist-100 hover:bg-white/[0.03] transition-colors"
              @click="openFaq = openFaq === i ? null : i"
            >
              <span class="flex items-center gap-3">
                <span class="w-6 h-6 rounded-full bg-gold-500/15 text-gold-300 text-xs flex items-center justify-center shrink-0">Q</span>
                {{ f.q }}
              </span>
              <ChevronRight class="w-4 h-4 text-mist-500 transition-transform shrink-0" :class="openFaq === i ? 'rotate-90' : ''" />
            </button>
            <div v-show="openFaq === i" class="px-5 pb-5 pt-1">
              <p class="text-sm leading-7 text-mist-400 pl-9">{{ f.a }}</p>
            </div>
          </div>
        </section>
        <div class="rounded-2xl bg-ink-850 border border-white/5 p-5 text-sm text-mist-400">
          没有找到答案？<router-link to="/info/feedback" class="text-gold-300 hover:underline">提交意见反馈</router-link>
          或直接联系客服 QQ：{{ CONTACT.qq }}
        </div>
      </template>

      <!-- ========== 加入我们 ========== -->
      <template v-else-if="page.kind === 'jobs'">
        <section class="grid grid-cols-4 gap-4">
          <div class="bg-ink-850 rounded-2xl p-5 text-center">
            <Music4 class="mx-auto w-6 h-6 text-gold-300" />
            <div class="mt-2.5 text-sm text-mist-100">热爱驱动</div>
            <div class="mt-1 text-xs text-mist-500 leading-5">同事都是音乐重度用户</div>
          </div>
          <div class="bg-ink-850 rounded-2xl p-5 text-center">
            <MapPin class="mx-auto w-6 h-6 text-gold-300" />
            <div class="mt-2.5 text-sm text-mist-100">远程友好</div>
            <div class="mt-1 text-xs text-mist-500 leading-5">线上协作，灵活办公</div>
          </div>
          <div class="bg-ink-850 rounded-2xl p-5 text-center">
            <Clock3 class="mx-auto w-6 h-6 text-gold-300" />
            <div class="mt-2.5 text-sm text-mist-100">弹性节奏</div>
            <div class="mt-1 text-xs text-mist-500 leading-5">以结果为导向</div>
          </div>
          <div class="bg-ink-850 rounded-2xl p-5 text-center">
            <Users class="mx-auto w-6 h-6 text-gold-300" />
            <div class="mt-2.5 text-sm text-mist-100">共同成长</div>
            <div class="mt-1 text-xs text-mist-500 leading-5">内部分享与学习基金</div>
          </div>
        </section>

        <section class="space-y-4" data-test="job-list">
          <div v-for="(job, i) in page.jobs" :key="i" class="bg-ink-850 rounded-2xl p-5 border border-white/5 hover:border-gold-500/30 transition-colors">
            <div class="flex items-start justify-between flex-wrap gap-2">
              <div>
                <h3 class="text-base font-medium text-mist-100">{{ job.title }}</h3>
                <div class="mt-1.5 text-xs text-mist-500 flex items-center gap-2">
                  <span>{{ job.dept }}</span><span>·</span><span>{{ job.loc }}</span><span>·</span>
                  <span class="px-1.5 py-0.5 rounded bg-gold-500/10 text-gold-300">{{ job.type }}</span>
                </div>
              </div>
              <button
                class="h-9 px-5 rounded-full bg-gradient-to-r from-gold-200 to-gold-500 text-ink-900 text-xs font-medium hover:brightness-105 transition"
                :data-test="`job-apply-${i}`"
                @click="ElMessage.success(`请将简历发送至邮箱 ${CONTACT.email}（备注：应聘${job.title}）`)"
              >投递简历</button>
            </div>
            <p class="mt-3 text-sm leading-6 text-mist-300">{{ job.desc }}</p>
            <ul class="mt-3 space-y-1.5">
              <li v-for="(r, j) in job.req" :key="j" class="flex gap-2 text-xs leading-5 text-mist-500">
                <span class="mt-1.5 w-1 h-1 rounded-full bg-mist-600 shrink-0"></span>{{ r }}
              </li>
            </ul>
          </div>
        </section>

        <div class="rounded-2xl bg-gradient-to-r from-[#2a2113] to-ink-850 border border-gold-500/20 p-6">
          <h3 class="text-base font-medium text-gold-300">简历投递方式</h3>
          <p class="mt-2 text-sm text-mist-300 leading-7">
            将简历发送至邮箱 <span class="text-gold-300">{{ CONTACT.email }}</span>，或添加 QQ <span class="text-gold-300">{{ CONTACT.qq }}</span>（备注「应聘-职位名称」）。
            我们会在 3 个工作日内回复每一位投递者。
          </p>
        </div>
      </template>

      <!-- ========== 媒体报道 ========== -->
      <template v-else-if="page.kind === 'media'">
        <section class="space-y-4">
          <article v-for="(n, i) in page.news" :key="i" class="bg-ink-850 rounded-2xl p-5 border border-white/5 hover:border-gold-500/30 transition-colors">
            <div class="flex items-center gap-3 text-xs text-mist-500">
              <span class="px-2 h-5.5 py-0.5 rounded bg-white/5 flex items-center">{{ n.source }}</span>
              <span class="flex items-center gap-1"><Clock3 class="w-3 h-3" /> {{ n.date }}</span>
            </div>
            <h3 class="mt-3 text-base font-medium text-mist-100">{{ n.title }}</h3>
            <p class="mt-2 text-sm leading-6 text-mist-400">{{ n.summary }}</p>
          </article>
        </section>
        <div class="rounded-2xl bg-ink-850 border border-white/5 p-5 text-sm text-mist-400">
          媒体采访与素材索取请联系 QQ：{{ CONTACT.qq }} · 邮箱：{{ CONTACT.email }}
        </div>
      </template>

      <!-- ========== 联系我们 ========== -->
      <template v-else-if="page.kind === 'contact'">
        <section class="grid grid-cols-2 gap-4" data-test="contact-cards">
          <div v-for="(c, i) in contactCards" :key="i" class="bg-ink-850 rounded-2xl p-6 border border-white/5 hover:border-gold-500/30 transition-colors">
            <span class="w-11 h-11 rounded-full bg-gold-500/15 text-gold-300 flex items-center justify-center">
              <component :is="c.icon" class="w-5 h-5" />
            </span>
            <h3 class="mt-4 text-base font-medium text-mist-100">{{ c.name }}</h3>
            <p class="mt-1 text-xs text-mist-500">{{ c.desc }}</p>
            <div class="mt-4 space-y-2">
              <button class="flex items-center gap-2 text-sm text-mist-300 hover:text-gold-300 transition-colors group" :title="'点击复制 QQ 号'" @click="copyText(c.qq)">
                <MessageCircle class="w-4 h-4 text-mist-500 group-hover:text-gold-300" />
                QQ：{{ c.qq }}
                <span class="text-[10px] text-mist-600">（点击复制）</span>
              </button>
              <button class="flex items-center gap-2 text-sm text-mist-300 hover:text-gold-300 transition-colors group" :title="'点击复制邮箱'" @click="copyText(c.email)">
                <Mail class="w-4 h-4 text-mist-500 group-hover:text-gold-300" />
                {{ c.email }}
                <span class="text-[10px] text-mist-600">（点击复制）</span>
              </button>
            </div>
          </div>
        </section>

        <section class="rounded-2xl bg-ink-850 border border-white/5 p-6">
          <h3 class="text-base font-medium text-mist-100">服务与响应时间</h3>
          <ul class="mt-3 space-y-2 text-sm text-mist-400">
            <li class="flex gap-2.5"><span class="mt-2 w-1.5 h-1.5 rounded-full bg-gold-500/70 shrink-0"></span>客服在线时间：每日 9:00 - 21:00</li>
            <li class="flex gap-2.5"><span class="mt-2 w-1.5 h-1.5 rounded-full bg-gold-500/70 shrink-0"></span>一般咨询：1 个工作日内回复</li>
            <li class="flex gap-2.5"><span class="mt-2 w-1.5 h-1.5 rounded-full bg-gold-500/70 shrink-0"></span>版权举报：24 小时内核实处理</li>
          </ul>
        </section>

        <div class="rounded-2xl bg-gradient-to-r from-[#2a2113] to-ink-850 border border-gold-500/20 p-6 text-center">
          <p class="text-sm text-mist-300">也可以直接前往</p>
          <div class="mt-3 flex items-center justify-center gap-4">
            <router-link to="/info/feedback" class="h-10 px-6 rounded-full bg-gradient-to-r from-gold-200 to-gold-500 text-ink-900 text-sm font-medium hover:brightness-105 transition inline-flex items-center">意见反馈</router-link>
            <router-link to="/info/join" class="h-10 px-6 rounded-full bg-ink-800 text-mist-200 text-sm hover:bg-ink-750 transition inline-flex items-center">加入我们</router-link>
          </div>
        </div>
      </template>

      <!-- ========== 意见反馈表单 ========== -->
      <template v-else-if="page.kind === 'form'">
        <section class="bg-ink-850 rounded-2xl p-6 border border-white/5 max-w-[640px]" data-test="feedback-form">
          <div>
            <div class="text-xs text-mist-500 mb-2">反馈类型</div>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="t in fbTypes" :key="t"
                class="px-4 h-9 rounded-full text-xs transition-colors border"
                :class="fbForm.type === t ? 'bg-gold-500/15 text-gold-300 border-gold-500/40' : 'bg-ink-800 text-mist-400 border-transparent hover:text-white'"
                :data-test="`fb-type-${t}`"
                @click="fbForm.type = t"
              >{{ t }}</button>
            </div>
          </div>
          <div class="mt-5">
            <div class="text-xs text-mist-500 mb-2">反馈内容 <span class="text-red-400">*</span></div>
            <textarea
              v-model="fbForm.content" rows="6" maxlength="500"
              placeholder="请描述你遇到的问题或建议，我们会认真阅读每一条反馈…"
              class="w-full bg-ink-800 rounded-xl border border-white/5 focus:border-gold-500/40 outline-none p-4 text-sm text-mist-100 placeholder:text-mist-600 resize-none"
              data-test="fb-content"
            ></textarea>
            <div class="text-right text-[11px] text-mist-600 mt-1">{{ fbForm.content.length }}/500</div>
          </div>
          <div class="mt-3">
            <div class="text-xs text-mist-500 mb-2">联系方式（选填，便于我们回访）</div>
            <input
              v-model="fbForm.contact" type="text" placeholder="QQ / 邮箱 / 手机号"
              class="w-full h-11 bg-ink-800 rounded-xl border border-white/5 focus:border-gold-500/40 outline-none px-4 text-sm text-mist-100 placeholder:text-mist-600"
              data-test="fb-contact"
            />
          </div>
          <button
            class="mt-6 h-11 px-10 rounded-full bg-gradient-to-r from-gold-200 to-gold-500 text-ink-900 text-sm font-medium hover:brightness-105 transition"
            data-test="fb-submit"
            @click="submitFeedback"
          >提交反馈</button>
          <p class="mt-4 text-xs text-mist-600 leading-5">
            提交后反馈将直达运营后台；你也可以通过 QQ（{{ CONTACT.qq }}）或邮箱（{{ CONTACT.email }}）联系我们。
          </p>
        </section>
      </template>
    </div>
  </div>

  <!-- 未知 slug -->
  <div v-else class="py-28 text-center">
    <p class="text-sm text-mist-500">页面不存在或已下线</p>
    <button class="mt-4 text-sm text-gold-300" @click="router.push('/')">返回首页</button>
  </div>
</template>
