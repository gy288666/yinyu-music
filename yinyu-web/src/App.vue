<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import PlayerBar from './components/PlayerBar.vue'

const route = useRoute()
const showPlayer = computed(() => Boolean(route.meta.player))
</script>

<template>
  <router-view />
  <PlayerBar v-if="showPlayer" />
</template>
