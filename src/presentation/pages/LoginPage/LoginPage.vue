<template>
  <div class="loginPage">
    <login-header v-once></login-header>
    <form>
      <h2>Login</h2>
      <app-input
        type="email"
        name="email"
        placeholder="Digite seu e-mail"
        :error="errorState.emailError"
      ></app-input>
      <app-input
        type="password"
        name="password"
        placeholder="Digite sua senha"
        :error="errorState.passwordError"
      ></app-input>
      <button class="submit" type="submit" disabled>Entrar</button>
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
  import { StateProps, ErrorProps } from './LoginPage-types'

  const state: StateProps = reactive({
    isLoading: false,
    errorMessage: '',
  })

  const errorState: ErrorProps = reactive({
    emailError: 'Campo obrigatório',
    passwordError: 'Campo obrigatório',
  })

  provide('state', state)
</script>

<style scoped>
  @import './LoginPage-styles.scss';
</style>
