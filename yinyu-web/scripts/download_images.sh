#!/bin/bash
# 从浏览器搜索到的候选 URL 下载歌手人像/头像/Banner 图片
# 用法: bash download_images.sh，逐个候选尝试，ffprobe 验证尺寸，成功即止
set -u
DEST_ART="E:/yinyu-music/resource/static/images/artists"
DEST_AV="E:/yinyu-music/resource/static/images/avatars"
DEST_BA="E:/yinyu-music/resource/static/images/banners"
TMP="/tmp/imgdl"
UA="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36"
mkdir -p "$TMP"

validate() { # $1=file -> echo WxH or empty
  ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0 "$1" 2>/dev/null | awk -F, '$1>=250 && $2>=250 {print $1"x"$2}'
}

download_one() { # $1=name $2=destdir $3...=urls
  local name="$1" destdir="$2"; shift 2
  [ -f "$destdir/$name.jpg" ] && { echo "SKIP $name (exists)"; return 0; }
  for url in "$@"; do
    local raw="$TMP/${name}_raw"
    curl -sL --max-time 25 -A "$UA" -e "https://www.bing.com/" -o "$raw" "$url" 2>/dev/null
    local sz; sz=$(stat -c%s "$raw" 2>/dev/null || echo 0)
    [ "$sz" -lt 15000 ] && continue
    local dims; dims=$(validate "$raw")
    [ -z "$dims" ] && continue
    ffmpeg -y -v error -i "$raw" -vf "scale='min(1200,iw)':-2" "$destdir/$name.jpg" 2>/dev/null
    if [ -f "$destdir/$name.jpg" ]; then
      echo "OK   $name  $dims  <- $url"
      rm -f "$raw"
      return 0
    fi
  done
  echo "FAIL $name"
  return 1
}

FAILED=0
# ---- 歌手人像 ----
download_one "xzj"    "$DEST_ART" \
  "https://bkimg.cdn.bcebos.com/pic/11385343fbf2b211918ae580c78065380dd78e53?x-bce-process=image/format,f_auto/resize,m_lfit,limit_1,h_1000" \
  "https://pic3.zhimg.com/v2-b2cf3f683ffb513ed7ca079494e7cf88_r.jpg?source=1940ef5c" \
  "https://c-ssl.dtstatic.com/uploads/item/201808/22/20180822213651_cgoor.thumb.1000_0.jpg" \
  "https://k.sinaimg.cn/n/sinacn10113/217/w630h387/20200116/ee21-inhcyca2462535.jpg/w700d1q75cms.jpg" || FAILED=1

download_one "ljj"    "$DEST_ART" \
  "https://x0.ifengimg.com/ucms/2024_16/9008AC9F7A73A5C501F81F4558CED596D7FEDF71_size104_w690_h1035.jpg" \
  "https://p4.itc.cn/q_70/images01/20220410/01aaeac3477e45a083293425960c45ef.jpeg" \
  "https://bkimg.cdn.bcebos.com/pic/a686c9177f3e6709c93dbda4ec9f883df8dcd100ff6d?x-bce-process=image/format,f_auto/resize,m_lfit,limit_1,h_1000" \
  "https://d.musicapp.migu.cn/prod/playlist-service/playListimg/7f7a024a-9a6b-4863-8ea5-836a13744032.jpg" || FAILED=1

download_one "zjl"    "$DEST_ART" \
  "https://pic2.zhimg.com/v2-39363153a4f21513438ae528175b8119_r.jpg" \
  "https://p1.itc.cn/q_70/images01/20220211/d0280472369c410c9a3e5b235baa52f5.jpeg" \
  "https://so1.360tres.com/t017d6555a87fb13623.jpg" \
  "https://pica.zhimg.com/v2-d7fecc92a29a229ed0e83871aca51244_1440w.jpg" || FAILED=1

download_one "mby"    "$DEST_ART" \
  "https://imgs.tom.com/ent/202112/1658004779/CONTENT95129d9eb9097ede.jpeg" \
  "https://bkimg.cdn.bcebos.com/pic/d1a20cf431adcbef7609892b34e039dda3cc7cd931c4?x-bce-process=image/format,f_auto/resize,m_lfit,limit_1,h_1000" \
  "https://pic1.zhimg.com/v2-349808a6b86d4c7d39355dff08d854e4_r.jpg" \
  "https://www.renwuji.com/wp-content/uploads/images/2023/06/28/31a1c7cef8a3448493c4e99cae761569~noop_av5gbksma1l.jpg" || FAILED=1

download_one "xs"     "$DEST_ART" \
  "https://bkimg.cdn.bcebos.com/pic/64380cd7912397dda144af1409dba5b7d0a20cf429d0?x-bce-process=image/format,f_auto/resize,m_lfit,limit_1,h_1000" \
  "https://img.alicdn.com/imgextra/i3/2251059038/O1CN018hT1t62GdSgRJW8Cx_!!2251059038.jpg_q60.jpg" \
  "https://pic1.zhimg.com/v2-97d7c37223e46b36e4543f2d03b23ab2_720w.jpg?source=172ae18b" \
  "https://so1.360tres.com/t01940c52bc584ed9bd.jpg" || FAILED=1

download_one "tjy"    "$DEST_ART" \
  "https://y.gtimg.cn/music/photo_new/T062M0000012Z2rt3QGylQ.jpg?max_age=0" \
  "https://www.skyibis.com/d/file/202305/3405041235340zfw4ppuwpa4469.jpg" \
  "https://i2.kknews.cc/ffKpHIli63wtX7_wibdt2uy2oFYSH00B-A/0.jpg" \
  "https://n.sinaimg.cn/sinakd/sni/214/w2048h1366/20260128/ccf7-36476c86ea1fc61cccce0ddd787c9051.jpg" || FAILED=1

download_one "gwr"    "$DEST_ART" \
  "https://p7.itc.cn/q_70/images01/20220610/d485b23f3f4f43ef9886b021b6918063.jpeg" \
  "https://n.sinaimg.cn/sinakd20122/280/w960h920/20230122/d8f6-8df0e230e6f918626d6ca75dbb2a22cb.jpg" \
  "https://p4.itc.cn/q_70/images01/20220620/45a39191b42241f889b556ddd6eb535c.jpeg" \
  "https://so1.360tres.com/t019e36058f53ebec19.jpg" || FAILED=1

download_one "wyuz"   "$DEST_ART" \
  "http://img1.kuwo.cn/star/starheads/500/s4s65/69/2692146353.jpg" \
  "https://pic1.zhimg.com/v2-e2320ea205f61dba9e60bd70fbb7e7fe_1440w.jpg" \
  "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/fb/74/5c/fb745cf9-20ad-ac53-1a69-aaaba9590469/4894965413465.jpg/1200x1200bf-60.jpg" \
  "https://i.scdn.co/image/ab67616d0000b273f615a71dd24de14b47db3506" || FAILED=1

download_one "jnsnf"  "$DEST_ART" \
  "http://imge.kugou.com/stdmusic/20220513/20220513153247417668.jpg" \
  "http://p2.music.126.net/9veMva_oTiC6AXQkAxRm9g==/109951169613938966.jpg" \
  "http://www.zgmxjjgs.com/d/file/2024-05-05/04c15fb5a7f9efa26dea14f9eeabe9da.jpg" || FAILED=1

download_one "cl"     "$DEST_ART" \
  "http://n.sinaimg.cn/translate/w675h1024/20171217/fQlP-fypsqka6195937.jpg" \
  "http://n.sinaimg.cn/sinacn10011/213/w2048h1365/20191225/e934-imfiehp9114379.jpg" \
  "https://n.sinaimg.cn/translate/w1024h683/20171217/S-a5-fypsqka6196107.jpg" \
  "https://n.sinaimg.cn/translate/w683h1024/20171217/xZq6-fypsqka6195953.jpg" || FAILED=1

download_one "ldl"    "$DEST_ART" \
  "https://p1.music.126.net/jxsk3f8efgDO7C1v1LgmMg==/109951172234606829.jpg" \
  "https://x0.ifengimg.com/ucms/2024_21/D52E7B6B53FD4C70B6072FE4EB04EFD6485D21A7_size164_w650_h432.jpg" \
  "http://i0.hdslb.com/bfs/archive/6c738b42e72563342a931a7e6a94661d452c3f3e.jpg" \
  "https://p1.music.126.net/CoIYfaPOxYNu8SZj_hnJtg==/109951173472405827.jpg" || FAILED=1

download_one "jgwkzq" "$DEST_ART" \
  "http://p1.music.126.net/HrvHce1m4oVgHiWT0z-cvA==/109951165600655726.jpg" \
  "https://img.alicdn.com/imgextra/i4/160199132/O1CN01G8ytxp2HKVhFWEdVv_!!160199132.jpg" \
  "http://i0.hdslb.com/bfs/archive/0452045fde0c6d332dce09f7a7a81cb7e012ef9e.jpg" \
  "https://bkimg.cdn.bcebos.com/pic/caef76094b36acafa812464a77d98d1000e99c92?x-bce-process=image/resize,m_lfit,w_536,limit_1/quality,Q_70" || FAILED=1

download_one "cmd"    "$DEST_ART" \
  "https://hellorfimg.zcool.cn/provider_image/large/2235185000.jpg" \
  "https://gd-hbimg.huaban.com/ea5f5bcf091080d829194c84b91eb31d45a5cf8db0568-ii7vTO_fw658" \
  "https://img.shetu66.com/2024/06/03/171740182052572323.png" \
  "https://bpic.588ku.com/back_origin_min_pic/23/04/24/979a152d5a8c5a94e0d95a3598c488af.jpg!/fw/750/quality/99/unsharp/true/compress/true" || FAILED=1

download_one "lyr"    "$DEST_ART" \
  "https://img.shetu66.com/2024/06/03/171740214429672474.png" \
  "https://gd-hbimg.huaban.com/26de009164a5346e85963b01a890aa147719f5e6c1cd3-xEEv9F_fw658" \
  "https://hellorfimg.zcool.cn/provider_image/large/2235185000.jpg" || FAILED=1

download_one "fspiano" "$DEST_ART" \
  "https://pic.vjshi.com/2022-10-08/9e21d03b7e0d45a7a9ce6fd61f215016/online/main.jpg?x-oss-process=style/w342_h192_center" \
  "https://pic.vjshi.com/2023-05-21/0f4af0c109f34193a8d635136be3b73e/online/puzzle.jpg?x-oss-process=style/w1440_h2880" \
  "https://img95.699pic.com/photo/60013/6079.jpg_wh300.jpg!/fh/300/quality/90" || FAILED=1

# ---- 头像 ----
download_one "avatar_001" "$DEST_AV" \
  "https://gd-hbimg.huaban.com/8af741a7db9774aa0dd2edf8b37f5237d5e65974c5441-PCdpPq_fw658" \
  "https://pic.ntimg.cn/file/20241218/35479210_102701527138_2.jpg" || FAILED=1

download_one "avatar_002" "$DEST_AV" \
  "https://pic.ntimg.cn/file/20241012/35479210_154048443138_2.jpg" \
  "https://gd-hbimg.huaban.com/26de009164a5346e85963b01a890aa147719f5e6c1cd3-xEEv9F_fw658" || FAILED=1

download_one "avatar_003" "$DEST_AV" \
  "https://gd-hbimg.huaban.com/e851368ecee62b9ec5d4bb6ede49c5bc99f4ebf1a6479-S0HxrM_fw658webp" \
  "https://pic.ntimg.cn/file/20241218/35479210_102701527138_2.jpg" || FAILED=1

download_one "avatar_004" "$DEST_AV" \
  "https://pic3.zhimg.com/v2-c9e4dc3b8605ae12de47587526fd9844_1440w.jpg" \
  "https://pic.nximg.cn/file/20250715/35720289_135427567108_2.jpg" \
  "https://pic4.zhimg.com/v2-60027d8026ed463645fa4a7a635387e1_r.jpg" || FAILED=1

download_one "avatar_005" "$DEST_AV" \
  "https://gd-hbimg.huaban.com/3c4466bd9b09ee79d05df82642b97060c90ebb46bbbb1-yG7vk8_fw658" \
  "https://bpic.588ku.com/back_origin_min_pic/23/04/24/979a152d5a8c5a94e0d95a3598c488af.jpg!/fw/750/quality/99/unsharp/true/compress/true" || FAILED=1

download_one "avatar_admin" "$DEST_AV" \
  "https://img.redocn.com/sheji/20250603/weixiaodeyazhounianqingnanzixiaoxiang_13577718.jpg" \
  "https://gd-hbimg.huaban.com/26de009164a5346e85963b01a890aa147719f5e6c1cd3-xEEv9F_fw658" || FAILED=1

download_one "avatar_user" "$DEST_AV" \
  "https://c-ssl.duitang.com/uploads/blog/202106/13/20210613215901_af28a.jpg" \
  "https://c-ssl.duitang.com/uploads/blog/202301/21/20230121205015_4609f.jpg" \
  "https://c-ssl.duitang.com/uploads/blog/202107/10/20210710183156_1a8d3.jpg" || FAILED=1

# ---- Banner ----
download_one "banner_vinyl" "$DEST_BA" \
  "https://img95.699pic.com/photo/60051/4766.jpg_wh860.jpg" \
  "https://img95.699pic.com/photo/60060/9652.jpg_wh860.jpg" \
  "https://img95.699pic.com/photo/60086/7142.jpg_wh860.jpg" \
  "https://pic.ibaotu.com/25/04/09/zdw/zdw_62812.jpg!ww7002" || FAILED=1

echo "---- DONE failed=$FAILED ----"
