<template>
  <div class="errorWrap">
    <app-spinner></app-spinner>
    <span class="error">Error</span>
  </div>
</template>

<script setup lang="ts">
  import { AppSpinner } from '@/presentation/components'
</script>

<style scoped>
  @import './FormStatus-styles.scss';
</style>
