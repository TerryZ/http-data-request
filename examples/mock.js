import Mock from 'mockjs'

export const path = 'http://http-data-request.com'

// 设置延迟响应
Mock.setup({
  timeout: '500-3000'
})

Mock.mock(path + '/http/request-long-time', () => {
  return {
    code: 0,
    msg: 'ok',
    data: {}
  }
})

Mock.mock(path + '/http/business-error', options => {
  console.log(options)
  return {
    code: 1000,
    msg: '用户名不正确!',
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
      code: 10,
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
    code: 11,
    msg: 'refresh token invalid.',
    data: {}
  }
})

// Mock.setup({
//   timeout: '10-100'
// })
