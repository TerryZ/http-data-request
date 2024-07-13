import { state, exception, message, method, AXIOS_ERROR_CODE } from './constants'

const { SUCCESS, INVALID_ACCESS_TOKEN, INVALID_REFRESH_TOKEN } = state

/**
 * Display exception message
 * @param {string} message - exception message
 * @param {function} callback - the way to display message
 * @param {number} type - message type
 */
export function displayMessage (message, callback, type = exception.system) {
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
  return 'code' in error &&
    error.code === AXIOS_ERROR_CODE &&
    error.message.includes('timeout')
}

// No response body
export function isNoResponseBody (data) {
  return !data || typeof data === 'undefined'
}

export function isSuccess (code) {
  // request success
  // server side return binary file stream, for example file download
  return typeof code === 'undefined' || code === SUCCESS
}

export function isAccessTokenInvalid (code) {
  return typeof code !== 'undefined' && code === INVALID_ACCESS_TOKEN
}

export function isRefreshTokenInvalid (code) {
  return typeof code !== 'undefined' && code === INVALID_REFRESH_TOKEN
}

/**
 * Check parameters and environment
 * @param {object} options
 */
export function checkEnvironment (url, options) {
  if (!url) {
    displayMessage(message.noUrl, options.exception)
    // return Promise.reject(message.noUrl)
    return message.noUrl
  }
  if (!window.navigator.onLine) {
    displayMessage(message.network, options.exception)
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
 * @export
 * @param {string} url
 * @param {object} data
 * @param {object} userSettings
 * @returns
 */
export function buildSettings (url, data, userSettings) {
  const settings = Object.assign({
    method: 'post'
  }, userSettings, {
    url,
    data: data || {}
  })
  // change `data` field to `params` when method type is `GET`
  if (
    settings.method.toLowerCase() === method.get &&
    Object.keys(settings.data).length
  ) {
    settings.params = settings.data
    delete settings.data
  }

  return settings
}

/**
 * Setup the functions need to export
 *
 * @param {object} instance - the HttpRequest instance
 * @returns {object} http methods and util set
 */
export function httpSetup (instance) {
  return {
    http: (...params) => instance.fetch.apply(instance, params),
    get: (...params) => instance.get.apply(instance, params),
    post: (...params) => instance.post.apply(instance, params),
    put: (...params) => instance.put.apply(instance, params),
    patch: (...params) => instance.patch.apply(instance, params),
    del: (...params) => instance.delete.apply(instance, params),
    cancel: () => instance.cancel(),
    isSessionTimeout: () => instance.isSessionTimeout()
  }
}
