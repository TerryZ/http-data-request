import { describe, test, expect, vi } from 'vitest'

import {
  path,
  setRefreshTokenInvalid,
  resetTokenState
} from './mock-for-test'
import {
  useHttpDataRequest,
  EXCEPTION_BUSINESS,
  EXCEPTION_AUTH_INVALID,
  EXCEPTION_SYSTEM,
  EXCEPTION_CANCELLED
} from '@/'
import { Cache } from '@/cache'
import { STORAGE_KEY_ACCESS_TOKEN, STORAGE_KEY_REFRESH_TOKEN } from '@/constants'

const handleException = vi.fn()

const options = {
  language: 'zh-chs',
  baseUrl: path,
  expiresIn: 2,
  timeout: 2000,
  exception: handleException
}

const { http, get, post, put, patch, del, cancel } = useHttpDataRequest(options)

describe('http-data-request base', () => {
  describe('static api', () => {
    test('http 应是一个函数', () => {
      expect(typeof http).toEqual('function')
    })
    test('get 应是一个函数', () => {
      expect(typeof get).toEqual('function')
    })
    test('post 应是一个函数', () => {
      expect(typeof post).toEqual('function')
    })
    test('put应是一个函数', () => {
      expect(typeof put).toEqual('function')
    })
    test('patch 应是一个函数', () => {
      expect(typeof patch).toEqual('function')
    })
    test('del 应是一个函数', () => {
      expect(typeof del).toEqual('function')
    })
    test('cancel 应是一个函数', () => {
      expect(typeof cancel).toEqual('function')
    })
  })
  describe('request method', () => {
    test('http 应默认使用 POST 方法', async () => {
      const result = await http('/success')
      expect(result).toMatchObject({ method: 'POST' })
    })
    test('post 应默认使用 POST 方法', async () => {
      const result = await post('/success')
      expect(result).toMatchObject({ method: 'POST' })
    })
    test('get 应默认使用 GET 方法', async () => {
      const result = await get('/success')
      expect(result).toMatchObject({ method: 'GET' })
    })
    test('put 应默认使用 PUT 方法', async () => {
      const result = await put('/success')
      expect(result).toMatchObject({ method: 'PUT' })
    })
    test('patch 应默认使用 PATCH 方法', async () => {
      const result = await patch('/success')
      expect(result).toMatchObject({ method: 'PATCH' })
    })
    test('del 应默认使用 DELETE 方法', async () => {
      const result = await del('/success')
      expect(result).toMatchObject({ method: 'DELETE' })
    })
  })
  describe('do request', () => {
    test('http should have promise method helpers', function () {
      const promise = http('/success')

      expect(typeof promise.then).toEqual('function')
      expect(typeof promise.catch).toEqual('function')
    })
    test('success', async () => {
      const result = await post('/success')
      // console.log(result)
      expect(result).toMatchObject({ method: 'POST', name: 'Terry' })
    })
    test('business error', async () => {
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
        expect(error.message).toBe('系统异常，请稍后重试')

        expect(handleException).toHaveBeenCalled()
        const exceptionParams = handleException.mock.calls.at(-1)
        expect(exceptionParams[0]).toBe('系统异常，请稍后重试')
        expect(exceptionParams[1]).toBe(EXCEPTION_BUSINESS)
      }
    })
    test('timeout', async () => {
      const promise = new Promise((resolve, reject) => {
        post('/long-time', undefined, { timeout: 200 })
          .then(resolve)
          .catch(error => reject(error))
      })
      try {
        await promise
      } catch (error) {
        // console.dir(error)
        expect(error.code).toBe('ECONNABORTED')
        expect(error.message).toBe('timeout of 200ms exceeded')
        expect(error.request?.isTimeout).toBeTruthy()

        expect(handleException).toHaveBeenCalled()
        const exceptionParams = handleException.mock.calls.at(-1)
        expect(exceptionParams[0]).toBe('数据请求超时，请稍后重试')
        expect(exceptionParams[1]).toBe(EXCEPTION_SYSTEM)
      }
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
    test('请求时手动指定身份令牌，应优先使用指定内容而不是 localStorage 中存储的内容', async () => {
      const result = await post('/success', undefined, {
        headers: {
          Authorization: 'Bearer custom-access-token'
        }
      })
      expect(result.headers.Authorization).toBe('Bearer custom-access-token')
    })
    test('custom header key to pass access token', async () => {
      const result = await post('/success')
      const headers = result.headers
      // 登录成功后，才会在头部添加该项目
      expect(Object.hasOwn(headers, 'Authorization')).toBeTruthy()
      // token 前缀
      expect(headers.Authorization.startsWith('Bearer')).toBeTruthy()
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
        expect(error.message).toBe('当前请求已被中断')
        expect(error.type).toBe(EXCEPTION_CANCELLED)
      }
    })
    test('access token 失效并刷新成功后，正确获得数据', async () => {
      const result = await post('/auth/access-token-invalid')

      expect(result.message).toBe('access token refresh and load data success.')
    })
    test('access token 失效并刷新失败，进入异常处理', async () => {
      resetTokenState()
      setRefreshTokenInvalid(true)

      try {
        await post('/auth/access-token-invalid')
      } catch (error) {
        expect(error.message).toBe('您的登录授权已失效')
        expect(error.type).toBe(EXCEPTION_AUTH_INVALID)

        const exceptionParams = handleException.mock.calls.at(-1)
        expect(exceptionParams[0]).toBe('您的登录授权已失效')
        expect(exceptionParams[1]).toBe(EXCEPTION_AUTH_INVALID)
      }
    })
    test('使用 access token 请求，响应 refresh token 失效', async () => {
      try {
        await post('/auth/access-token-and-refresh-token-invalid')
      } catch (error) {
        expect(error.message).toBe('您的登录授权已失效')
        expect(error.type).toBe(EXCEPTION_AUTH_INVALID)

        const exceptionParams = handleException.mock.calls.at(-1)
        expect(exceptionParams[0]).toBe('您的登录授权已失效')
        expect(exceptionParams[1]).toBe(EXCEPTION_AUTH_INVALID)
      }
    })
  })
})
