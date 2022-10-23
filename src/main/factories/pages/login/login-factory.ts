import { RouteRecordRaw } from 'vue-router'
import { RemoteAuthentication } from '@/data/usecases/authentication/remote-authentication'
import { AxiosHttpClient } from '@/infra/http/axios-http-client/axios-http-client'
import LoginPage from '@/presentation/pages/LoginPage/LoginPage.vue'
import { ValidationComposite } from '@/validation/validators'
import { ValidationBuilder } from '@/validation/validators/builder/validation-builder'

export const makeLogin = (): RouteRecordRaw => {
  const url = 'http://fordevs.herokuapp.com/api/login'
  const axiosHttpClient = new AxiosHttpClient()

  const remoteAuthentication = new RemoteAuthentication(url, axiosHttpClient)
  const validationComposite = ValidationComposite.build([
    ...ValidationBuilder.field('email').required().email().build(),
    ...ValidationBuilder.field('password').required().min(5).build(),
  ])

  return {
    path: '/login',
    component: LoginPage,
    props: {
      validation: validationComposite,
      authentication: remoteAuthentication,
    },
  }
}
