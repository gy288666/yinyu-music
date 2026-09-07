/**
 * 后台各管理模块的通用 CRUD 配置。
 * GenericCrud.vue 依据这些配置渲染表格、搜索、表单弹窗与行操作。
 */
import type { useAdminStore } from '../../data/adminStore'

type Store = ReturnType<typeof useAdminStore>

export interface CrudColumn {
  prop: string
  label: string
  type?: 'text' | 'image' | 'tag' | 'switch' | 'money' | 'count' | 'bold'
  sub?: string
  tagMap?: Record<string, string>
  width?: number | string
  formatter?: (row: any, store: Store) => string
}

export interface CrudField {
  prop: string
  label: string
  type?: 'text' | 'textarea' | 'number' | 'select' | 'date' | 'switch' | 'image'
  optionsFrom?: 'artists' | 'categories' | 'roles' | 'noticeTypes' | 'feedbackTypes' | 'plans' | 'statuses'
  options?: { label: string; value: any }[]
  required?: boolean
  placeholder?: string
  default?: any
}

export interface CrudModule {
  key: string
  title: string
  desc?: string
  searchFields: string[]
  searchPlaceholder?: string
  columns: CrudColumn[]
  fields: CrudField[]
  selectable?: boolean
  batchDelete?: boolean
  batchStatus?: { label: string; value: any }[]
  readonly?: boolean
  tree?: boolean
  exportable?: boolean
  rowActions?: ('edit' | 'delete' | 'reply' | 'audit' | 'resetPwd' | 'permTree')[]
  defaultRecord?: Record<string, any>
}

const onOff: CrudColumn = { prop: 'status', label: '状态', type: 'switch', tagMap: { on: '上架', off: '下架' } }
const statusField: CrudField = { prop: 'status', label: '状态', type: 'select', options: [{ label: '上架', value: 'on' }, { label: '下架', value: 'off' }], default: 'on' }

export const crudModules: Record<string, CrudModule> = {
  music: {
    key: 'songs',
    title: '音乐管理',
    desc: '平台全部音乐的上架、编辑与分类管理。改动即时同步到前台。',
    searchFields: ['name', 'artistName', 'album'],
    searchPlaceholder: '搜索歌曲 / 歌手 / 专辑',
    selectable: true,
    batchDelete: true,
    batchStatus: [{ label: '批量上架', value: 'on' }, { label: '批量下架', value: 'off' }],
    rowActions: ['edit', 'delete'],
    columns: [
      { prop: 'cover', label: '音乐名称', type: 'image', sub: 'artistName' },
      { prop: 'album', label: '专辑' },
      { prop: 'category', label: '分类', type: 'tag', tagMap: { 流行: 'primary', 民谣: 'success', 电子: 'warning', 轻音乐: 'info', ACG: 'danger', 摇滚: 'danger' } },
      { prop: 'playCount', label: '播放量', type: 'count' },
      { prop: 'releaseDate', label: '发行日期' },
      onOff,
    ],
    fields: [
      { prop: 'name', label: '歌曲名称', required: true, placeholder: '请输入歌曲名称' },
      { prop: 'artistId', label: '歌手', type: 'select', optionsFrom: 'artists', required: true },
      { prop: 'album', label: '专辑名称', required: true },
      { prop: 'category', label: '分类', type: 'select', options: [{ label: '流行', value: '流行' }, { label: '民谣', value: '民谣' }, { label: '电子', value: '电子' }, { label: '轻音乐', value: '轻音乐' }, { label: 'ACG', value: 'ACG' }, { label: '摇滚', value: '摇滚' }] },
      { prop: 'cover', label: '封面路径', type: 'image', default: '/images/albums/album_001.jpg' },
      { prop: 'releaseDate', label: '发行日期', type: 'date', default: '2024-05-20' },
      { prop: 'playCount', label: '初始播放量', type: 'number', default: 0 },
      statusField,
    ],
    defaultRecord: {},
  },
  playlist: {
    key: 'playlists',
    title: '歌单管理',
    desc: '前台歌单的增删改查，含首页推荐位与热门位标记。',
    searchFields: ['name', 'creator', 'category'],
    searchPlaceholder: '搜索歌单 / 创建者',
    selectable: true,
    batchDelete: true,
    rowActions: ['edit', 'delete'],
    columns: [
      { prop: 'cover', label: '歌单', type: 'image', sub: 'creator' },
      { prop: 'category', label: '分类', type: 'tag', tagMap: { 流行: 'primary', 民谣: 'success', 电子: 'warning', 轻音乐: 'info', ACG: 'danger' } },
      { prop: 'songIds', label: '歌曲数', type: 'count', formatter: (row) => String(row.songIds?.length ?? 0) },
      { prop: 'collectCount', label: '收藏数', type: 'count' },
      { prop: 'hot', label: '热门位', type: 'switch', tagMap: { true: '展示', false: '隐藏' } },
      { prop: 'recommended', label: '推荐位', type: 'switch', tagMap: { true: '展示', false: '隐藏' } },
      onOff,
    ],
    fields: [
      { prop: 'name', label: '歌单名称', required: true },
      { prop: 'creator', label: '创建者', required: true, default: '音域小编' },
      { prop: 'category', label: '分类', type: 'select', options: [{ label: '流行', value: '流行' }, { label: '民谣', value: '民谣' }, { label: '电子', value: '电子' }, { label: '轻音乐', value: '轻音乐' }, { label: 'ACG', value: 'ACG' }] },
      { prop: 'desc', label: '简介', type: 'textarea', placeholder: '一句话介绍这份歌单' },
      { prop: 'tags', label: '标签（逗号分隔）', default: '放松,治愈' },
      { prop: 'cover', label: '封面路径', type: 'image', default: '/images/playlists/playlist_010.jpg' },
      { prop: 'hot', label: '首页热门位', type: 'switch', default: false },
      { prop: 'recommended', label: '首页推荐位', type: 'switch', default: false },
      statusField,
    ],
  },
  album: {
    key: 'albums',
    title: '专辑管理',
    desc: '专辑信息与关联歌曲管理。',
    searchFields: ['name'],
    searchPlaceholder: '搜索专辑名称',
    selectable: true,
    batchDelete: true,
    rowActions: ['edit', 'delete'],
    columns: [
      { prop: 'cover', label: '专辑', type: 'image', sub: 'releaseDate' },
      { prop: 'artistId', label: '歌手', formatter: (row, store) => store.state.artists.find((a) => a.id === row.artistId)?.name ?? row.artistId },
      { prop: 'songIds', label: '歌曲数', type: 'count', formatter: (row) => String(row.songIds?.length ?? 0) },
      { prop: 'releaseDate', label: '发行日期' },
      onOff,
    ],
    fields: [
      { prop: 'name', label: '专辑名称', required: true },
      { prop: 'artistId', label: '歌手', type: 'select', optionsFrom: 'artists', required: true },
      { prop: 'cover', label: '封面路径', type: 'image', default: '/images/albums/album_010.jpg' },
      { prop: 'releaseDate', label: '发行日期', type: 'date', default: '2024-05-01' },
      statusField,
    ],
  },
  artist: {
    key: 'artists',
    title: '歌手管理',
    desc: '歌手资料维护。新歌手需在编辑中设置「指定播放音频」。',
    searchFields: ['name', 'region'],
    searchPlaceholder: '搜索歌手 / 地区',
    selectable: true,
    batchDelete: true,
    batchStatus: [{ label: '批量上架', value: 'on' }, { label: '批量下架', value: 'off' }],
    rowActions: ['edit', 'delete'],
    columns: [
      { prop: 'avatar', label: '歌手', type: 'image', sub: 'region' },
      { prop: 'gender', label: '性别', type: 'tag', tagMap: { 男: 'primary', 女: 'danger', 组合: 'warning' } },
      { prop: 'fans', label: '粉丝数', type: 'count' },
      { prop: 'designatedAudio', label: '指定播放音频', formatter: (row) => row.designatedAudio?.split('/').pop() ?? '' },
      onOff,
    ],
    fields: [
      { prop: 'name', label: '歌手姓名', required: true },
      { prop: 'gender', label: '性别', type: 'select', options: [{ label: '男', value: '男' }, { label: '女', value: '女' }, { label: '组合', value: '组合' }] },
      { prop: 'region', label: '地区', required: true, placeholder: '如：中国内地', default: '中国内地' },
      { prop: 'avatar', label: '头像路径', type: 'image', default: '/images/artists/artist_002.jpg' },
      { prop: 'intro', label: '简介', type: 'textarea' },
      { prop: 'fans', label: '粉丝数', type: 'number', default: 100000 },
      { prop: 'designatedAudio', label: '指定播放音频路径', default: '/music/music_051_233100_55s.mp3', placeholder: '/music/xxx.mp3' },
      { prop: 'designatedDuration', label: '指定音频时长（秒）', type: 'number', default: 55 },
      statusField,
    ],
  },
  category: {
    key: 'categories',
    title: '分类管理',
    desc: '多级音乐分类，支持增删改。',
    searchFields: ['name'],
    tree: true,
    rowActions: ['edit', 'delete'],
    columns: [
      { prop: 'name', label: '分类名称', type: 'bold' },
      { prop: 'id', label: '分类ID' },
    ],
    fields: [
      { prop: 'name', label: '分类名称', required: true },
      { prop: 'parent', label: '上级分类', type: 'select', options: [{ label: '作为一级分类', value: '' }], default: '' },
    ],
  },
  copyright: {
    key: 'copyrights',
    title: '版权管理',
    desc: '版权合规审查流程：对待审核作品进行通过/驳回操作。',
    searchFields: ['name', 'artist', 'source'],
    searchPlaceholder: '搜索作品 / 歌手 / 来源',
    rowActions: ['audit'],
    columns: [
      { prop: 'name', label: '作品名称', type: 'bold' },
      { prop: 'artist', label: '歌手' },
      { prop: 'source', label: '版权来源' },
      { prop: 'submitTime', label: '提交时间' },
      { prop: 'status', label: '审核状态', type: 'tag', tagMap: { 待审核: 'warning', 已通过: 'success', 已驳回: 'danger' } },
    ],
    fields: [
      { prop: 'name', label: '作品名称', required: true },
      { prop: 'artist', label: '歌手', required: true },
      { prop: 'source', label: '版权来源', default: '独立音乐人' },
    ],
  },
  user: {
    key: 'users',
    title: '用户列表',
    desc: '平台注册用户查询、禁用/启用与密码重置。',
    searchFields: ['name', 'phone'],
    searchPlaceholder: '搜索昵称 / 手机号',
    selectable: true,
    batchStatus: [{ label: '批量启用', value: 'on' }, { label: '批量禁用', value: 'off' }],
    rowActions: ['resetPwd'],
    columns: [
      { prop: 'avatar', label: '用户', type: 'image', sub: 'phone' },
      { prop: 'registerTime', label: '注册时间' },
      { prop: 'lastLogin', label: '最后登录' },
      { prop: 'playCount', label: '播放次数', type: 'count' },
      { prop: 'vip', label: '会员', type: 'tag', tagMap: { true: 'VIP', false: '普通' }, formatter: (row) => String(row.vip) },
      onOff,
    ],
    fields: [],
  },
  vip: {
    key: 'vipRecords',
    title: '会员管理',
    desc: '会员开通记录与有效期管理。',
    searchFields: ['user', 'level'],
    searchPlaceholder: '搜索用户 / 会员等级',
    rowActions: ['edit', 'delete'],
    columns: [
      { prop: 'user', label: '用户', type: 'bold' },
      { prop: 'level', label: '会员等级', type: 'tag', tagMap: { 年度会员: 'danger', 季度会员: 'warning', 连续包月: 'primary', 单月会员: 'info' } },
      { prop: 'startTime', label: '开始时间' },
      { prop: 'endTime', label: '到期时间' },
      { prop: 'amount', label: '金额（元）', type: 'money' },
      { prop: 'status', label: '状态', type: 'tag', tagMap: { 有效: 'success', 已过期: 'info' } },
    ],
    fields: [
      { prop: 'user', label: '用户昵称', required: true },
      { prop: 'level', label: '会员等级', type: 'select', options: [{ label: '连续包月', value: '连续包月' }, { label: '单月会员', value: '单月会员' }, { label: '季度会员', value: '季度会员' }, { label: '年度会员', value: '年度会员' }] },
      { prop: 'startTime', label: '开始时间', type: 'date', default: '2024-05-18' },
      { prop: 'endTime', label: '到期时间', type: 'date', default: '2025-05-18' },
      { prop: 'amount', label: '金额（元）', type: 'number', default: 25 },
      { prop: 'status', label: '状态', type: 'select', options: [{ label: '有效', value: '有效' }, { label: '已过期', value: '已过期' }], default: '有效' },
    ],
  },
  level: {
    key: 'levels',
    title: '用户等级',
    desc: '等级规则与经验值区间配置。',
    searchFields: ['level'],
    rowActions: ['edit', 'delete'],
    columns: [
      { prop: 'icon', label: '图标', width: 80 },
      { prop: 'level', label: '等级名称', type: 'bold' },
      { prop: 'expRange', label: '经验值区间' },
      { prop: 'reward', label: '等级权益' },
    ],
    fields: [
      { prop: 'level', label: '等级名称', required: true },
      { prop: 'icon', label: '图标（Emoji）', default: '🎵' },
      { prop: 'expRange', label: '经验值区间', required: true, placeholder: '如：0 - 99' },
      { prop: 'reward', label: '等级权益', default: '' },
    ],
  },
  feedback: {
    key: 'feedbacks',
    title: '用户反馈',
    desc: '处理用户提交的反馈：回复后标记为已处理。',
    searchFields: ['user', 'content'],
    searchPlaceholder: '搜索用户 / 内容',
    rowActions: ['reply'],
    columns: [
      { prop: 'user', label: '用户', width: 120 },
      { prop: 'type', label: '类型', type: 'tag', tagMap: { 功能异常: 'danger', 产品建议: 'primary', 内容投诉: 'warning', 其他: 'info' } },
      { prop: 'content', label: '反馈内容' },
      { prop: 'time', label: '时间', width: 150 },
      { prop: 'status', label: '状态', type: 'tag', tagMap: { 待处理: 'warning', 已回复: 'success' } },
    ],
    fields: [],
  },
  banner: {
    key: 'banners',
    title: '轮播图管理',
    desc: '前台首页 Banner 配置：图片、跳转链接、排序与上下架。',
    searchFields: ['title'],
    searchPlaceholder: '搜索标题',
    rowActions: ['edit', 'delete'],
    columns: [
      { prop: 'image', label: '预览', type: 'image', sub: 'title' },
      { prop: 'link', label: '跳转链接' },
      { prop: 'sort', label: '排序权重' },
      onOff,
    ],
    fields: [
      { prop: 'title', label: '主标题', required: true },
      { prop: 'subtitle', label: '副标题', default: '探索 · 发现 · 沉浸' },
      { prop: 'image', label: '图片路径', type: 'image', default: '/images/banners/background_010.jpg' },
      { prop: 'link', label: '跳转链接', default: '/playlists', placeholder: '/playlists' },
      { prop: 'sort', label: '排序权重（小靠前）', type: 'number', default: 4 },
      statusField,
    ],
  },
  notice: {
    key: 'notices',
    title: '公告管理',
    desc: '系统公告发布、置顶与下线。',
    searchFields: ['title'],
    searchPlaceholder: '搜索公告标题',
    rowActions: ['edit', 'delete'],
    columns: [
      { prop: 'title', label: '公告标题', type: 'bold' },
      { prop: 'type', label: '类型', type: 'tag', tagMap: { 系统: 'primary', 活动: 'warning', 版权: 'danger' } },
      { prop: 'date', label: '发布日期' },
      { prop: 'top', label: '置顶', type: 'switch', tagMap: { true: '置顶', false: '普通' } },
      onOff,
    ],
    fields: [
      { prop: 'title', label: '公告标题', required: true },
      { prop: 'type', label: '类型', type: 'select', options: [{ label: '系统', value: '系统' }, { label: '活动', value: '活动' }, { label: '版权', value: '版权' }], default: '系统' },
      { prop: 'content', label: '公告内容', type: 'textarea' },
      { prop: 'date', label: '发布日期', type: 'date', default: '2024-05-20' },
      { prop: 'top', label: '置顶', type: 'switch', default: false },
      statusField,
    ],
  },
  activity: {
    key: 'activities',
    title: '活动管理',
    desc: '运营活动配置与参与情况。',
    searchFields: ['name'],
    searchPlaceholder: '搜索活动名称',
    rowActions: ['edit', 'delete'],
    columns: [
      { prop: 'name', label: '活动名称', type: 'bold' },
      { prop: 'startTime', label: '开始日期' },
      { prop: 'endTime', label: '结束日期' },
      { prop: 'reward', label: '奖品/权益' },
      { prop: 'joinCount', label: '参与人数', type: 'count' },
      { prop: 'status', label: '状态', type: 'tag', tagMap: { 进行中: 'success', 未开始: 'info', 已结束: 'warning' } },
    ],
    fields: [
      { prop: 'name', label: '活动名称', required: true },
      { prop: 'startTime', label: '开始日期', type: 'date', default: '2024-06-01' },
      { prop: 'endTime', label: '结束日期', type: 'date', default: '2024-06-30' },
      { prop: 'reward', label: '奖品/权益', default: '' },
      { prop: 'joinCount', label: '初始参与人数', type: 'number', default: 0 },
      { prop: 'status', label: '状态', type: 'select', options: [{ label: '未开始', value: '未开始' }, { label: '进行中', value: '进行中' }, { label: '已结束', value: '已结束' }], default: '未开始' },
    ],
  },
  admin: {
    key: 'admins',
    title: '管理员管理',
    desc: '后台账号与角色分配。',
    searchFields: ['account', 'name'],
    searchPlaceholder: '搜索账号 / 姓名',
    rowActions: ['edit', 'delete', 'resetPwd'],
    columns: [
      { prop: 'account', label: '账号', type: 'bold' },
      { prop: 'name', label: '姓名' },
      { prop: 'role', label: '角色', type: 'tag', tagMap: { 超级管理员: 'danger', 运营专员: 'primary', 内容审核: 'warning' } },
      { prop: 'lastLogin', label: '最后登录' },
      onOff,
    ],
    fields: [
      { prop: 'account', label: '账号', required: true },
      { prop: 'name', label: '姓名', required: true },
      { prop: 'role', label: '角色', type: 'select', optionsFrom: 'roles' },
      statusField,
    ],
  },
  role: {
    key: 'roles',
    title: '角色管理',
    desc: '角色与菜单/按钮权限分配。',
    searchFields: ['name'],
    rowActions: ['permTree', 'edit', 'delete'],
    columns: [
      { prop: 'name', label: '角色名称', type: 'bold' },
      { prop: 'desc', label: '描述' },
      { prop: 'permKeys', label: '权限数', type: 'count', formatter: (row) => String(row.permKeys?.length ?? 0) },
    ],
    fields: [
      { prop: 'name', label: '角色名称', required: true },
      { prop: 'desc', label: '角色描述', type: 'textarea' },
    ],
  },
  permission: {
    key: 'permissions',
    title: '权限管理',
    desc: '权限资源维护，按模块分组。',
    searchFields: ['name', 'code', 'group'],
    searchPlaceholder: '搜索权限 / 编码 / 模块',
    rowActions: ['edit', 'delete'],
    columns: [
      { prop: 'name', label: '权限名称', type: 'bold' },
      { prop: 'code', label: '权限编码' },
      { prop: 'group', label: '所属模块', type: 'tag', tagMap: { 内容管理: 'primary', 用户管理: 'success', 运营中心: 'warning', 系统管理: 'danger' } },
    ],
    fields: [
      { prop: 'name', label: '权限名称', required: true },
      { prop: 'code', label: '权限编码', required: true, placeholder: '如 content:music' },
      { prop: 'group', label: '所属模块', type: 'select', options: [{ label: '内容管理', value: '内容管理' }, { label: '用户管理', value: '用户管理' }, { label: '运营中心', value: '运营中心' }, { label: '系统管理', value: '系统管理' }] },
    ],
  },
  log: {
    key: 'logs',
    title: '操作日志',
    desc: '后台操作审计记录，支持筛选与导出。',
    searchFields: ['operator', 'module', 'action', 'detail'],
    searchPlaceholder: '搜索操作人 / 模块 / 内容',
    readonly: true,
    exportable: true,
    columns: [
      { prop: 'time', label: '时间', width: 170 },
      { prop: 'operator', label: '操作人', width: 110 },
      { prop: 'module', label: '模块', type: 'tag', tagMap: { 内容管理: 'primary', 用户管理: 'success', 运营中心: 'warning', 系统管理: 'danger' } },
      { prop: 'action', label: '操作类型', width: 110 },
      { prop: 'detail', label: '操作内容' },
      { prop: 'ip', label: 'IP', width: 130 },
    ],
    fields: [],
  },
}
