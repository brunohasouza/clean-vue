<template>
  <div class="loginPage">
    <login-header v-once></login-header>
    <form>
      <h2>Login</h2>
      <app-input
        type="email"
        name="email"
        placeholder="Digite seu e-mail"
      ></app-input>
      <app-input
        type="password"
        name="password"
        placeholder="Digite sua senha"
      ></app-input>
      <button class="submit" type="submit">Entrar</button>
      <span class="link">Criar Conta</span>
      <form-status></form-status>
    </form>
    <app-footer v-once></app-footer>
  </div>
</template>

<script setup lang="ts">
  import { provide, reactive } from 'vue'
  import {
    LoginHeader,
    AppFooter,
    AppInput,
    FormStatus,
  } from '@/presentation/components'
  import { StateProps } from './LoginPage-types'

  const state: StateProps = reactive({
    isLoading: false,
    errorMessage: '',
  })

  provide('state', state)
</script>

<style scoped>
  @import './LoginPage-styles.scss';
</style>
