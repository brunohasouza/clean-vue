<template>
  <div class="loginPage">
    <login-header v-once></login-header>
    <form>
      <h2>Login</h2>
      <app-input
        type="email"
        name="email"
        placeholder="Digite seu e-mail"
        :error="state.emailError"
        v-model="state.email"
      ></app-input>
      <app-input
        type="password"
        name="password"
        placeholder="Digite sua senha"
        :error="state.passwordError"
      ></app-input>
      <button class="submit" type="submit" disabled>Entrar</button>
      <span class="link">Criar Conta</span>
      <form-status></form-status>
    </form>
    <app-footer v-once></app-footer>
  </div>
</template>

<script setup lang="ts">
  import { provide, reactive, watch } from 'vue'
  import {
    LoginHeader,
    AppFooter,
    AppInput,
    FormStatus,
  } from '@/presentation/components'
  import { StateProps } from './LoginPage-types'
  import { Validation } from '@/presentation/protocols/validation'

  type LoginProps = {
    validation: Validation
  }

  const props = defineProps<LoginProps>()

  const state: StateProps = reactive({
    isLoading: false,
    mainError: '',
    emailError: 'Campo obrigatório',
    passwordError: 'Campo obrigatório',
    email: '',
  })

  provide('state', state)

  watch(
    () => state.email,
    () => {
      props.validation.validate({ email: state.email })
    }
  )
</script>

<style scoped>
  @import './LoginPage-styles.scss';
</style>
