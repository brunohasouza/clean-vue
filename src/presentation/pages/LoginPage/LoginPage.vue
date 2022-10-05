<template>
  <div class="loginPage">
    <login-header v-once></login-header>
    <form @submit.prevent="handleSubmit">
      <h2>Login</h2>
      <app-input
        v-model="state.email"
        type="email"
        name="email"
        placeholder="Digite seu e-mail"
        :error="state.emailError"
      ></app-input>
      <app-input
        v-model="state.password"
        type="password"
        name="password"
        placeholder="Digite sua senha"
        :error="state.passwordError"
      ></app-input>
      <button class="submit" type="submit" :disabled="disabled">Entrar</button>
      <span class="link">Criar Conta</span>
      <form-status
        :loading="state.isLoading"
        :error="state.mainError"
      ></form-status>
    </form>
    <app-footer v-once></app-footer>
  </div>
</template>

<script setup lang="ts">
  import { provide, reactive, watch, computed } from 'vue'
  import {
    LoginHeader,
    AppFooter,
    AppInput,
    FormStatus,
  } from '@/presentation/components'
  import { StateProps } from './LoginPage-types'
  import { Validation } from '@/presentation/protocols/validation'
  import { Authentication } from '@/domain/usecases'

  type LoginProps = {
    validation: Validation
    authentication: Authentication
  }

  const props = defineProps<LoginProps>()

  const state: StateProps = reactive({
    isLoading: false,
    mainError: '',
    emailError: 'Campo obrigatório',
    passwordError: 'Campo obrigatório',
    email: '',
    password: '',
  })

  const disabled = computed<boolean>(
    () => !!state.emailError || !!state.passwordError
  )

  const handleSubmit = async (): Promise<void> => {
    if (state.isLoading || disabled.value) {
      return
    }

    try {
      state.isLoading = true
      await props.authentication.auth({
        email: state.email,
        password: state.password,
      })
    } catch (error) {
      state.isLoading = false
      state.mainError = error.message
    }
  }

  provide('$state', () => state)

  watch(
    () => state.email,
    () => {
      state.emailError = props.validation.validate('email', state.email)
    }
  )

  watch(
    () => state.password,
    () => {
      state.passwordError = props.validation.validate(
        'password',
        state.password
      )
    }
  )
</script>

<style scoped>
  @import './LoginPage-styles.scss';
</style>
