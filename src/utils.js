import { isAxiosError } from 'axios'

import {
  message,
  METHOD_GET,
  AXIOS_ERROR_CODE,
  KEY_HEADER_ACCESS_TOKEN,
  KEY_ACCESS_TOKEN,
  KEY_REFRESH_TOKEN,
  KEY_EXPIRES_IN,
  KEY_PARAM_REFRESH_TOKEN,
  EXCEPTION_SYSTEM,
  STATE_SUCCESS,
  STATE_INVALID_ACCESS_TOKEN,
  STATE_INVALID_REFRESH_TOKEN
} from './constants'

/**
 * Display exception message
 * @param {string} message - exception message
 * @param {function} callback - the way to display message
 * @param {number} type - message type
 */
export function responseException (message, callback, type = EXCEPTION_SYSTEM) {
  typeof callback === 'function'
    ? callback(message, type)
    : window.alert(message)
}

/**
 * Check if axios timeout error
 *
 * @example
 * {
 *   "message": "timeout of 1ms exceeded",
 *   "name": "Error",
 *   "stack": "Error: timeout of 1ms exceeded,...",
 *   "config": { ... }
 *   "code": "ECONNABORTED"
 * }
 *
 * @param {object} error
 * @returns {boolean}
 */
export function isAxiosTimeout (error) {
  return isAxiosError(error) &&
    error?.code === AXIOS_ERROR_CODE &&
    error.message.startsWith('timeout of')
}

// No response body
export function isNoResponseBody (data) {
  return !data || typeof data === 'undefined'
}

export function useStateCheck (code, options) {
  const success = options?.states?.success || STATE_SUCCESS
  const invalidAccessToken = options?.states?.invalidAccessToken || STATE_INVALID_ACCESS_TOKEN
  const invalidRefreshToken = options?.states?.invalidRefreshToken || STATE_INVALID_REFRESH_TOKEN

  return {
    /**
     * request success
     * server side return binary file stream, for example, file download
     * @returns {boolean}
     */
    isSuccess: () => typeof code === 'undefined' || code === success,
    isAccessTokenInvalid: () => code === invalidAccessToken,
    isRefreshTokenInvalid: () => code === invalidRefreshToken
  }
}

export function getOptionKeys (options) {
  return {
    header: options?.keys?.header || KEY_HEADER_ACCESS_TOKEN,
    accessToken: options?.keys?.accessToken || KEY_ACCESS_TOKEN,
    refreshToken: options?.keys?.refreshToken || KEY_REFRESH_TOKEN,
    expiresIn: options?.keys?.expiresIn || KEY_EXPIRES_IN,
    paramRefreshToken: options?.keys?.paramRefreshToken || KEY_PARAM_REFRESH_TOKEN
  }
}

/**
 * Check parameters and environment
 * @param {object} options
 */
export function checkEnvironment (url, options) {
  if (!url) {
    responseException(message.noUrl, options.exception)
    // return Promise.reject(message.noUrl)
    return message.noUrl
  }
  if (!window.navigator.onLine) {
    responseException(message.network, options.exception)
    // return Promise.reject(message.network)
    return message.network
  }
  // check ok
  return undefined
}

/**
 * Handle and marge url content
 *
 * @param {string} url
 * @param {string} baseUrl
 * @returns
 */
export function handleUrl (url, baseUrl) {
  if (!url) return ''
  // use `url` address directly when `url` content start with `http`(https)
  // and `baseUrl` parameter is not passed
  if (url.toLowerCase().startsWith('http') || !baseUrl) return url
  return baseUrl + url
}

/**
 * Convert minute to millisecond
 * @param {number} time(minute)
 */
export function timeConvert (time) {
  return time * 60 * 1000
}

/**
 * Generate an axios request setting
 *
 * @param {string} url
 * @param {object} data
 * @param {object} userSettings
 * @returns {object}
 */
export function buildSettings (url, data, userSettings) {
  const baseSettings = { method: 'post' }
  const requestSettings = { url, data: data || {} }
  const settings = Object.assign(baseSettings, userSettings, requestSettings)
  // change `data` field to `params` when method type is `GET`
  if (
    settings.method.toLowerCase() === METHOD_GET &&
    Object.keys(settings.data).length
  ) {
    settings.params = settings.data
    delete settings.data
  }

  return settings
}
