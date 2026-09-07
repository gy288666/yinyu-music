<script setup lang="ts">
import { reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { useAdminStore } from '../../data/adminStore'

const admin = useAdminStore()
const form = reactive({ ...admin.state.settings })

function save() {
  Object.assign(admin.state.settings, form)
  admin.log('管理员', '系统管理', '修改系统设置', `站点名称：${form.siteName}`)
  ElMessage.success('系统设置已保存')
}
function reset() {
  Object.assign(form, admin.state.settings)
  ElMessage.info('已还原为当前配置')
}
</script>

<template>
  <div class="max-w-[760px]">
    <h1 class="text-xl font-semibold">系统设置</h1>
    <p class="mt-1.5 text-xs text-gray-400">基础配置、存储配置与音频配置（保存后立即生效）</p>

    <div class="mt-5 bg-white rounded-xl p-6 shadow-[0_1px_2px_rgba(16,24,40,0.04)] space-y-8">
      <!-- 基础配置 -->
      <section>
        <h3 class="text-[15px] font-semibold text-gray-800">基础配置</h3>
        <div class="mt-4 grid grid-cols-2 gap-x-6 gap-y-4">
          <div>
            <div class="text-xs text-gray-500 mb-1.5">站点名称</div>
            <el-input v-model="form.siteName" data-test="set-siteName" />
          </div>
          <div>
            <div class="text-xs text-gray-500 mb-1.5">备案号</div>
            <el-input v-model="form.beian" />
          </div>
          <div class="col-span-2">
            <div class="text-xs text-gray-500 mb-1.5">版权信息</div>
            <el-input v-model="form.copyright" />
          </div>
        </div>
      </section>

      <!-- 存储配置 -->
      <section>
        <h3 class="text-[15px] font-semibold text-gray-800">存储配置（初期：本地存储）</h3>
        <div class="mt-4 grid grid-cols-2 gap-x-6 gap-y-4">
          <div class="col-span-2">
            <div class="text-xs text-gray-500 mb-1.5">本地存储根目录</div>
            <el-input v-model="form.storagePath" />
          </div>
          <div>
            <div class="text-xs text-gray-500 mb-1.5">音频上传上限（MB）</div>
            <el-input-number v-model="form.maxAudioMb" :min="1" :max="500" class="!w-full" />
          </div>
          <div>
            <div class="text-xs text-gray-500 mb-1.5">封面上限（MB）</div>
            <el-input-number v-model="form.maxCoverMb" :min="1" :max="20" class="!w-full" />
          </div>
          <div>
            <div class="text-xs text-gray-500 mb-1.5">头像上限（MB）</div>
            <el-input-number v-model="form.maxAvatarMb" :min="1" :max="10" class="!w-full" />
          </div>
        </div>
      </section>

      <!-- 音频配置 -->
      <section>
        <h3 class="text-[15px] font-semibold text-gray-800">音频配置（FFmpeg 转码）</h3>
        <div class="mt-4 grid grid-cols-2 gap-x-6 gap-y-4">
          <div class="col-span-2">
            <div class="text-xs text-gray-500 mb-1.5">音质选项</div>
            <el-input v-model="form.audioBitrate" />
          </div>
          <div class="col-span-2 flex items-center justify-between bg-gray-50 rounded-lg px-4 h-12">
            <span class="text-sm text-gray-600">启用自动转码（提取时长 / 生成波形 / 多音质转码）</span>
            <el-switch v-model="form.enableTranscode" />
          </div>
        </div>
      </section>

      <div class="flex items-center gap-3 pt-2">
        <el-button type="primary" data-test="settings-save" @click="save">保存设置</el-button>
        <el-button @click="reset">还原</el-button>
      </div>
    </div>
  </div>
</template>
