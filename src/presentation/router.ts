import { makeLogin } from '@/main/factories/pages/login/login-factory'
import {
  createRouter,
  createWebHistory,
  Router,
  RouteRecordRaw,
} from 'vue-router'

const routes: RouteRecordRaw[] = [makeLogin()]

const router: Router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
