/**
 * 管理端 + 前台共用的统一数据仓库（内存版）。
 * 后台各模块的增删改查直接修改这里的响应式数组，前台页面即时同步展示。
 */
import { defineStore } from 'pinia'
import { reactive } from 'vue'
import { artists, banners, playlists, songs, type Artist, type Banner, type Playlist, type Song } from './db'

export interface Album {
  id: string
  name: string
  cover: string
  artistId: string
  releaseDate: string
  songIds: string[]
  status: 'on' | 'off'
}

export interface CategoryNode {
  id: string
  name: string
  children?: CategoryNode[]
}

export interface AdminUser {
  id: string
  name: string
  avatar: string
  phone: string
  registerTime: string
  lastLogin: string
  status: 'on' | 'off'
  playCount: number
  vip: boolean
}

export interface VipRecord {
  id: string
  user: string
  level: string
  startTime: string
  endTime: string
  amount: number
  status: '有效' | '已过期'
}

export interface LevelRule {
  id: string
  level: string
  expRange: string
  icon: string
  reward: string
}

export interface Feedback {
  id: string
  user: string
  type: '功能异常' | '产品建议' | '内容投诉' | '其他'
  content: string
  time: string
  status: '待处理' | '已回复'
  reply?: string
}

export interface AdminAccount {
  id: string
  account: string
  name: string
  role: string
  lastLogin: string
  status: 'on' | 'off'
}

export interface Role {
  id: string
  name: string
  desc: string
  permKeys: string[]
}

export interface Permission {
  id: string
  name: string
  code: string
  group: string
}

export interface Notice {
  id: string
  title: string
  type: '系统' | '活动' | '版权'
  date: string
  top: boolean
  status: 'on' | 'off'
  content: string
}

export interface Activity {
  id: string
  name: string
  startTime: string
  endTime: string
  status: '进行中' | '未开始' | '已结束'
  joinCount: number
  reward: string
}

export interface LogItem {
  id: string
  operator: string
  module: string
  action: string
  detail: string
  ip: string
  time: string
}

export interface CopyrightItem {
  id: string
  name: string
  artist: string
  source: string
  submitTime: string
  status: '待审核' | '已通过' | '已驳回'
}

export interface RadioStation {
  id: string
  name: string
  cover: string
  desc: string
  category: string
  listeners: number
  songId: string
}

export interface SystemSettings {
  siteName: string
  copyright: string
  beian: string
  storagePath: string
  maxAudioMb: number
  maxCoverMb: number
  maxAvatarMb: number
  audioBitrate: string
  enableTranscode: boolean
}

const img = (n: number) => `/images/albums/album_${String(n).padStart(3, '0')}.jpg`

const album = (id: string, name: string, cover: number, artistId: string, releaseDate: string, songIds: string[]): Album => ({
  id, name, cover: img(cover), artistId, releaseDate, songIds, status: 'on',
})

const albums: Album[] = [
  album('AL1', '若月亮没来', 11, 'wyuz', '2024-03-15', ['S1', 'S27']),
  album('AL2', '离别开出花', 12, 'jnsnf', '2023-06-01', ['S2', 'S26']),
  album('AL3', '渡 The Crossing', 13, 'xzj', '2018-12-27', ['S3', 'S23']),
  album('AL4', 'Goodbye & Hello', 14, 'tjy', '2007-10-19', ['S4', 'S24']),
  album('AL5', '等当我', 15, 'cmd', '2024-04-02', ['S5', 'S19']),
  album('AL6', '夏空笔记', 21, 'ldl', '2024-01-12', ['S12']),
  album('AL7', '校园录音带', 22, 'lyr', '2022-08-04', ['S13', 'S16']),
  album('AL8', '失眠飞行', 23, 'jgwkzq', '2019-11-14', ['S14', 'S17']),
  album('AL9', '星河入梦', 26, 'gwr', '2024-05-10', ['S10', 'S18']),
  album('AL10', '夜航集', 29, 'mby', '2024-05-04', ['S7', 'S21']),
  album('AL11', '蓝色气泡', 42, 'ljj', '2024-05-02', ['S8', 'S22']),
  album('AL12', '温室气球', 47, 'zjl', '2024-05-15', ['S11']),
]

const categories: CategoryNode[] = [
  { id: 'C1', name: '华语', children: [{ id: 'C1-1', name: '华语流行' }, { id: 'C1-2', name: '民谣' }, { id: 'C1-3', name: '摇滚' }] },
  { id: 'C2', name: '语种', children: [{ id: 'C2-1', name: '欧美' }, { id: 'C2-2', name: '日语' }, { id: 'C2-3', name: '韩语' }] },
  { id: 'C3', name: '风格', children: [{ id: 'C3-1', name: '电子' }, { id: 'C3-2', name: '轻音乐' }, { id: 'C3-3', name: 'ACG' }] },
  { id: 'C4', name: '场景', children: [{ id: 'C4-1', name: '学习' }, { id: 'C4-2', name: '运动' }, { id: 'C4-3', name: '睡眠' }] },
]

const users: AdminUser[] = [
  { id: 'u001', name: '林晚风', avatar: '/images/avatars/avatar_user.jpg', phone: '188****5678', registerTime: '2023-11-02 10:24', lastLogin: '2024-05-18 09:12', status: 'on', playCount: 1284, vip: true },
  { id: 'u002', name: '张*宇', avatar: '/images/avatars/avatar_001.jpg', phone: '137****2210', registerTime: '2023-08-14 21:47', lastLogin: '2024-05-18 08:55', status: 'on', playCount: 3421, vip: true },
  { id: 'u003', name: '苏格拉没有底', avatar: '/images/avatars/avatar_002.jpg', phone: '159****8834', registerTime: '2024-01-20 14:02', lastLogin: '2024-05-17 22:40', status: 'on', playCount: 876, vip: false },
  { id: 'u004', name: '李*', avatar: '/images/avatars/avatar_003.jpg', phone: '186****0921', registerTime: '2024-02-11 08:30', lastLogin: '2024-05-18 07:31', status: 'on', playCount: 2109, vip: true },
  { id: 'u005', name: '晚星', avatar: '/images/avatars/avatar_005.jpg', phone: '131****7754', registerTime: '2024-03-05 19:18', lastLogin: '2024-05-16 20:11', status: 'on', playCount: 512, vip: false },
  { id: 'u006', name: 'OceanW', avatar: '/images/avatars/avatar_admin.jpg', phone: '155****3308', registerTime: '2023-05-30 12:00', lastLogin: '2024-05-15 16:42', status: 'off', playCount: 4521, vip: true },
  { id: 'u007', name: '南山南', avatar: '/images/avatars/avatar_001.jpg', phone: '180****6642', registerTime: '2024-04-08 11:55', lastLogin: '2024-05-18 10:02', status: 'on', playCount: 233, vip: false },
  { id: 'u008', name: '阿澈', avatar: '/images/avatars/avatar_002.jpg', phone: '177****9012', registerTime: '2024-04-22 23:08', lastLogin: '2024-05-17 18:26', status: 'on', playCount: 687, vip: false },
]

const vipRecords: VipRecord[] = [
  { id: 'V1', user: '张*宇', level: '年度会员', startTime: '2024-05-18', endTime: '2025-05-18', amount: 128, status: '有效' },
  { id: 'V2', user: '李*', level: '季度会员', startTime: '2024-04-02', endTime: '2024-07-02', amount: 45, status: '有效' },
  { id: 'V3', user: '林晚风', level: '连续包月', startTime: '2024-05-01', endTime: '2024-06-01', amount: 15, status: '有效' },
  { id: 'V4', user: 'OceanW', level: '年度会员', startTime: '2023-06-01', endTime: '2024-06-01', amount: 128, status: '有效' },
  { id: 'V5', user: '晚星', level: '单月会员', startTime: '2024-03-20', endTime: '2024-04-20', amount: 25, status: '已过期' },
  { id: 'V6', user: '南山南', level: '单月会员', startTime: '2024-02-11', endTime: '2024-03-11', amount: 25, status: '已过期' },
]

const levels: LevelRule[] = [
  { id: 'L1', level: 'Lv1 音符新手', expRange: '0 - 99', icon: '🎵', reward: '新人礼包' },
  { id: 'L2', level: 'Lv2 旋律学徒', expRange: '100 - 499', icon: '🎧', reward: '每日额外推荐' },
  { id: 'L3', level: 'Lv3 节奏旅人', expRange: '500 - 1999', icon: '📻', reward: '高清音质体验券' },
  { id: 'L4', level: 'Lv4 和声达人', expRange: '2000 - 4999', icon: '🎸', reward: '专属歌单封面' },
  { id: 'L5', level: 'Lv5 律动大师', expRange: '5000 - 9999', icon: '🎹', reward: '线下活动优先购' },
  { id: 'L6', level: 'Lv6 音域传奇', expRange: '10000+', icon: '👑', reward: '年度黑胶礼盒' },
]

const seedFeedbacks: Feedback[] = [
  { id: 'F1', user: '苏格拉没有底', type: '功能异常', content: '播放进度条偶尔拖动后回跳。', time: '2024-05-18 09:24', status: '待处理' },
  { id: 'F2', user: '晚星', type: '产品建议', content: '希望歌单详情页能显示歌曲总数和总时长。', time: '2024-05-17 21:10', status: '待处理' },
  { id: 'F3', user: '南山南', type: '内容投诉', content: '某歌单封面与内容不符。', time: '2024-05-17 15:42', status: '已回复', reply: '已通知运营核实并更换封面，感谢反馈。' },
  { id: 'F4', user: '阿澈', type: '功能异常', content: '夜间模式部分文字对比度偏低。', time: '2024-05-16 19:03', status: '待处理' },
  { id: 'F5', user: '张*宇', type: '产品建议', content: '希望增加驾驶模式大按钮界面。', time: '2024-05-15 08:47', status: '已回复', reply: '已在产品规划中，预计下个版本上线。' },
  { id: 'F6', user: '李*', type: '其他', content: '会员到期忘记续费，能否保留歌单？', time: '2024-05-14 20:31', status: '已回复', reply: '歌单数据永久保留，请放心。' },
]

/** 用户提交的反馈持久化在 localStorage，刷新后依然可见 */
const feedbacks: Feedback[] = (() => {
  let saved: Feedback[] = []
  try { saved = JSON.parse(localStorage.getItem('yinyu_user_feedbacks') || '[]') } catch { saved = [] }
  return [...saved, ...seedFeedbacks]
})()

const admins: AdminAccount[] = [
  { id: 'A1', account: 'admin', name: '管理员', role: '超级管理员', lastLogin: '2024-05-18 09:00', status: 'on' },
  { id: 'A2', account: 'op_user', name: '运营小周', role: '运营专员', lastLogin: '2024-05-17 18:22', status: 'on' },
  { id: 'A3', account: 'audit_li', name: '审核小李', role: '内容审核', lastLogin: '2024-05-17 10:41', status: 'off' },
]

const permissions: Permission[] = [
  { id: 'P1', name: '音乐管理', code: 'content:music', group: '内容管理' },
  { id: 'P2', name: '歌单管理', code: 'content:playlist', group: '内容管理' },
  { id: 'P3', name: '专辑管理', code: 'content:album', group: '内容管理' },
  { id: 'P4', name: '歌手管理', code: 'content:artist', group: '内容管理' },
  { id: 'P5', name: '分类管理', code: 'content:category', group: '内容管理' },
  { id: 'P6', name: '版权管理', code: 'content:copyright', group: '内容管理' },
  { id: 'P7', name: '用户列表', code: 'user:list', group: '用户管理' },
  { id: 'P8', name: '会员管理', code: 'user:vip', group: '用户管理' },
  { id: 'P9', name: '用户反馈', code: 'user:feedback', group: '用户管理' },
  { id: 'P10', name: '轮播图管理', code: 'ops:banner', group: '运营中心' },
  { id: 'P11', name: '公告管理', code: 'ops:notice', group: '运营中心' },
  { id: 'P12', name: '数据统计', code: 'ops:stats', group: '运营中心' },
  { id: 'P13', name: '管理员管理', code: 'sys:admin', group: '系统管理' },
  { id: 'P14', name: '系统设置', code: 'sys:settings', group: '系统管理' },
  { id: 'P15', name: '操作日志', code: 'sys:log', group: '系统管理' },
]

const roles: Role[] = [
  { id: 'R1', name: '超级管理员', desc: '拥有系统全部权限', permKeys: permissions.map((p) => p.id) },
  { id: 'R2', name: '运营专员', desc: '内容与运营模块的日常维护', permKeys: ['P1', 'P2', 'P10', 'P11', 'P12'] },
  { id: 'R3', name: '内容审核', desc: '音乐与版权审核相关权限', permKeys: ['P1', 'P6'] },
]

const notices: Notice[] = [
  { id: 'N1', title: '关于开展清理违规音乐内容的公告', type: '版权', date: '2024-05-15', top: true, status: 'on', content: '为营造绿色健康的听觉环境，平台即日起开展违规音乐内容专项清理行动，重点治理低俗、侵权及音质不达标内容。' },
  { id: 'N2', title: '音域平台用户协议更新说明', type: '系统', date: '2024-05-10', top: false, status: 'on', content: '我们更新了《用户协议》中关于会员权益与内容上传的相关条款，将于 2024-06-01 正式生效。' },
  { id: 'N3', title: '五一劳动节活动上线公告', type: '活动', date: '2024-04-30', top: false, status: 'on', content: '五一限时活动上线：开通年卡立减 30 元，还能抽取黑胶礼盒。' },
  { id: 'N4', title: '关于打击侵权行为的声明', type: '版权', date: '2024-04-20', top: false, status: 'on', content: '平台始终坚持原创保护，对侵权内容零容忍，欢迎用户通过举报通道提供线索。' },
  { id: 'N5', title: 'Hi-Res 专区内容扩充公告', type: '系统', date: '2024-04-12', top: false, status: 'off', content: 'Hi-Res 专区新增 500 首无损音质曲目，会员免费畅听。' },
]

const activities: Activity[] = [
  { id: 'AC1', name: '五一半价开年卡', startTime: '2024-05-01', endTime: '2024-05-07', status: '已结束', joinCount: 18234, reward: '年卡立减30元' },
  { id: 'AC2', name: '夏日歌单征集大赛', startTime: '2024-05-20', endTime: '2024-06-20', status: '未开始', joinCount: 0, reward: '万元创作基金' },
  { id: 'AC3', name: '听歌打卡赢会员', startTime: '2024-05-10', endTime: '2024-05-31', status: '进行中', joinCount: 9642, reward: '连续打卡7天得月卡' },
  { id: 'AC4', name: '新歌首发抢听会', startTime: '2024-04-01', endTime: '2024-04-15', status: '已结束', joinCount: 12305, reward: '数字专辑免单券' },
  { id: 'AC5', name: '校园音乐人扶持计划', startTime: '2024-06-01', endTime: '2024-09-01', status: '未开始', joinCount: 0, reward: '专属推广资源' },
]

const logs: LogItem[] = [
  { id: 'LG1', operator: '管理员', module: '内容管理', action: '上架音乐', detail: '《若月亮没来（若是月亮还没来）》', ip: '192.168.1.10', time: '2024-05-18 10:21' },
  { id: 'LG2', operator: '运营小周', module: '运营中心', action: '发布公告', detail: '《关于开展清理违规音乐内容的公告》', ip: '192.168.1.22', time: '2024-05-15 09:05' },
  { id: 'LG3', operator: '管理员', module: '用户管理', action: '禁用用户', detail: 'OceanW（违规导流）', ip: '192.168.1.10', time: '2024-05-14 16:48' },
  { id: 'LG4', operator: '审核小李', module: '内容管理', action: '审核通过', detail: '《时光旅人》', ip: '192.168.1.31', time: '2024-05-13 14:12' },
  { id: 'LG5', operator: '运营小周', module: '运营中心', action: '修改轮播图', detail: 'Banner「Hi-Res 无损音质专区」', ip: '192.168.1.22', time: '2024-05-12 11:36' },
  { id: 'LG6', operator: '管理员', module: '系统管理', action: '新增管理员', detail: 'audit_li（内容审核）', ip: '192.168.1.10', time: '2024-05-10 09:30' },
  { id: 'LG7', operator: '审核小李', module: '内容管理', action: '审核驳回', detail: '《旧城故事》（音质不达标）', ip: '192.168.1.31', time: '2024-05-09 15:02' },
  { id: 'LG8', operator: '管理员', module: '系统管理', action: '修改系统设置', detail: '音频上传大小上限调整为 200MB', ip: '192.168.1.10', time: '2024-05-08 17:19' },
]

const copyrights: CopyrightItem[] = [
  { id: 'CP1', name: '时光旅人', artist: '陈默', source: '音乐人小张', submitTime: '2024-05-18 14:23', status: '待审核' },
  { id: 'CP2', name: '梦境边缘', artist: 'CloudWave', source: 'CloudWave工作室', submitTime: '2024-05-18 13:15', status: '待审核' },
  { id: 'CP3', name: '回忆拼图', artist: '小鹿', source: '独立音乐人', submitTime: '2024-05-18 11:48', status: '待审核' },
  { id: 'CP4', name: '银河低语', artist: '星野', source: '星野音乐', submitTime: '2024-05-18 10:32', status: '待审核' },
  { id: 'CP5', name: '午夜站台', artist: '列车乐队', source: '列车工作室', submitTime: '2024-05-18 09:57', status: '已通过' },
  { id: 'CP6', name: '旧城故事', artist: '老街乐队', source: '老街文化', submitTime: '2024-05-17 11:23', status: '已驳回' },
]

const radios: RadioStation[] = [
  { id: 'RD1', name: '深夜治愈电波', cover: '/images/playlists/playlist_039.jpg', desc: '夜越深，越温柔。适合失眠与独处。', category: '情绪', listeners: 128400, songId: 'S5' },
  { id: 'RD2', name: '通勤路上', cover: '/images/playlists/playlist_005.jpg', desc: '把通勤变成一场小型巡游。', category: '场景', listeners: 96500, songId: 'S26' },
  { id: 'RD3', name: '咖啡馆爵士时段', cover: '/images/playlists/playlist_013.jpg', desc: '一杯拿铁的时间，刚好一首歌。', category: '场景', listeners: 74300, songId: 'S4' },
  { id: 'RD4', name: '华语新歌雷达', cover: '/images/playlists/playlist_001.jpg', desc: '第一时间听到最新华语发行。', category: '语种', listeners: 88200, songId: 'S6' },
  { id: 'RD5', name: '备考专注 FM', cover: '/images/playlists/playlist_018.jpg', desc: '白噪音与轻音乐，陪你到交卷。', category: '场景', listeners: 152700, songId: 'S15' },
  { id: 'RD6', name: '运动节奏引擎', cover: '/images/playlists/playlist_047.jpg', desc: 'BPM 与步频同步的能量补给。', category: '风格', listeners: 69800, songId: 'S14' },
]

const settings: SystemSettings = {
  siteName: '音域 YINYU',
  copyright: '© 2024 音域 YINYU · 版权所有',
  beian: '京ICP备2024000000号-1',
  storagePath: 'E:\\yinyu-music\\resource',
  maxAudioMb: 200,
  maxCoverMb: 5,
  maxAvatarMb: 2,
  audioBitrate: '标准 128k / 高品质 320k / Hi-Res 无损',
  enableTranscode: true,
}

export const useAdminStore = defineStore('admin', () => {
  const state = reactive({
    songs: songs as Song[],
    artists: artists as Artist[],
    playlists: playlists as Playlist[],
    albums: albums as Album[],
    banners: banners as Banner[],
    categories,
    users,
    vipRecords,
    levels,
    feedbacks,
    admins,
    roles,
    permissions,
    notices,
    activities,
    logs,
    copyrights,
    radios,
    settings,
  })

  // 歌曲默认分类（演示数据未逐首标注，按歌手归类）
  const catByArtist: Record<string, string> = { xzj: '流行', tjy: '流行', cl: '民谣', mby: '民谣', xs: '流行', gwr: '流行', zjl: '流行', jnsnf: '流行', wyuz: '民谣', cmd: '流行', lyr: '民谣', ldl: '电子', jgwkzq: '电子', fspiano: '轻音乐' }
  state.songs.forEach((s) => { s.category = s.category ?? catByArtist[s.artistId] ?? '流行' })

  let seq = 1000
  const nextId = (prefix: string) => `${prefix}${++seq}`

  function add(key: keyof typeof state, item: Record<string, any>) {
    ;(state[key] as any[]).unshift({ id: nextId('X'), ...item })
    // 前台用户提交的反馈写入 localStorage，跨刷新保留
    if (key === 'feedbacks' && item.persist) {
      const userOnes = (state.feedbacks as any[]).filter((f) => f.persist)
      localStorage.setItem('yinyu_user_feedbacks', JSON.stringify(userOnes))
    }
  }
  function update(key: keyof typeof state, id: string, patch: Record<string, any>) {
    const list = state[key] as any[]
    const idx = list.findIndex((r) => r.id === id)
    if (idx >= 0) Object.assign(list[idx], patch)
  }
  function remove(key: keyof typeof state, id: string) {
    const list = state[key] as any[]
    const idx = list.findIndex((r) => r.id === id)
    if (idx >= 0) list.splice(idx, 1)
  }
  function log(operator: string, module: string, action: string, detail: string) {
    state.logs.unshift({
      id: nextId('LG'),
      operator,
      module,
      action,
      detail,
      ip: '192.168.1.10',
      time: new Date().toLocaleString('zh-CN', { hour12: false }).replaceAll('/', '-'),
    })
  }

  return { state, add, update, remove, log, nextId }
})
