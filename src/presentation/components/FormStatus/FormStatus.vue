<template>
  <div class="errorWrap">
    <app-spinner v-if="loading"></app-spinner>
    <span v-else-if="error" class="error">{{ error }}</span>
  </div>
</template>

<script setup lang="ts">
  import { watch } from 'vue'
  import { AppSpinner } from '@/presentation/components'

  interface Props {
    loading: boolean
    error: string
  }

  const props = defineProps<Props>()

  watch(
    () => props.loading,
    () => console.log(props.loading)
  )
</script>

<style scoped>
  @import './FormStatus-styles.scss';
</style>
