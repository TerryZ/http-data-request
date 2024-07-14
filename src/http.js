import { prototype } from './settings'
import { isSessionTimeout as isSessionInvalid } from './storage'
import { httpDataRequest } from './handle'
import { handleUrl, timeConvert, buildSettings, checkEnvironment } from './utils'
import { defaultOptions } from './constants'

export function useHttpDataRequest (setupOptions) {
  let cancelControl = new AbortController()
  const options = Object.assign({}, defaultOptions, setupOptions)
  // user authorization expires-in millisecond
  options.expiresInMillisecond = timeConvert(options.expiresIn)
  // create a new axios instance
  const http = prototype(options)
  /**
   * Cancel controller factory
   */
  function getCancelControl () {
    if (!cancelControl || cancelControl.signal.aborted) {
      cancelControl = new AbortController()
    }
    return cancelControl
  }
  /**
   * Execute http request
   *
   * @param {string} url - required
   * @param {object} data - optional
   * @param {object} userSettings - optional
   *
   * @returns {function} a promise type function
   */
  function fetch (url, data, userSettings) {
    // check parameters, options and environment
    const result = checkEnvironment(url, options)
    if (result) {
      return Promise.reject(result)
    }

    const settings = buildSettings(handleUrl(url, options.baseUrl), data, userSettings)
    settings.signal = getCancelControl().signal

    return httpDataRequest(http, settings, options)
  }
  /**
   * Cancel all of the requests
   */
  function cancel () {
    // console.warn('cancel all requests')
    cancelControl.abort()
  }
  /**
   * Check if user authorization session timeout
   *
   * @returns {boolean}
   */
  function isSessionTimeout () {
    return isSessionInvalid(options.expiresInMillisecond)
  }
  function fetchApplyMethod (originalArguments, method) {
    const [url, data, setting] = originalArguments
    return fetch(url, data, { ...setting, method })
  }

  return {
    http: fetch,
    cancel,
    isSessionTimeout,
    get: (...args) => fetchApplyMethod(args, 'GET'),
    post: (...args) => fetchApplyMethod(args, 'POST'),
    put: (...args) => fetchApplyMethod(args, 'PUT'),
    patch: (...args) => fetchApplyMethod(args, 'PATCH'),
    del: (...args) => fetchApplyMethod(args, 'DELETE')
  }
}
