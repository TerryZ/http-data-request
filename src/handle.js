import axios from 'axios'
import { key, message, statuses, exception } from './constants'
import { unpacking, handleResults } from './results'
import { isAxiosTimeout, displayMessage, handleUrl, isNoResponseBody, isSuccess, isRefreshTokenInvalid } from './utils'
import Exception from './exception'
import { Storage } from '@utils-core/main'

const { Cache } = Storage

/**
 * Catch and handle request cancelled situation
 *
 * @param {object} response
 */
export function cancelled (response) {
  if (axios.isCancel(response)) {
    // silently display request cancelled infomation in console
    console.error(message.cancelled)
    throw new Exception(message.cancelled, exception.cancelled)
  }
  // throw data object to next catch
  throw response
}

/**
 * Check if user authorization still valid
 *
 * @export
 * @param {object} response
 * @param {function} callback
 */
export function verifyAuthorization (response, callback) {
  if (response instanceof Exception && response.isAuthInvalid()) {
    displayMessage(message.authInvalid, callback, exception.authInvalid)
  }
  // throw data object to next catch
  throw response
}

/**
 * Handle business exception
 *
 * @export
 * @param {object} response
 * @param {function} callback
 */
export function businessError (response, callback) {
  if (response instanceof Exception && response.isBusiness()) {
    displayMessage(response.message || message.error, callback, exception.business)
  }
  // throw data object to final catch
  throw response
}

/**
 * Handle http(axios) original error
 *
 * @export
 * @param {object} response
 * @param {function} callback
 */
export function systemError (response, callback) {
  // throw exception to user catch function directly
  if (response instanceof Exception) throw response

  // http original status
  const { status } = response.response
  // Network error
  if (!status) {
    displayMessage(message.noStatus, callback)
    throw response
  }
  if (typeof status === 'number' && status in statuses) {
    displayMessage(statuses[status], callback)
    throw response
  }

  if (response instanceof Error) {
    const msg = isAxiosTimeout(response) ? message.timeout : response.message
    displayMessage(msg, callback)
    throw response
  }

  displayMessage(message.error, callback)
  throw response
}

/**
 * Execute http request by options and settings
 *
 * @param {object} http - the Axios instance
 * @param {object} options - Http plugin initialize options
 * @param {object} settings - the Axios settings
 */
export function execute (http, options, settings) {
  return http(settings)
    // unpack axios wrapper
    .then(response => unpacking(response))
    // return the data to caller when request success
    .then(result => handleResults(result, options))
    .catch(thrown => cancelled(thrown))
    .catch(thrown => verifyAuthorization(thrown, options.exception))
    .catch(thrown => businessError(thrown, options.exception))
    .catch(thrown => systemError(thrown, options.exception))
}

/**
 * Execute refresh token api
 * @param {object} instance - axios instance
 * @param {object} options - http setting
 * @returns
 */
export function refreshAccessToken (instance, options) {
  const url = handleUrl(options.refreshUrl, options.baseUrl)
  const setting = {
    method: 'post',
    url,
    data: {
      [options.paramRefreshToken]: Cache.get(key.refreshToken)
    }
  }
  return instance(setting).then(resp => {
    // no response body
    if (isNoResponseBody(resp.data)) {
      throw new Exception(message.error, exception.system)
    }
    const { code } = resp.data
    // request success, received the new access token
    if (isSuccess(code)) {
      return resp.data
    }
    // refresh token invalid
    if (isRefreshTokenInvalid(code)) {
      throw new Exception(message.authInvalid, exception.authInvalid)
    }
    // other cases
    throw new Exception(message.error, exception.system)
  })
}
