import axios from 'axios'

import {
  message,
  statuses,
  EXCEPTION_SYSTEM,
  EXCEPTION_BUSINESS,
  EXCEPTION_CANCELLED,
  EXCEPTION_AUTH_INVALID,
  STORAGE_KEY_REFRESH_TOKEN
} from './constants'
import { unpacking, handleResults } from './results'
import {
  responseException,
  handleUrl,
  isAxiosTimeout,
  isNoResponseBody,
  useStateCheck,
  getOptionKeys
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
    throw new Exception(message.cancelled, EXCEPTION_CANCELLED)
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
    responseException(message.authInvalid, callback, EXCEPTION_AUTH_INVALID)
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
    responseException(
      response.message || message.error,
      callback,
      EXCEPTION_BUSINESS
    )
  }
  // throw data object to final catch
  throw response
}

/**
 * Handle http/axios original exception
 *
 * @param {object} response
 * @param {function} callback
 */
export function handleSystemError (response, callback) {
  // throw exception to user catch function directly
  if (response instanceof Exception) throw response
  // request timeout
  if (isAxiosTimeout(response)) {
    responseException(message.timeout, callback)
    throw response
  }

  // http original status
  const { status } = response.response
  // `Network error` exception
  if (!status) {
    responseException(message.noStatus, callback)
    throw response
  }
  if (Object.hasOwn(statuses, status)) {
    responseException(statuses[status], callback)
    throw response
  }
  if (response instanceof Error) {
    responseException(response.message, callback)
    throw response
  }
  // rest of other exceptions
  responseException(message.error, callback)
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
  const { paramRefreshToken } = getOptionKeys(options)
  const setting = {
    method: 'post',
    url,
    data: {
      [paramRefreshToken]: Cache.get(STORAGE_KEY_REFRESH_TOKEN)
    }
  }
  return instance(setting).then(resp => {
    // no response body
    if (isNoResponseBody(resp.data)) {
      throw new Exception(message.error, EXCEPTION_SYSTEM)
    }
    const { code } = resp.data
    const { isSuccess, isRefreshTokenInvalid } = useStateCheck(code, options)
    // request success, received the new access token
    if (isSuccess()) {
      return resp.data
    }
    // refresh token invalid
    if (isRefreshTokenInvalid()) {
      throw new Exception(message.authInvalid, EXCEPTION_AUTH_INVALID)
    }
    // other cases
    throw new Exception(message.error, EXCEPTION_SYSTEM)
  })
}
