// import { DialogMessageError, DialogAlertError } from 'v-dialogs'

import {
  useHttpDataRequest,
  EXCEPTION_BUSINESS,
  EXCEPTION_AUTH_INVALID
} from '@/'
import { path } from './mock'
import {
  exampleLanguage,
  exampleAccess,
  exampleAccessToken,
  exampleRefreshToken,
  exampleExpiresIn,
  exampleCodeSuccess,
  exampleCodeInvalidAccessToken,
  exampleCodeInvalidRefreshToken
} from './example-utils'
import { pushConsoleLog } from './log-board'

const options = {
  language: exampleLanguage.value,
  baseUrl: path,
  expiresIn: 2,
  timeout: 2000,
  keys: {
    dataSet: exampleAccess.value,
    accessToken: exampleAccessToken.value,
    refreshToken: exampleRefreshToken.value,
    expiresIn: exampleExpiresIn.value
    // 执行刷新时传递 refresh token 使用的请求参数名
    // paramRefreshToken: KEY_PARAM_REFRESH_TOKEN,
    // header: KEY_HEADER_ACCESS_TOKEN
  },
  statuses: {
    success: exampleCodeSuccess.value,
    invalidAccessToken: exampleCodeInvalidAccessToken.value,
    invalidRefreshToken: exampleCodeInvalidRefreshToken.value
  },
  exception (message, type) {
    // console.log(type)
    if (type === EXCEPTION_BUSINESS) {
      // DialogMessageError(message, { language: 'cn' })
      // console.warn(message)
      pushConsoleLog(message, type)
      return
    }

    // DialogAlertError(message, { language: 'cn' })
    // console.error(message)
    pushConsoleLog(message, type)

    if (type === EXCEPTION_AUTH_INVALID) {
      // console.error('登录授权失效后续处理，通常跳转至登录')
      // console.log(cancel)
      cancel()
    }
  }
}

export const {
  http, get, post, put, patch, del,
  cancel, isSessionTimeout
} = useHttpDataRequest(options)
