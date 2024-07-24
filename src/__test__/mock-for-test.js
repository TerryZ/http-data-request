import HttpRequestMock from 'http-request-mock'
import { Cache } from '@/cache'

export const path = 'http://http-data-request.com'
export const customPath = 'http://http-data-request.com/custom'
export const baseUrl = ''
export const storageKeyParamRefreshToken = 'custom-param-refresh-token'

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
export function customSuccess (data) {
  return {
    code: 100,
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

function successWithAccess () {
  return success({
    access: {
      accessToken: 'access-token-refresh-success',
      refreshToken: 'the-new-refresh-token',
      expiresIn: 10086
    }
  })
}
function customSuccessWithAccess () {
  return customSuccess({
    customAccess: {
      customAccessToken: 'access-token-refresh-success',
      customRefreshToken: 'the-new-refresh-token',
      customExpiresIn: 10086
    }
  })
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
      headers: requestInfo.headers,
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
  response: () => successWithAccess()
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
  delay: 300,
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
      return successWithAccess()
    }
  }
})
mocker.mock({
  url: path + '/auth/access-token-and-refresh-token-invalid',
  headers: {
    'Content-Type': 'application/json'
  },
  delay: 300,
  response () {
    return {
      code: 11,
      msg: 'refresh token invalid.',
      data: {}
    }
  }
})

/**
 * ----------------Customize data property and status-----------------
 */
mocker.mock({
  url: customPath + '/success',
  headers: {
    'Content-Type': 'application/json'
  },
  response (requestInfo) {
    // console.log(requestInfo)
    return customSuccess({
      method: requestInfo.method,
      headers: requestInfo.headers,
      name: 'Terry'
    })
  }
})
mocker.mock({
  url: customPath + '/long-time',
  headers: {
    'Content-Type': 'application/json'
  },
  delay: 10000,
  response: () => customSuccess({
    a: 1,
    b: 2
  })
})
mocker.mock({
  url: customPath + '/login-success-with-access-token',
  headers: {
    'Content-Type': 'application/json'
  },
  response: () => customSuccessWithAccess()
})
mocker.mock({
  url: customPath + '/auth/access-token-invalid',
  headers: {
    'Content-Type': 'application/json'
  },
  delay: 300,
  response () {
    if (accessTokenInvalid) {
      // access token 失效，要求刷新
      return {
        code: 150,
        msg: 'access token invalid.',
        data: {}
      }
    } else {
      // 刷新 access token 后，请求成功
      return customSuccess({ message: 'access token refresh and load data success.' })
    }
  }
})
mocker.mock({
  url: customPath + '/auth/refresh-token',
  headers: {
    'Content-Type': 'application/json'
  },
  response (requestInfo) {
    // console.log(requestInfo)
    // 发送请求时使用的参数名称
    const paramName = Object.keys(requestInfo.body).at(0)
    Cache.set(storageKeyParamRefreshToken, paramName)

    if (refreshTokenInvalid) {
      // 刷新 token 失败
      return {
        code: 160,
        msg: 'refresh token invalid.',
        data: {}
      }
    } else {
      setAccessTokenInvalid(false)
      // 刷新 token 成功
      return customSuccessWithAccess()
    }
  }
})
mocker.mock({
  url: customPath + '/auth/access-token-and-refresh-token-invalid',
  headers: {
    'Content-Type': 'application/json'
  },
  delay: 300,
  response () {
    return {
      code: 160,
      msg: 'refresh token invalid.',
      data: {}
    }
  }
})
