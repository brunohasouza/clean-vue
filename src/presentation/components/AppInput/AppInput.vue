<template>
  <div class="inpuWrap">
    <input
      v-model="localValue"
      :type="type"
      :name="name"
      :placeholder="placeholder"
    />
    <span v-if="error" class="status" :title="error">🔴</span>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'

  interface Props {
    modelValue?: string | number
    name?: string
    type?: string
    placeholder?: string
    error?: string
  }

  interface Emits {
    (e: 'update:modelValue', value: string | number): void
  }

  const emit = defineEmits<Emits>()
  const props = defineProps<Props>()

  const localValue = computed<string | number>({
    get() {
      return props.modelValue
    },
    set(val) {
      emit('update:modelValue', val)
    },
  })
</script>

<style scoped lang="scss">
  @import './AppInput-styles.scss';
</style>
