// import { handleSuccess } from './handle'
import { message, exception } from './constants'
import { Exception } from './settings'
import { handleToken, updateLastTime } from './storage'
import { isNoResponseBody, useStateCheck } from './utils'

/**
 * Handle successful request
 *
 * @param {object} result
 * @param {object} options
 * @returns
 */
export function handleSuccess (result, options) {
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
 * @private
 * @param {string} message - error messages
 */
function fail (message) {
  throw new Exception(message)
}

/**
 * User token invalid, need to go to login
 *
 * @private
 */
function authInvalid () {
  throw new Exception(message.authInvalid, exception.authInvalid)
}

/**
 * Remove axios response body and return data
 *
 * @param {object} response
 * @returns
 */
export function unpacking (response) {
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
 * @export
 * @param {object} data
 * @param {object} options
 */
export function handleResults (data, options) {
  // No response body
  if (isNoResponseBody(data)) fail()

  const { code } = data
  const { isSuccess, isRefreshTokenInvalid } = useStateCheck(code, options)
  // request success
  // server side return binary file stream, for example, file download
  if (isSuccess()) return handleSuccess(data, options)
  // if (isAccessTokenInvalid(code)) {}
  // user authorization invalid, need to go to login
  if (isRefreshTokenInvalid()) authInvalid()

  // business execution error
  // all remaining situation
  fail(data && data.msg)
}
