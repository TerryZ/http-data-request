import { DialogMessageError, DialogAlertError } from 'v-dialogs'

import {
  useHttpDataRequest,
  EXCEPTION_BUSINESS,
  EXCEPTION_AUTH_INVALID
} from '@/'
import { path } from './mock'

const options = {
  baseUrl: path,
  expiresIn: 2,
  // keyAccessToken: 'myToken',
  // keyExpiresIn: 'myExpiresIn',
  timeout: 2000,
  exception (message, type) {
    // console.log(type)
    if (type === EXCEPTION_BUSINESS) {
      DialogMessageError(message, { language: 'cn' })
      return
    }

    DialogAlertError(message, { language: 'cn' })

    if (type === EXCEPTION_AUTH_INVALID) {
      console.log('登录授权失效后续处理，通常跳转至登录')
      // console.log(cancel)
      cancel()
    }
  }
}

export const {
  http, get, post, put, patch, del,
  cancel, isSessionTimeout
} = useHttpDataRequest(options)
