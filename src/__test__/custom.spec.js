import { describe, test, expect, vi } from 'vitest'

import {
  customPath,
  setRefreshTokenInvalid,
  resetTokenState,
  storageKeyParamRefreshToken
} from './mock-for-test'
import {
  useHttpDataRequest,
  EXCEPTION_AUTH_INVALID,
  EXCEPTION_CANCELLED
} from '@/'
import { Cache } from '@/cache'
import { STORAGE_KEY_ACCESS_TOKEN, STORAGE_KEY_REFRESH_TOKEN } from '@/constants'

const handleException = vi.fn()

const options = {
  baseUrl: customPath,
  expiresIn: 2,
  timeout: 2000,
  keys: {
    dataSet: 'customAccess',
    accessToken: 'customAccessToken',
    refreshToken: 'customRefreshToken',
    expiresIn: 'customExpiresIn',
    paramRefreshToken: 'customRefreshToken',
    header: 'x-custom-http-request-access-token'
  },
  statuses: {
    success: 100,
    invalidAccessToken: 150,
    invalidRefreshToken: 160
  },
  exception: handleException
}

const { post, cancel } = useHttpDataRequest(options)

describe('http-data-request customization', () => {
  describe('do request', () => {
    Cache.clear()
    test('success', async () => {
      const result = await post('/success')
      // console.log(result)
      expect(result).toMatchObject({ method: 'POST', name: 'Terry' })
    })
    test('login success with access token', async () => {
      // localStorage 中无相关身份令牌
      expect(Cache.have(STORAGE_KEY_ACCESS_TOKEN)).toBeFalsy()
      expect(Cache.have(STORAGE_KEY_REFRESH_TOKEN)).toBeFalsy()

      await post('/login-success-with-access-token')

      // 登录成功后，完成身份令牌存储
      expect(Cache.get(STORAGE_KEY_ACCESS_TOKEN)).toBe('access-token-refresh-success')
      expect(Cache.get(STORAGE_KEY_REFRESH_TOKEN)).toBe('the-new-refresh-token')
    })
    test('custom header key to pass access token', async () => {
      const result = await post('/success')
      const headers = result.headers
      // 登录成功后，才会在头部添加该项目
      expect(Object.hasOwn(headers, 'x-custom-http-request-access-token')).toBeTruthy()
    })
    test('cancel request', async () => {
      const promise = new Promise((resolve, reject) => {
        post('/long-time').catch(error => reject(error))

        setTimeout(() => {
          cancel()
        }, 200)
      })
      try {
        await promise
      } catch (error) {
        // cancel 异常不进入 options.exception 统一异常处理模块
        expect(error.message).toBe('The current request has been cancelled')
        expect(error.type).toBe(EXCEPTION_CANCELLED)
      }
    })
    test('access token 失效并刷新成功后，正确获得数据', async () => {
      resetTokenState()
      const result = await post('/auth/access-token-invalid')
      // 刷新 token 时发送的自定义参数名
      const refreshParamName = Cache.get(storageKeyParamRefreshToken)

      expect(result.message).toBe('access token refresh and load data success.')
      expect(refreshParamName).toBe('customRefreshToken')
    })
    test('access token 失效并刷新失败，进入异常处理', async () => {
      resetTokenState()
      setRefreshTokenInvalid(true)

      try {
        await post('/auth/access-token-invalid')
      } catch (error) {
        expect(error.message).toBe('Your login authorization has expired')
        expect(error.type).toBe(EXCEPTION_AUTH_INVALID)

        const exceptionParams = handleException.mock.calls.at(-1)
        expect(exceptionParams[0]).toBe('Your login authorization has expired')
        expect(exceptionParams[1]).toBe(EXCEPTION_AUTH_INVALID)
      }
    })
    test('使用 access token 请求，响应 refresh token 失效', async () => {
      try {
        await post('/auth/access-token-and-refresh-token-invalid')
      } catch (error) {
        expect(error.message).toBe('Your login authorization has expired')
        expect(error.type).toBe(EXCEPTION_AUTH_INVALID)

        const exceptionParams = handleException.mock.calls.at(-1)
        expect(exceptionParams[0]).toBe('Your login authorization has expired')
        expect(exceptionParams[1]).toBe(EXCEPTION_AUTH_INVALID)
      }
    })
  })
})
