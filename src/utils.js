import { isAxiosError, AxiosError } from 'axios'

import {
  METHOD_GET,
  KEY_DATA_SET,
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
import { EN, languages } from './locale'

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
    error?.code === AxiosError.ECONNABORTED &&
    error.message.startsWith('timeout of')
}
export function isAxiosNetworkError (error) {
  return isAxiosError(error) &&
    error?.code === AxiosError.ERR_NETWORK
}

// No response body
export function isNoResponseBody (data) {
  return !data || typeof data === 'undefined'
}

export function useStateCheck (code, options) {
  const success = options?.statuses?.success || STATE_SUCCESS
  const invalidAccessToken = options?.statuses?.invalidAccessToken || STATE_INVALID_ACCESS_TOKEN
  const invalidRefreshToken = options?.statuses?.invalidRefreshToken || STATE_INVALID_REFRESH_TOKEN

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
    dataSet: options?.keys?.dataSet || KEY_DATA_SET,
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
  const { lang } = options
  if (!url) {
    responseException(lang.message.noUrl, options.exception)
    // return Promise.reject(message.noUrl)
    return lang.message.noUrl
  }
  if (!window.navigator.onLine) {
    responseException(lang.message.offline, options.exception)
    // return Promise.reject(message.offline)
    return lang.message.offline
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
/**
 * Get language resource by language code
 * @param {string} code - language code
 * @returns {object} language resource
 */
export function getLanguage (lang = EN) {
  const key = String(lang).toLowerCase()

  if (key in languages) return languages[key]

  return languages[EN]
}
