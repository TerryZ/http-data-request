// import { handleSuccess } from './handle'
import { EXCEPTION_AUTH_INVALID } from './constants'
import { Exception } from './settings'
import { handleToken, updateLastTime } from './storage'
import { isNoResponseBody, useStateCheck } from './utils'

export function useResultHandle (options) {
  const { lang } = options
  /**
   * Handle successful request
   *
   * @param {object} result
   * @returns
   */
  function success (result) {
    // update the time of success request
    updateLastTime()

    const { data } = result
    if (!data || typeof data === 'undefined') return result
    // save user authorization token into Storage when exists
    handleToken(data, options)
    return data
  }
  /**
   * Handle system error, business error, unexpected error
   *
   * @param {string} message - error messages
   */
  function fail (message) {
    throw new Exception(message)
  }
  /**
   * User token invalid, need to go to login
   */
  function authInvalid () {
    throw new Exception(lang.message.authInvalid, EXCEPTION_AUTH_INVALID)
  }
  /**
   * Remove axios response body and return data
   *
   * @param {object} response
   * @returns
   */
  function unpacking (response) {
    // unpack axios wrapper
    // console.log(response)
    return typeof response === 'object' ? response.data : response
  }
  /**
   * Http response business body handle
   *
   * body format:
   * {
   *   code: number,
   *   msg: string,
   *   data: object
   * }
   *
   * @param {object} data
   */
  function handleResults (data) {
  // No response body
    if (isNoResponseBody(data)) fail()

    const { code } = data
    const { isSuccess, isRefreshTokenInvalid } = useStateCheck(code, options)
    // request success
    // server side return binary file stream, for example, file download
    if (isSuccess()) return success(data)
    // if (isAccessTokenInvalid(code)) {}
    // user authorization invalid, need to go to login
    if (isRefreshTokenInvalid()) authInvalid()

    // business execution error
    // all remaining situation
    fail(data && data.msg)
  }

  return {
    unpacking,
    handleResults
  }
}
