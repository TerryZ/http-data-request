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
  // console.log('/http/access-token-invalid', refreshed)
  if (refreshed) {
    // 第二次是在刷新 access token 后，请求成功
    return {
      code: 0,
      msg: 'ok',
      data: {
        refreshed: true
      }
    }
  } else {
    // 第一次请求，要求刷新 access token
    return {
      code: 10,
      msg: 'access token invalid.',
      data: {}
    }
  }
})

Mock.mock(path + '/auth/refresh-token', () => {
  // console.log('/auth/refresh-token', refreshed)
  refreshed = true
  // 刷新 token 成功
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
  // 刷新 token 失败
  return {
    code: 11,
    msg: 'refresh token invalid.',
    data: {}
  }
})

// Mock.setup({
//   timeout: '10-100'
// })
