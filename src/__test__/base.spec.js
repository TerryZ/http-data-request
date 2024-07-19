import { describe, test, expect, vi } from 'vitest'

import { path } from '@example/mock'
import {
  useHttpDataRequest,
  EXCEPTION_BUSINESS,
  EXCEPTION_SYSTEM
} from '@/'
import { Cache } from '@/cache'
import { key } from '@/constants'

const handleException = vi.fn()

const options = {
  baseUrl: path,
  expiresIn: 2,
  // keyAccessToken: 'myToken',
  // keyExpiresIn: 'myExpiresIn',
  timeout: 2000,
  exception: handleException
}

export const {
  http, get, post, put, patch, del,
  cancel, isSessionTimeout
} = useHttpDataRequest(options)

describe('http-data-request base', () => {
  describe('static api', () => {
    test('http should be a function', () => {
      expect(typeof http).toEqual('function')
    })
    test('get should be a function', () => {
      expect(typeof get).toEqual('function')
    })
    test('post should be a function', () => {
      expect(typeof post).toEqual('function')
    })
    test('put should be a function', () => {
      expect(typeof put).toEqual('function')
    })
    test('patch should be a function', () => {
      expect(typeof patch).toEqual('function')
    })
    test('del should be a function', () => {
      expect(typeof del).toEqual('function')
    })
    test('cancel should be a function', () => {
      expect(typeof cancel).toEqual('function')
    })
  })
  describe('do request', () => {
    test('should have promise method helpers', function () {
      const promise = http('/success')

      expect(typeof promise.then).toEqual('function')
      expect(typeof promise.catch).toEqual('function')
    })
    test('success', async () => {
      const result = await post('/success')
      // console.log(result)
      expect(result).toMatchObject({ name: 'Terry' })
    })
    test('business-error', async () => {
      try {
        await post('/business-error')
      } catch (error) {
        expect(error.message).toEqual('用户名不正确!')

        // options.exception 处理模块
        expect(handleException).toHaveBeenCalled()
        const exceptionParams = handleException.mock.calls.at(-1)
        expect(exceptionParams[0]).toBe('用户名不正确!')
        expect(exceptionParams[1]).toBe(EXCEPTION_BUSINESS)
      }
    })
    test('500 error', async () => {
      try {
        await post('/500-error')
      } catch (error) {
        expect(error.response.status).toBe(500)

        expect(handleException).toHaveBeenCalled()
        const exceptionParams = handleException.mock.calls.at(-1)
        expect(exceptionParams[0]).toBe('服务器内部错误')
        expect(exceptionParams[1]).toBe(EXCEPTION_SYSTEM)
      }
    })
    test('no response data body', async () => {
      try {
        await post('/no-body')
      } catch (error) {
        expect(error.message).toBe('系统异常，请联系管理员！')

        expect(handleException).toHaveBeenCalled()
        const exceptionParams = handleException.mock.calls.at(-1)
        expect(exceptionParams[0]).toBe('系统异常，请联系管理员！')
        expect(exceptionParams[1]).toBe(EXCEPTION_BUSINESS)
      }
    })
    test('login success with access token', async () => {
      // localStorage 中无相关身份令牌
      expect(Cache.have(key.token)).toBeFalsy()
      expect(Cache.have(key.refreshToken)).toBeFalsy()

      await post('/login-success-with-access-token')

      // 登录成功后，完成身份令牌存储
      expect(Cache.get(key.token)).toBe('access-token-refresh-success')
      expect(Cache.get(key.refreshToken)).toBe('the-new-refresh-token')
    })
  })
})
