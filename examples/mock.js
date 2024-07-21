import HttpRequestMock from 'http-request-mock'

export const path = 'http://http-data-request.com'
export const baseUrl = ''

const mocker = HttpRequestMock.setup()

let accessTokenInvalid = true
let refreshTokenInvalid = false

export function success (data) {
  return {
    code: 0,
    msg: 'ok',
    data
  }
}
export function setAccessTokenInvalid (val) {
  accessTokenInvalid = val
}
export function setRefreshTokenInvalid (val) {
  refreshTokenInvalid = val
}
export function resetTokenState () {
  accessTokenInvalid = true
  refreshTokenInvalid = false
}

// mocker.mock 的 status 值默认为 200
mocker.mock({
  url: path + '/success',
  headers: {
    'Content-Type': 'application/json'
  },
  response (requestInfo) {
    // console.log(requestInfo)
    return success({
      method: requestInfo.method,
      name: 'Terry'
    })
  }
})
mocker.mock({
  url: path + '/business-error',
  headers: {
    'Content-Type': 'application/json'
  },
  response () {
    return {
      code: 1000,
      msg: '用户名不正确!',
      data: {}
    }
  }
})
mocker.mock({
  url: path + '/500-error',
  status: 500,
  headers: {
    'Content-Type': 'application/json'
  }
})
mocker.mock({
  url: path + '/404-error',
  status: 404,
  headers: {
    'Content-Type': 'application/json'
  }
})
mocker.mock({
  url: path + '/long-time',
  headers: {
    'Content-Type': 'application/json'
  },
  delay: 10000,
  response: () => success({
    a: 1,
    b: 2
  })
})
mocker.mock({
  url: path + '/login-success-with-access-token',
  headers: {
    'Content-Type': 'application/json'
  },
  response: () => success({
    access: {
      accessToken: 'access-token-refresh-success',
      refreshToken: 'the-new-refresh-token',
      expiresIn: 10086
    }
  })
})
mocker.mock({
  url: path + '/no-body',
  headers: {
    'Content-Type': 'application/json'
  },
  response () {

  }
})

mocker.mock({
  url: path + '/auth/access-token-invalid',
  headers: {
    'Content-Type': 'application/json'
  },
  delay: 1000,
  response () {
    if (accessTokenInvalid) {
      // access token 失效，要求刷新
      return {
        code: 10,
        msg: 'access token invalid.',
        data: {}
      }
    } else {
      // 刷新 access token 后，请求成功
      return success({ message: 'access token refresh and load data success.' })
    }
  }
})
mocker.mock({
  url: path + '/auth/refresh-token',
  headers: {
    'Content-Type': 'application/json'
  },
  response () {
    if (refreshTokenInvalid) {
      // 刷新 token 失败
      return {
        code: 11,
        msg: 'refresh token invalid.',
        data: {}
      }
    } else {
      setAccessTokenInvalid(false)
      // 刷新 token 成功
      return success({
        access: {
          accessToken: 'access-token-refresh-success',
          refreshToken: 'the-new-refresh-token',
          expiresIn: 10086
        }
      })
    }
  }
})
mocker.mock({
  url: path + '/auth/access-token-and-refresh-token-invalid',
  headers: {
    'Content-Type': 'application/json'
  },
  delay: 1000,
  response () {
    return {
      code: 11,
      msg: 'refresh token invalid.',
      data: {}
    }
  }
})
