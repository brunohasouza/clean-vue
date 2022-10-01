<template>
  <div class="errorWrap">
    <app-spinner v-if="state.isLoading"></app-spinner>
    <span v-if="state.errorMessage" class="error">{{
      state.errorMessage
    }}</span>
  </div>
</template>

<script setup lang="ts">
  import { inject } from 'vue'
  import { AppSpinner } from '@/presentation/components'
  import { StateProps } from '@/presentation/pages/LoginPage/LoginPage-types'

  const state = inject<StateProps>('state')
</script>

<style scoped>
  @import './FormStatus-styles.scss';
</style>
