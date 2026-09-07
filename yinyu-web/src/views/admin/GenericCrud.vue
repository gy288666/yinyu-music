<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { CirclePlus, Download as DownloadIcon, RotateCcw, Search } from 'lucide-vue-next'
import { useAdminStore } from '../../data/adminStore'
import { crudModules, type CrudField } from './modules'
import { ALBUM_FALLBACK, imgFallback } from '../../utils/img'

const props = defineProps<{ module: string }>()
const store = useAdminStore()
const mod = computed(() => crudModules[props.module])

/** 操作列宽度 */
const actionWidth = computed(() => {
  const acts = mod.value?.rowActions?.length ?? 0
  return mod.value?.rowActions?.includes('audit') ? 170 : 60 + acts * 82
})

const list = computed<any[]>(() => (store.state as any)[mod.value.key] ?? [])

// ---------- 搜索 + 分页 ----------
const keyword = ref('')
const page = ref(1)
const pageSize = 10
const filtered = computed(() => {
  const kw = keyword.value.trim().toLowerCase()
  if (!kw) return list.value
  return list.value.filter((r) => mod.value.searchFields.some((f) => String(r[f] ?? '').toLowerCase().includes(kw)))
})
watch([keyword, () => props.module], () => { page.value = 1 })
const paged = computed(() => (mod.value.tree ? filtered.value : filtered.value.slice((page.value - 1) * pageSize, page.value * pageSize)))
const total = computed(() => filtered.value.length)

// ---------- 选项解析 ----------
function fieldOptions(f: CrudField): { label: string; value: any }[] {
  if (f.options) return f.options
  switch (f.optionsFrom) {
    case 'artists': return store.state.artists.map((a) => ({ label: a.name, value: a.id }))
    case 'roles': return store.state.roles.map((r) => ({ label: r.name, value: r.name }))
    case 'categories': {
      const opts: { label: string; value: string }[] = []
      store.state.categories.forEach((c) => {
        opts.push({ label: c.name, value: c.id })
        c.children?.forEach((ch) => opts.push({ label: `${c.name} / ${ch.name}`, value: ch.id }))
      })
      return opts
    }
    default: return []
  }
}

// ---------- 表单弹窗 ----------
const dialogVisible = ref(false)
const editingId = ref<string | null>(null)
const form = reactive<Record<string, any>>({})
const formTitle = computed(() => `${editingId.value ? '编辑' : '新增'}${mod.value.title.replace('管理', '')}`)

function buildForm(row?: Record<string, any>) {
  Object.keys(form).forEach((k) => delete form[k])
  for (const f of mod.value.fields) {
    if (f.type === 'switch') form[f.prop] = row ? Boolean(row[f.prop]) : Boolean(f.default ?? false)
    else if (f.type === 'number') form[f.prop] = row?.[f.prop] ?? (f.default ?? 0)
    else form[f.prop] = row?.[f.prop] ?? (f.default ?? '')
  }
}
function openAdd() {
  editingId.value = null
  buildForm()
  dialogVisible.value = true
}
function openEdit(row: Record<string, any>) {
  editingId.value = row.id
  buildForm(row)
  dialogVisible.value = true
}
function submitForm() {
  for (const f of mod.value.fields) {
    if (f.required && !String(form[f.prop] ?? '').trim()) {
      ElMessage.warning(`请填写「${f.label}」`)
      return
    }
  }
  const payload: Record<string, any> = { ...form }
  // 特殊字段归一化
  if (typeof payload.tags === 'string') payload.tags = payload.tags.split(/[,，]/).map((s: string) => s.trim()).filter(Boolean)
  if (props.module === 'music') {
    payload.artistName = store.state.artists.find((a) => a.id === payload.artistId)?.name ?? '未知歌手'
    payload.status = payload.status ?? 'on'
  }
  if (props.module === 'playlist' && !payload.songIds) payload.songIds = []
  if (typeof payload.hot === 'boolean') payload.hot = payload.hot || undefined
  if (editingId.value) {
    store.update(mod.value.key as any, editingId.value, payload)
    store.log('管理员', mod.value.title, '编辑', `《${form.name ?? editingId.value}》`)
    ElMessage.success('保存成功')
  } else {
    const rec = { ...payload }
    if (props.module === 'playlist') Object.assign(rec, { songIds: payload.songIds ?? [], playCountText: '', collectCount: 0 })
    if (props.module === 'music') Object.assign(rec, { id: store.nextId('S') })
    store.add(mod.value.key as any, rec)
    store.log('管理员', mod.value.title, '新增', `《${form.name ?? '新记录'}》`)
    ElMessage.success('新增成功')
  }
  dialogVisible.value = false
}

// ---------- 行操作 ----------
function onDelete(row: Record<string, any>) {
  ElMessageBox.confirm(`确定删除「${row.name ?? row.title ?? row.user ?? row.level ?? row.account ?? row.id}」吗？`, '删除确认', { type: 'warning' })
    .then(() => {
      store.remove(mod.value.key as any, row.id)
      store.log('管理员', mod.value.title, '删除', `《${row.name ?? row.title ?? row.id}》`)
      ElMessage.success('已删除')
    })
    .catch(() => {})
}
function onSwitch(row: Record<string, any>, colProp: string) {
  const val = row[colProp]
  const label = mod.value.columns.find((c) => c.prop === colProp)?.label ?? colProp
  store.log('管理员', mod.value.title, `切换${label}`, `《${row.name ?? row.title ?? row.id}》 → ${colProp === 'status' ? (val === 'on' ? '上架' : '下架') : val ? '开启' : '关闭'}`)
  ElMessage.success(`${label}已${colProp === 'status' ? (val === 'on' ? '上架' : '下架') : val ? '开启' : '关闭'}`)
}
function onResetPwd(row: Record<string, any>) {
  ElMessageBox.confirm(`将「${row.name ?? row.account}」的密码重置为默认密码？`, '重置密码', { type: 'warning' })
    .then(() => {
      store.log('管理员', mod.value.title, '重置密码', row.account ?? row.name)
      ElMessage.success('密码已重置为 Yinyu@123456')
    })
    .catch(() => {})
}

// ---------- 反馈回复 ----------
const replyVisible = ref(false)
const replyText = ref('')
let replyTarget: Record<string, any> | null = null
function openReply(row: Record<string, any>) {
  replyTarget = row
  replyText.value = ''
  replyVisible.value = true
}
function submitReply() {
  if (!replyTarget) return
  if (!replyText.value.trim()) {
    ElMessage.warning('请输入回复内容')
    return
  }
  store.update(mod.value.key as any, replyTarget.id, { status: '已回复', reply: replyText.value.trim() })
  store.log('管理员', '用户反馈', '回复反馈', `回复 ${replyTarget.user}`)
  replyVisible.value = false
  ElMessage.success('回复成功，反馈已标记为已处理')
}

// ---------- 版权审核 ----------
function auditPass(row: Record<string, any>) {
  store.update(mod.value.key as any, row.id, { status: '已通过' })
  store.log('管理员', '版权管理', '审核通过', `《${row.name}》`)
  ElMessage.success(`《${row.name}》已通过版权审核`)
}
function auditReject(row: Record<string, any>) {
  store.update(mod.value.key as any, row.id, { status: '已驳回' })
  store.log('管理员', '版权管理', '审核驳回', `《${row.name}》`)
  ElMessage.warning(`《${row.name}》已驳回`)
}

// ---------- 角色权限树 ----------
const permVisible = ref(false)
const permTarget = ref<Record<string, any> | null>(null)
const permTreeRef = ref()
const permTreeData = computed(() => {
  const groups = new Map<string, any[]>()
  store.state.permissions.forEach((p) => {
    if (!groups.has(p.group)) groups.set(p.group, [])
    groups.get(p.group)!.push({ id: p.id, label: p.name })
  })
  return [...groups.entries()].map(([group, children]) => ({ id: `G-${group}`, label: group, children }))
})
function openPermTree(row: Record<string, any>) {
  permTarget.value = row
  permVisible.value = true
  window.setTimeout(() => {
    permTreeRef.value?.setCheckedKeys(row.permKeys ?? [])
  }, 60)
}
function savePermTree() {
  if (!permTarget.value) return
  const keys = permTreeRef.value?.getCheckedKeys(true)?.filter((k: string) => !k.startsWith('G-')) ?? []
  store.update(mod.value.key as any, permTarget.value.id, { permKeys: keys })
  store.log('管理员', '角色管理', '配置权限', `${permTarget.value.name}（${keys.length} 项）`)
  permVisible.value = false
  ElMessage.success('权限配置已保存')
}

// ---------- 批量 ----------
const selectedRows = ref<any[]>([])
function onSelectionChange(rows: any[]) {
  selectedRows.value = rows
}
function batchDelete() {
  if (!selectedRows.value.length) return ElMessage.warning('请先勾选记录')
  ElMessageBox.confirm(`确定删除选中的 ${selectedRows.value.length} 条记录吗？`, '批量删除', { type: 'warning' })
    .then(() => {
      selectedRows.value.forEach((r) => store.remove(mod.value.key as any, r.id))
      store.log('管理员', mod.value.title, '批量删除', `${selectedRows.value.length} 条记录`)
      ElMessage.success('批量删除成功')
      selectedRows.value = []
    })
    .catch(() => {})
}
function batchStatus(value: any) {
  if (!selectedRows.value.length) return ElMessage.warning('请先勾选记录')
  selectedRows.value.forEach((r) => store.update(mod.value.key as any, r.id, { status: value }))
  store.log('管理员', mod.value.title, '批量修改状态', `${selectedRows.value.length} 条 → ${value === 'on' ? '上架' : '下架'}`)
  ElMessage.success('批量操作成功')
}

// ---------- 分类树：父级选择 ----------
function categoryOptions(): { label: string; value: string }[] {
  return [{ label: '作为一级分类', value: '' }, ...store.state.categories.map((c) => ({ label: c.name, value: c.id }))]
}

// ---------- 导出 CSV ----------
function exportCsv() {
  const cols = mod.value.columns
  const head = cols.map((c) => c.label).join(',')
  const rows = filtered.value.map((r) => cols.map((c) => `"${String(formatter(r, c.prop) ?? '').replace(/"/g, '""')}"`).join(','))
  const csv = `\uFEFF${head}\n${rows.join('\n')}`
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `${mod.value.title}_${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(a.href)
  ElMessage.success('已导出 CSV')
}

// ---------- 单元格文本 ----------
function formatter(row: any, prop: string): string {
  const col = mod.value.columns.find((c) => c.prop === prop)
  if (col?.formatter) return col.formatter(row, store)
  return String(row[prop] ?? '')
}
function switchModel(row: any, colProp: string) {
  return computed({
    get: () => (colProp === 'status' ? row[colProp] === 'on' : Boolean(row[colProp])),
    set: (v: boolean) => {
      row[colProp] = colProp === 'status' ? (v ? 'on' : 'off') : v
      onSwitch(row, colProp)
    },
  })
}
</script>

<template>
  <div>
    <div class="flex items-end justify-between flex-wrap gap-3">
      <div>
        <h1 class="text-xl font-semibold">{{ mod.title }}</h1>
        <p v-if="mod.desc" class="mt-1.5 text-xs text-gray-400">{{ mod.desc }}</p>
      </div>
      <div class="flex items-center gap-2.5">
        <div class="flex items-center gap-2 bg-white rounded-lg border border-gray-200 px-3 h-9 w-64">
          <Search class="w-4 h-4 text-gray-400 shrink-0" />
          <input
            v-model="keyword" type="text" :placeholder="mod.searchPlaceholder ?? '搜索'"
            class="bg-transparent outline-none text-xs text-gray-700 placeholder:text-gray-400 w-full"
            :data-test="`crud-search-${props.module}`"
          />
        </div>
        <el-button :icon="RotateCcw" circle title="重置搜索" @click="keyword = ''" />
        <el-button v-if="mod.exportable" type="success" plain :icon="DownloadIcon" data-test="crud-export" @click="exportCsv">导出 CSV</el-button>
        <el-button v-if="!mod.readonly" type="primary" :icon="CirclePlus" data-test="crud-add" @click="openAdd">新增</el-button>
      </div>
    </div>

    <!-- 批量操作条 -->
    <div v-if="selectedRows.length" class="mt-4 flex items-center gap-2.5 bg-blue-50 border border-blue-100 rounded-lg px-4 h-11">
      <span class="text-xs text-blue-600">已选 {{ selectedRows.length }} 项</span>
      <el-button v-for="b in mod.batchStatus" :key="b.label" size="small" plain type="primary" @click="batchStatus(b.value)">{{ b.label }}</el-button>
      <el-button v-if="mod.batchDelete" size="small" plain type="danger" :data-test="`crud-batch-delete`" @click="batchDelete">批量删除</el-button>
      <el-button size="small" text @click="selectedRows = []">取消</el-button>
    </div>

    <!-- 表格 -->
    <div class="mt-4 bg-white rounded-xl p-4 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
      <el-table
        :data="paged"
        style="width: 100%"
        :row-key="(r: any) => r.id"
        :tree-props="mod.tree ? { children: 'children' } : undefined"
        :default-expand-all="mod.tree"
        @selection-change="onSelectionChange"
      >
        <el-table-column v-if="mod.selectable" type="selection" width="44" />
        <template v-for="col in mod.columns" :key="col.prop">
          <!-- 图片 + 主副文本 -->
          <el-table-column v-if="col.type === 'image'" :label="col.label" :min-width="190">
            <template #default="{ row }">
              <div class="flex items-center gap-3 min-w-0">
                <img
                  :src="row[col.prop]" alt=""
                  class="w-10 h-10 rounded object-cover bg-gray-100 shrink-0"
                  @error="imgFallback($event, ALBUM_FALLBACK)"
                />
                <div class="min-w-0">
                  <div class="text-[13px] text-gray-800 truncate">{{ row.name ?? row.title ?? row.user ?? row.level ?? row.account }}</div>
                  <div v-if="col.sub" class="text-xs text-gray-400 truncate mt-0.5">{{ row[col.sub] }}</div>
                </div>
              </div>
            </template>
          </el-table-column>
          <!-- 开关 -->
          <el-table-column v-else-if="col.type === 'switch'" :label="col.label" :width="col.width ?? 90">
            <template #default="{ row }">
              <el-switch :model-value="col.prop === 'status' ? row[col.prop] === 'on' : Boolean(row[col.prop])" @change="() => { row[col.prop] = col.prop === 'status' ? ($event ? 'on' : 'off') : $event; onSwitch(row, col.prop) }" />
            </template>
          </el-table-column>
          <!-- 标签 -->
          <el-table-column v-else-if="col.type === 'tag'" :label="col.label" :width="col.width ?? 100">
            <template #default="{ row }">
              <el-tag size="small" effect="plain" :type="(col.tagMap?.[formatter(row, col.prop)] as any) ?? 'info'">
                {{ formatter(row, col.prop) }}
              </el-tag>
            </template>
          </el-table-column>
          <!-- 普通列 -->
          <el-table-column v-else :prop="col.prop" :label="col.label" :min-width="col.width ?? 110" show-overflow-tooltip>
            <template #default="{ row }">
              <span :class="col.type === 'bold' ? 'text-[13px] font-medium text-gray-800' : 'text-[13px] text-gray-600'">{{ formatter(row, col.prop) }}</span>
            </template>
          </el-table-column>
        </template>

        <!-- 操作列 -->
        <el-table-column label="操作" :width="actionWidth" fixed="right">
          <template #default="{ row }">
            <template v-if="mod.rowActions?.includes('audit') && row.status === '待审核'">
              <el-button size="small" plain type="success" :data-test="`audit-pass-${row.id}`" @click="auditPass(row)">通过</el-button>
              <el-button size="small" plain type="danger" :data-test="`audit-reject-${row.id}`" @click="auditReject(row)">驳回</el-button>
            </template>
            <template v-else>
              <el-button v-if="mod.rowActions?.includes('reply')" size="small" plain type="primary" :disabled="row.status === '已回复'" :data-test="`reply-${row.id}`" @click="openReply(row)">
                {{ row.status === '已回复' ? '已回复' : '回复' }}
              </el-button>
              <el-button v-if="mod.rowActions?.includes('permTree')" size="small" plain type="warning" :data-test="`perm-${row.id}`" @click="openPermTree(row)">配权限</el-button>
              <el-button v-if="mod.rowActions?.includes('edit')" size="small" plain class="!ml-0" :data-test="`edit-${row.id}`" @click="openEdit(row)">编辑</el-button>
              <el-button v-if="mod.rowActions?.includes('resetPwd')" size="small" plain type="warning" :data-test="`resetpwd-${row.id}`" @click="onResetPwd(row)">重置密码</el-button>
              <el-button v-if="mod.rowActions?.includes('delete')" size="small" plain type="danger" class="!ml-2" :data-test="`delete-${row.id}`" @click="onDelete(row)">删除</el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div v-if="!mod.tree && total > pageSize" class="mt-4 flex justify-end">
        <el-pagination
          v-model:current-page="page"
          :page-size="pageSize"
          :total="total"
          layout="total, prev, pager, next"
          background
        />
      </div>
    </div>

    <!-- 新增/编辑弹窗 -->
    <el-dialog v-model="dialogVisible" :title="formTitle" width="560" destroy-on-close>
      <el-form label-width="130px">
        <el-form-item v-for="f in mod.fields" :key="f.prop" :label="f.label" :required="f.required">
          <el-switch v-if="f.type === 'switch'" v-model="form[f.prop]" />
          <el-input-number v-else-if="f.type === 'number'" v-model="form[f.prop]" :min="0" class="!w-full" />
          <el-select v-else-if="f.type === 'select'" v-model="form[f.prop]" class="!w-full" :placeholder="'请选择' + f.label">
            <el-option v-for="o in (f.prop === 'parent' ? categoryOptions() : fieldOptions(f))" :key="o.value" :label="o.label" :value="o.value" />
          </el-select>
          <div v-else-if="f.type === 'image'" class="w-full flex items-center gap-3">
            <img v-if="form[f.prop]" :src="form[f.prop]" alt="" class="w-14 h-14 rounded-lg object-cover bg-gray-100 border border-gray-100" @error="imgFallback($event, ALBUM_FALLBACK)" />
            <el-input v-model="form[f.prop]" :placeholder="f.placeholder ?? '/images/...'" />
          </div>
          <el-input v-else-if="f.type === 'textarea'" v-model="form[f.prop]" type="textarea" :rows="3" :placeholder="f.placeholder" />
          <el-input v-else v-model="form[f.prop]" :placeholder="f.placeholder" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" data-test="crud-submit" @click="submitForm">保存</el-button>
      </template>
    </el-dialog>

    <!-- 反馈回复弹窗 -->
    <el-dialog v-model="replyVisible" title="回复用户反馈" width="520">
      <div class="rounded-lg bg-gray-50 p-3 text-sm text-gray-600 mb-4">
        <span class="text-gray-400 mr-2">用户反馈：</span>{{ replyTarget?.content }}
      </div>
      <el-input v-model="replyText" type="textarea" :rows="4" placeholder="请输入回复内容" />
      <template #footer>
        <el-button @click="replyVisible = false">取消</el-button>
        <el-button type="primary" data-test="reply-submit" @click="submitReply">发送回复</el-button>
      </template>
    </el-dialog>

    <!-- 角色权限树弹窗 -->
    <el-dialog v-model="permVisible" :title="`配置权限：${permTarget?.name ?? ''}`" width="480">
      <el-tree
        ref="permTreeRef"
        :data="permTreeData"
        show-checkbox
        node-key="id"
        default-expand-all
        :props="{ label: 'label' }"
      />
      <template #footer>
        <el-button @click="permVisible = false">取消</el-button>
        <el-button type="primary" data-test="perm-save" @click="savePermTree">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

