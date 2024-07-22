import axios from 'axios'

import {
  EXCEPTION_SYSTEM,
  EXCEPTION_BUSINESS,
  EXCEPTION_CANCELLED,
  EXCEPTION_AUTH_INVALID,
  STORAGE_KEY_REFRESH_TOKEN
} from './constants'
import { useResultHandle } from './results'
import {
  responseException,
  handleUrl,
  isAxiosTimeout,
  isAxiosNetworkError,
  isNoResponseBody,
  useStateCheck,
  getOptionKeys
} from './utils'
import { Exception } from './settings'
import { Cache } from './cache'

export function useExceptionHandle (options) {
  const { lang, exception: callback } = options
  /**
   * Catch and handle request cancelled situation
   *
   * @param {object} response
   */
  function handleCancelled (response) {
    if (axios.isCancel(response)) {
      // silently display request cancelled information in console
      console.warn(lang.message.cancelled)
      throw new Exception(lang.message.cancelled, EXCEPTION_CANCELLED)
    }
    // throw data object to next catch
    throw response
  }

  /**
   * Check if user authorization still valid
   *
   * @param {object} response
   */
  function handleAuthorization (response) {
    if (response instanceof Exception && response.isAuthInvalid()) {
      responseException(lang.message.authInvalid, callback, EXCEPTION_AUTH_INVALID)
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
  function handleBusinessError (response) {
    if (response instanceof Exception && response.isBusiness()) {
      responseException(
        response.message || lang.message.error,
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
  function handleSystemError (response) {
    // throw exception to user catch function directly
    if (response instanceof Exception) throw response
    // request timeout
    if (isAxiosTimeout(response)) {
      responseException(lang.message.timeout, callback)
      throw response
    }
    // low level network errors
    if (isAxiosNetworkError(response)) {
      responseException(lang.message.network, callback)
      throw response
    }
    // http original status
    const { status, statusText } = response.response
    if (status) {
      const i18nText = lang.status && Object.hasOwn(lang.status, status)
        ? lang.status[status]
        : statusText
      responseException(i18nText, callback)
      throw response
    }
    if (response instanceof Error) {
      responseException(response.message, callback)
      throw response
    }
    // rest of other exceptions
    responseException(lang.message.error, callback)
    throw response
  }

  return {
    handleCancelled,
    handleAuthorization,
    handleBusinessError,
    handleSystemError
  }
}

/**
 * Execute http request by options and settings
 *
 * @param {object} http - the Axios instance
 * @param {object} settings - the Axios settings
 * @param {object} options - Http plugin initialize options
 */
export function httpDataRequest (http, settings, options) {
  const { unpacking, handleResults } = useResultHandle(options)
  const {
    handleCancelled,
    handleAuthorization,
    handleBusinessError,
    handleSystemError
  } = useExceptionHandle(options)
  return http(settings)
    .then(response => unpacking(response))
    .then(data => handleResults(data))
    .catch(thrown => handleCancelled(thrown))
    .catch(thrown => handleAuthorization(thrown))
    .catch(thrown => handleBusinessError(thrown))
    .catch(thrown => handleSystemError(thrown))
}

/**
 * Execute refresh token api
 * @param {object} instance - axios instance
 * @param {object} options - http setting
 * @returns
 */
export function refreshAccessToken (instance, options) {
  const url = handleUrl(options.refreshUrl, options.baseUrl)
  const { lang } = options
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
      throw new Exception(lang.message.error, EXCEPTION_SYSTEM)
    }
    const { code } = resp.data
    const { isSuccess, isRefreshTokenInvalid } = useStateCheck(code, options)
    // request success, received the new access token
    if (isSuccess()) {
      return resp.data
    }
    // refresh token invalid
    if (isRefreshTokenInvalid()) {
      throw new Exception(lang.message.authInvalid, EXCEPTION_AUTH_INVALID)
    }
    // other cases
    throw new Exception(lang.message.error, EXCEPTION_SYSTEM)
  })
}
