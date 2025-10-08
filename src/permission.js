import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/404'] //没有token也能访问的页面

router.beforeEach((to, from, next) => {
  NProgress.start()
  document.title = getPageTitle(to.meta.title)
  if (store.state.user.token) {
    //有token还想访问登录页 直接进主页
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      //当用户没有刷新页面时候 是有userInfo信息的, 一旦刷新就没有userInfo
      if (!store.state.user.userInfo.userId) {
        store.dispatch('user/getUserInfo').then(() => next())
      } else next()
    }
  } else {

    if (whiteList.includes(to.path)) {
      next()
    } else {
      //没有token还想访问非登录页 直接定向到登陆页面
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
