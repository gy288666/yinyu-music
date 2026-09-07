/**
 * 音域 YINYU - 本地演示数据层
 *
 * 重要约定（与真实音乐网站的唯一区别）：
 * 所有歌曲点击播放时，并不播放真实歌手的音源，
 * 而是播放 resource/static/music 中为该歌手「指定」的一首本地音频。
 * 见 Artist.designatedAudio 字段。
 */

export interface Artist {
  id: string
  name: string
  avatar: string
  region: string
  gender: '男' | '女' | '组合'
  intro: string
  /** 指定播放的本地音频（/music/xxx.mp3） */
  designatedAudio: string
  /** 指定音频时长（秒），来自文件名 */
  designatedDuration: number
  /** 粉丝数（管理端展示） */
  fans?: number
  /** 上架状态：on 上架 / off 下架 */
  status?: 'on' | 'off'
}

export interface Song {
  id: string
  name: string
  artistId: string
  /** 展示用歌手名（如 "林达浪/h3R3"） */
  artistName: string
  album: string
  cover: string
  playCount: number
  releaseDate: string
  liked?: boolean
  /** 音乐分类 */
  category?: string
  /** 上架状态：on 上架 / off 下架 */
  status?: 'on' | 'off'
}

export interface Playlist {
  id: string
  name: string
  cover: string
  desc: string
  tags: string[]
  creator: string
  category: string
  songIds: string[]
  playCountText?: string
  collectCount?: number
  /** 首页区块标记 */
  hot?: boolean
  recommended?: boolean
  mine?: boolean
  status?: 'on' | 'off'
}

const pl = (p: Playlist): Playlist => ({ collectCount: 0, status: 'on', ...p })

/** 统一歌单库：前台各区块与后台歌单管理共用 */
export const playlists: Playlist[] = [
  pl({ id: 'H1', name: 'Chill 放松指南', cover: '/images/playlists/playlist_002.jpg', desc: '下班后的松弛片刻，把节奏交给你。', tags: ['放松', '治愈'], creator: '音域小编', category: '轻音乐', hot: true, playCountText: '25.6万', collectCount: 18234, songIds: ['S15', 'S4', 'S5'] }),
  pl({ id: 'H2', name: '欧美流行精选', cover: '/images/playlists/playlist_027.jpg', desc: '每周更新的欧美流行风向标。', tags: ['流行', '欧美'], creator: '音域小编', category: '流行', hot: true, playCountText: '18.3万', collectCount: 12980, songIds: ['S4', 'S8', 'S12'] }),
  pl({ id: 'H3', name: '学习｜专注｜白噪音', cover: '/images/playlists/playlist_018.jpg', desc: '图书馆级别的安静陪伴。', tags: ['学习', '专注'], creator: 'StudyHouse', category: '轻音乐', hot: true, playCountText: '12.8万', collectCount: 20456, songIds: ['S15', 'S16', 'S25'] }),
  pl({ id: 'H4', name: '运动燃脂BGM', cover: '/images/playlists/playlist_047.jpg', desc: '心率上去了就不想停。', tags: ['运动', '节奏'], creator: 'FitBeat', category: '电子', hot: true, playCountText: '11.2万', collectCount: 9871, songIds: ['S14', 'S12', 'S26'] }),
  pl({ id: 'H5', name: '经典永流传', cover: '/images/playlists/playlist_016.jpg', desc: '时间筛过的金曲，越听越有味。', tags: ['经典', '怀旧'], creator: '音域小编', category: '流行', hot: true, playCountText: '9.7万', collectCount: 8734, songIds: ['S3', 'S4', 'S11'] }),
  pl({ id: 'R1', name: '温柔海风', cover: '/images/playlists/playlist_046.jpg', desc: '把海风装进耳机里。', tags: ['放松', '治愈', '钢琴'], creator: '音域小编', category: '轻音乐', recommended: true, collectCount: 15600, songIds: ['S15', 'S4'] }),
  pl({ id: 'R2', name: '深夜耳机', cover: '/images/playlists/playlist_014.jpg', desc: '凌晨两点，和自己对话。', tags: ['孤独', '夜晚'], creator: '音域小编', category: '流行', recommended: true, collectCount: 13400, songIds: ['S5', 'S3'] }),
  pl({ id: 'R3', name: '自由的呼吸', cover: '/images/playlists/playlist_008.jpg', desc: '去旷野，深呼吸。', tags: ['清新', '自由'], creator: '音域小编', category: '民谣', recommended: true, collectCount: 11200, songIds: ['S6', 'S2'] }),
  pl({ id: 'R4', name: '极简钢琴', cover: '/images/playlists/playlist_013.jpg', desc: '极简主义钢琴小品集。', tags: ['钢琴', '安静'], creator: 'PianoDiary', category: '轻音乐', recommended: true, collectCount: 10800, songIds: ['S15', 'S16'] }),
  pl({ id: 'R5', name: '城市漫游', cover: '/images/playlists/playlist_031.jpg', desc: '霓虹下的电子漫步。', tags: ['电子', '夜城'], creator: '音域小编', category: '电子', recommended: true, collectCount: 9600, songIds: ['S14', 'S17'] }),
  pl({ id: 'R6', name: '日系治愈', cover: '/images/playlists/playlist_004.jpg', desc: '来自夏天的动画插曲。', tags: ['ACG', '轻柔'], creator: '音域小编', category: 'ACG', recommended: true, collectCount: 8900, songIds: ['S10', 'S9'] }),
  pl({ id: 'M1', name: '夜色温柔', cover: '/images/playlists/playlist_039.jpg', desc: '我收藏的深夜歌单。', tags: ['夜色'], creator: '林晚风', category: '流行', mine: true, collectCount: 12, songIds: ['S5', 'S4'] }),
  pl({ id: 'M2', name: '专注学习', cover: '/images/playlists/playlist_023.jpg', desc: '自习室标配。', tags: ['学习'], creator: '林晚风', category: '轻音乐', mine: true, collectCount: 8, songIds: ['S15', 'S16'] }),
  pl({ id: 'M3', name: '健身动力', cover: '/images/playlists/playlist_036.jpg', desc: '撸铁不累。', tags: ['运动'], creator: '林晚风', category: '电子', mine: true, collectCount: 6, songIds: ['S14', 'S2'] }),
  pl({ id: 'M4', name: '旅行时光', cover: '/images/playlists/playlist_005.jpg', desc: '在路上。', tags: ['旅行'], creator: '林晚风', category: '民谣', mine: true, collectCount: 9, songIds: ['S6', 'S9'] }),
  pl({ id: 'M5', name: '日落与海', cover: '/images/playlists/playlist_028.jpg', desc: '海边日落放映室。', tags: ['日落', '海'], creator: '林晚风', category: '流行', mine: true, collectCount: 15, songIds: ['S1', 'S10'] }),
]

export function getHotPlaylists(): Playlist[] {
  return playlists.filter((p) => p.hot && p.status === 'on')
}
export function getRecommendPlaylists(): Playlist[] {
  return playlists.filter((p) => p.recommended && p.status === 'on')
}
export function getMyPlaylists(): Playlist[] {
  return playlists.filter((p) => p.mine)
}

const A = (a: Artist) => a

/** 歌手表：avatar 指向 /images/artists/ 下的人像图 */
export const artists: Artist[] = [
  A({
    id: 'wyuz',
    name: '王宇宙Leto',
    avatar: '/images/artists/wyuz.jpg',
    region: '中国台湾',
    gender: '男',
    intro: '唱作人，以温柔叙事的民谣流行风格被听众熟知。',
    designatedAudio: '/music/music_036_225800_45s.mp3',
    designatedDuration: 45,
  }),
  A({
    id: 'jnsnf',
    name: '就是南方凯',
    avatar: '/images/artists/jnsnf.jpg',
    region: '中国内地',
    gender: '男',
    intro: '网络热度飙升的青年歌手，代表作《离别开出花》。',
    designatedAudio: '/music/music_037_230700_55s.mp3',
    designatedDuration: 55,
  }),
  A({
    id: 'xzj',
    name: '薛之谦',
    avatar: '/images/artists/xzj.jpg',
    region: '中国上海',
    gender: '男',
    intro: '唱作人、制作人，以情歌见长。',
    designatedAudio: '/music/music_038_230800_75s.mp3',
    designatedDuration: 75,
  }),
  A({
    id: 'tjy',
    name: '蔡健雅',
    avatar: '/images/artists/tjy.jpg',
    region: '新加坡',
    gender: '女',
    intro: '创作歌手，多次获得金曲奖最佳国语女歌手。',
    designatedAudio: '/music/music_039_231000_65s.mp3',
    designatedDuration: 65,
  }),
  A({
    id: 'cmd',
    name: '陈梦朵',
    avatar: '/images/artists/cmd.jpg',
    region: '中国内地',
    gender: '女',
    intro: '新生代唱作人，擅长都市情感题材。',
    designatedAudio: '/music/music_040_231200_50s.mp3',
    designatedDuration: 50,
  }),
  A({
    id: 'cl',
    name: '陈粒',
    avatar: '/images/artists/cl.jpg',
    region: '中国内地',
    gender: '女',
    intro: '独立音乐人，词曲风格自由灵动。',
    designatedAudio: '/music/music_041_231400_45s.mp3',
    designatedDuration: 45,
  }),
  A({
    id: 'mby',
    name: '毛不易',
    avatar: '/images/artists/mby.jpg',
    region: '中国内地',
    gender: '男',
    intro: '以平实叙事与生活质感著称的创作歌手。',
    designatedAudio: '/music/music_042_231500_55s.mp3',
    designatedDuration: 55,
  }),
  A({
    id: 'ljj',
    name: '林俊杰',
    avatar: '/images/artists/ljj.jpg',
    region: '新加坡',
    gender: '男',
    intro: '华语流行唱作人，制作与演唱俱佳。',
    designatedAudio: '/music/music_043_231700_40s.mp3',
    designatedDuration: 40,
  }),
  A({
    id: 'xs',
    name: '许嵩',
    avatar: '/images/artists/xs.jpg',
    region: '中国内地',
    gender: '男',
    intro: '独立音乐人，包揽词曲创作的全能唱作人。',
    designatedAudio: '/music/music_044_231900_35s.mp3',
    designatedDuration: 35,
  }),
  A({
    id: 'gwr',
    name: '告五人',
    avatar: '/images/artists/gwr.jpg',
    region: '中国台湾',
    gender: '组合',
    intro: '台湾独立乐团，以浪漫写意的城市流行乐闻名。',
    designatedAudio: '/music/music_045_232100_60s.mp3',
    designatedDuration: 60,
  }),
  A({
    id: 'zjl',
    name: '周杰伦',
    avatar: '/images/artists/zjl.jpg',
    region: '中国台湾',
    gender: '男',
    intro: '华语流行天王，开创中国风与 R&B 融合曲风。',
    designatedAudio: '/music/music_046_232200_70s.mp3',
    designatedDuration: 70,
  }),
  A({
    id: 'ldl',
    name: '林达浪/h3R3',
    avatar: '/images/artists/ldl.jpg',
    region: '中国内地',
    gender: '组合',
    intro: '说唱与旋律创作组合。',
    designatedAudio: '/music/music_047_232400_35s.mp3',
    designatedDuration: 35,
  }),
  A({
    id: 'lyr',
    name: '李怡然同学',
    avatar: '/images/artists/lyr.jpg',
    region: '中国内地',
    gender: '女',
    intro: '校园民谣风格的独立唱作人。',
    designatedAudio: '/music/music_048_232600_50s.mp3',
    designatedDuration: 50,
  }),
  A({
    id: 'jgwkzq',
    name: '接个吻，开一枪',
    avatar: '/images/artists/jgwkzq.jpg',
    region: '中国内地',
    gender: '组合',
    intro: '电子流行组合，代表作《失眠飞行》。',
    designatedAudio: '/music/music_049_232700_75s.mp3',
    designatedDuration: 75,
  }),
  A({
    id: 'fspiano',
    name: '放松 · 治愈 · 钢琴',
    avatar: '/images/artists/fspiano.jpg',
    region: '环球',
    gender: '组合',
    intro: '疗愈系钢琴演奏企划。',
    designatedAudio: '/music/music_050_232800_60s.mp3',
    designatedDuration: 60,
  }),
]

export const artistMap = new Map(artists.map((a) => [a.id, a]))

// 粉丝数（万）：管理端与歌手页展示
const FANS_WAN = [86, 72, 312, 98, 32, 54, 189, 265, 142, 76, 430, 62, 45, 53, 8.8]
artists.forEach((a, i) => {
  a.fans = Math.round(FANS_WAN[i % FANS_WAN.length] * 10000)
})

export function artistOf(song: Song): Artist | undefined {
  return artistMap.get(song.artistId)
}

/** 核心规则：任何歌曲实际播放的都是其歌手「指定」的本地音频 */
export function designatedAudioOf(song: Song): { url: string; duration: number } {
  const a = artistMap.get(song.artistId)
  if (!a) return { url: '/music/music_036_225800_45s.mp3', duration: 45 }
  return { url: a.designatedAudio, duration: a.designatedDuration }
}

const song = (s: Omit<Song, 'artistName'> & { artistName?: string }): Song => ({
  ...s,
  artistName: s.artistName ?? artistMap.get(s.artistId)?.name ?? '未知歌手',
})

export const songs: Song[] = [
  song({ id: 'S1', name: '若月亮没来（若是月亮还没来）', artistId: 'wyuz', album: '若月亮没来', cover: '/images/albums/album_011.jpg', playCount: 2345678, releaseDate: '2024-03-15', liked: true }),
  song({ id: 'S2', name: '离别开出花', artistId: 'jnsnf', album: '离别开出花', cover: '/images/albums/album_012.jpg', playCount: 1982000, releaseDate: '2023-06-01' }),
  song({ id: 'S3', name: '像风一样', artistId: 'xzj', album: '渡 The Crossing', cover: '/images/albums/album_013.jpg', playCount: 1759000, releaseDate: '2018-12-27' }),
  song({ id: 'S4', name: 'Letting Go', artistId: 'tjy', album: 'Goodbye & Hello', cover: '/images/albums/album_014.jpg', playCount: 1543000, releaseDate: '2007-10-19' }),
  song({ id: 'S5', name: '等当我', artistId: 'cmd', album: '等当我', cover: '/images/albums/album_015.jpg', playCount: 1327000, releaseDate: '2024-04-02' }),
  song({ id: 'S6', name: '夏日漩涡', artistId: 'cl', album: '夏日漩涡', cover: '/images/playlists/playlist_001.jpg', playCount: 968000, releaseDate: '2024-05-20' }),
  song({ id: 'S7', name: '荒野寻光', artistId: 'mby', album: '荒野寻光', cover: '/images/artists/mby.jpg', playCount: 884000, releaseDate: '2024-05-19' }),
  song({ id: 'S8', name: 'Falling Again', artistId: 'ljj', album: 'Falling Again', cover: '/images/artists/ljj.jpg', playCount: 851000, releaseDate: '2024-05-18' }),
  song({ id: 'S9', name: '梦的续章', artistId: 'xs', album: '梦的续章', cover: '/images/artists/xs.jpg', playCount: 816000, releaseDate: '2024-05-17' }),
  song({ id: 'S10', name: '银河与玫瑰', artistId: 'gwr', album: '银河与玫瑰', cover: '/images/artists/gwr.jpg', playCount: 792000, releaseDate: '2024-05-16' }),
  song({ id: 'S11', name: '温室气球', artistId: 'zjl', album: '温室气球', cover: '/images/artists/zjl.jpg', playCount: 778000, releaseDate: '2024-05-15' }),
  song({ id: 'S12', name: '还是会想你', artistId: 'ldl', album: '还是会想你', cover: '/images/albums/album_021.jpg', playCount: 2123000, releaseDate: '2024-01-12' }),
  song({ id: 'S13', name: '可能', artistId: 'lyr', album: '可能', cover: '/images/albums/album_022.jpg', playCount: 1988000, releaseDate: '2022-08-04' }),
  song({ id: 'S14', name: '失眠飞行', artistId: 'jgwkzq', album: '失眠飞行', cover: '/images/albums/album_023.jpg', playCount: 1877000, releaseDate: '2019-11-14' }),
  song({ id: 'S15', name: '温柔海风', artistId: 'fspiano', artistName: '放松 · 治愈 · 钢琴', album: '温柔海风', cover: '/images/playlists/playlist_046.jpg', playCount: 1654000, releaseDate: '2024-02-10' }),
  song({ id: 'S16', name: '星空', artistId: 'lyr', album: '星空', cover: '/images/albums/album_024.jpg', playCount: 645000, releaseDate: '2024-03-08' }),
  song({ id: 'S17', name: '深海信笺', artistId: 'jgwkzq', album: '深海信笺', cover: '/images/albums/album_025.jpg', playCount: 583000, releaseDate: '2024-04-22' }),
  song({ id: 'S18', name: '星河入梦', artistId: 'gwr', album: '星河入梦', cover: '/images/albums/album_026.jpg', playCount: 561000, releaseDate: '2024-05-10' }),
  song({ id: 'S19', name: '晚风信箱', artistId: 'cmd', album: '晚风信箱', cover: '/images/albums/album_027.jpg', playCount: 534000, releaseDate: '2024-05-08' }),
  song({ id: 'S20', name: '时光邮差', artistId: 'xs', album: '时光邮差', cover: '/images/albums/album_028.jpg', playCount: 512000, releaseDate: '2024-05-06' }),
  song({ id: 'S21', name: '夜航西飞', artistId: 'mby', album: '夜航西飞', cover: '/images/albums/album_029.jpg', playCount: 498000, releaseDate: '2024-05-04' }),
  song({ id: 'S22', name: '蓝色气泡', artistId: 'ljj', album: '蓝色气泡', cover: '/images/albums/album_042.jpg', playCount: 476000, releaseDate: '2024-05-02' }),
  song({ id: 'S23', name: '纸飞机航线', artistId: 'xzj', album: '纸飞机航线', cover: '/images/albums/album_043.jpg', playCount: 455000, releaseDate: '2024-04-30' }),
  song({ id: 'S24', name: '潮汐预告', artistId: 'tjy', album: '潮汐预告', cover: '/images/albums/album_044.jpg', playCount: 432000, releaseDate: '2024-04-28' }),
  song({ id: 'S25', name: '山谷回音', artistId: 'cl', album: '山谷回音', cover: '/images/albums/album_045.jpg', playCount: 418000, releaseDate: '2024-04-26' }),
  song({ id: 'S26', name: '环岛旅行', artistId: 'jnsnf', album: '环岛旅行', cover: '/images/albums/album_046.jpg', playCount: 396000, releaseDate: '2024-04-24' }),
  song({ id: 'S27', name: '月台日记', artistId: 'wyuz', album: '月台日记', cover: '/images/albums/album_047.jpg', playCount: 375000, releaseDate: '2024-04-22' }),
]

export const songMap = new Map(songs.map((s) => [s.id, s]))

// 默认上架状态（后台可下架）
songs.forEach((s) => { s.status = s.status ?? 'on' })
artists.forEach((a) => { a.status = a.status ?? 'on' })

/** 动态查询（后台新增的歌曲也能查到） */
export function songById(id: string): Song | undefined {
  return songs.find((s) => s.id === id)
}

export const charts: { key: string; name: string; songIds: string[] }[] = [
  { key: 'hot', name: '热歌榜', songIds: ['S1', 'S2', 'S3', 'S4', 'S5', 'S12', 'S13', 'S14', 'S15', 'S18'] },
  { key: 'new', name: '新歌榜', songIds: ['S11', 'S10', 'S9', 'S8', 'S7', 'S6', 'S19', 'S20', 'S21', 'S22'] },
  { key: 'original', name: '原创榜', songIds: ['S6', 'S5', 'S16', 'S10', 'S17', 'S25', 'S19', 'S23', 'S24', 'S27'] },
  { key: 'rising', name: '飙升榜', songIds: ['S2', 'S12', 'S11', 'S6', 'S1', 'S18', 'S21', 'S24', 'S26', 'S22'] },
]

export interface Banner {
  id: string
  image: string
  title: string
  subtitle: string
  /** 跳转链接（管理端轮播图可配置） */
  link?: string
  /** 排序权重，越小越靠前 */
  sort?: number
  status?: 'on' | 'off'
}

export const banners: Banner[] = [
  { id: 'B1', image: '/images/banners/banner_vinyl.jpg', title: '音域 · 聆听世界的广度', subtitle: '探索 · 发现 · 沉浸', link: '/playlists', sort: 1, status: 'on' },
  { id: 'B2', image: '/images/banners/background_018.jpg', title: '音乐，是灵魂的回声', subtitle: '每一次播放，都是一次遇见', link: '/recommend', sort: 2, status: 'on' },
  { id: 'B3', image: '/images/banners/background_031.jpg', title: 'Hi-Res 无损音质专区', subtitle: '听见细节里的辽阔', link: '/vip', sort: 3, status: 'on' },
]

export const quickEntries = [
  { key: 'daily', name: '每日推荐', desc: '专属你的音乐' },
  { key: 'square', name: '歌单广场', desc: '发现好音乐' },
  { key: 'rank', name: '排行榜', desc: '流行趋势' },
  { key: 'radio', name: '电台', desc: '听见更多可能' },
  { key: 'hires', name: 'Hi-Res专区', desc: '高品质音乐' },
]

export const currentUserId = 'u001'

export const userInfo = {
  id: currentUserId,
  name: '林晚风',
  avatar: '/images/avatars/avatar_user.jpg',
  vip: true,
}

export function formatPlayCount(n: number): string {
  if (n >= 100000000) return (n / 100000000).toFixed(1) + '亿'
  if (n >= 10000) return (n / 10000).toFixed(1) + '万'
  return String(n)
}

export function formatTime(sec: number): string {
  if (!isFinite(sec) || sec < 0) sec = 0
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}
