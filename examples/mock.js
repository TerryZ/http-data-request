import Mock from 'mockjs'
import { path } from './setup'

// 设置延迟响应
Mock.setup({
  timeout: 1000
})

Mock.mock(path + '/http/request-long-time', () => {
  return {
    code: 0,
    msg: 'ok',
    data: {}
  }
})

let refreshed = false
Mock.mock(path + '/http/access-token-invalid', options => {
  if (refreshed) {
    return {
      code: 0,
      msg: 'ok',
      data: {
        refreshed: true
      }
    }
  } else {
    return {
      code: 901,
      msg: 'access token invalid.',
      data: {}
    }
  }
})

Mock.mock(path + '/auth/refresh-token', () => {
  refreshed = true
  // return {
  //   code: 0,
  //   msg: 'ok',
  //   data: {
  //     access: {
  //       accessToken: 'access-token-refresh-success',
  //       refreshToken: 'the-new-refresh-token',
  //       expiresIn: 10086
  //     }
  //   }
  // }
  return {
    code: 902,
    msg: 'refresh token invalid.',
    data: {}
  }
})

// Mock.setup({
//   timeout: '10-100'
// })
