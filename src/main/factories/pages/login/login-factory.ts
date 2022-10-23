import { RouteRecordRaw } from 'vue-router'
import LoginPage from '@/presentation/pages/LoginPage/LoginPage.vue'
import { makeRemoteAuthentication } from '@/main/factories/usecases/authentication/remote-authentication-factory'
import { makeLoginValidation } from './login-validation-factory'

export const makeLogin = (): RouteRecordRaw => ({
  path: '/login',
  component: LoginPage,
  props: {
    validation: makeLoginValidation(),
    authentication: makeRemoteAuthentication(),
  },
})
