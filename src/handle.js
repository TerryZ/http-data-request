import axios from 'axios'
import { key, message, statuses, exception } from './constants'
import { unpacking, handleResults } from './results'
import {
  displayMessage,
  handleUrl,
  isAxiosTimeout,
  isNoResponseBody,
  useStateCheck
} from './utils'
import { Exception } from './settings'
import { Cache } from './cache'

/**
 * Catch and handle request cancelled situation
 *
 * @param {object} response
 */
export function handleCancelled (response) {
  if (axios.isCancel(response)) {
    // silently display request cancelled information in console
    console.warn(message.cancelled)
    throw new Exception(message.cancelled, exception.cancelled)
  }
  // throw data object to next catch
  throw response
}

/**
 * Check if user authorization still valid
 *
 * @param {object} response
 * @param {function} callback
 */
export function handleAuthorization (response, callback) {
  if (response instanceof Exception && response.isAuthInvalid()) {
    displayMessage(
      message.authInvalid,
      callback,
      exception.authInvalid
    )
  }
  // throw data object to next catch
  throw response
}

/**
 * Handle business exception
 *
 * @param {object} response
 * @param {function} callback
 */
export function handleBusinessError (response, callback) {
  if (response instanceof Exception && response.isBusiness()) {
    displayMessage(
      response.message || message.error,
      callback,
      exception.business
    )
  }
  // throw data object to final catch
  throw response
}

/**
 * Handle http(axios) original error
 *
 * @param {object} response
 * @param {function} callback
 */
export function handleSystemError (response, callback) {
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
 * @param {object} settings - the Axios settings
 * @param {object} options - Http plugin initialize options
 */
export function httpDataRequest (http, settings, options) {
  return http(settings)
    // unpack axios wrapper
    .then(response => unpacking(response))
    .then(data => handleResults(data, options))
    .catch(thrown => handleCancelled(thrown))
    .catch(thrown => handleAuthorization(thrown, options.exception))
    .catch(thrown => handleBusinessError(thrown, options.exception))
    .catch(thrown => handleSystemError(thrown, options.exception))
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
    const { isSuccess, isRefreshTokenInvalid } = useStateCheck(code, options)
    // request success, received the new access token
    if (isSuccess()) {
      return resp.data
    }
    // refresh token invalid
    if (isRefreshTokenInvalid()) {
      throw new Exception(message.authInvalid, exception.authInvalid)
    }
    // other cases
    throw new Exception(message.error, exception.system)
  })
}
