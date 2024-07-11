import {
  Http,
  httpSetup,
  EXCEPTION_BUSINESS,
  EXCEPTION_AUTH_INVALID
} from '@/'

const options = {
  baseUrl: '',
  expiresIn: 2,
  // keyAccessToken: 'myToken',
  // keyExpiresIn: 'myExpiresIn',
  timeout: 2000,
  exception (message, type) {
    // console.log(type)
    if (type === EXCEPTION_BUSINESS) {
      alert(message)
      return
    }

    alert(message)
    // router.replace({ path: base.login })
    if (type === EXCEPTION_AUTH_INVALID) {
      console.log('登录授权失效后续处理！')
    }
  }
}

const instance = new Http(options)

export const {
  http, get, post, put, patch, del,
  cancel, isSessionTimeout
} = httpSetup(instance)