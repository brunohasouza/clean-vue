<template>
  <div class="errorWrap">
    <app-spinner v-if="loading"></app-spinner>
    <span v-else-if="error" class="error">{{ error }}</span>
  </div>
</template>

<script setup lang="ts">
  import { AppSpinner } from '@/presentation/components'

  interface Props {
    loading: boolean
    error: string
  }

  defineProps<Props>()
</script>

<style scoped>
  @import './FormStatus-styles.scss';
</style>
