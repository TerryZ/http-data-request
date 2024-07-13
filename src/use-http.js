import { prototype } from './settings'
import { isSessionTimeout as isSessionInvalid } from './storage'
import { execute } from './handle'
import { handleUrl, timeConvert, buildSettings, checkEnvironment } from './utils'
import { defaultOptions } from './constants'

export function useHttpDataRequest (setupOptions) {
  let cancelControl = new AbortController()
  const options = Object.assign({}, defaultOptions, setupOptions)
  // user authorization expires-in millisecond
  options.expiresInMillisecond = timeConvert(options.expiresIn)
  // axios instance
  const http = prototype(options, {
    getCancelControl,
    cancel
  })
  /**
   * Cancel controller factory
   */
  function getCancelControl () {
    console.log('get-cancel')
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
    // const { http, options } = this

    // check parameters, options and environment
    const result = checkEnvironment(url, options)
    if (result) {
      return Promise.reject(result)
    }

    const settings = buildSettings(handleUrl(url, options.baseUrl), data, userSettings)
    // settings.cancelToken = this.cancelTokenSource.token
    settings.signal = getCancelControl().signal

    return execute(http, settings, options)
  }
  /**
   * Cancel all of the requests
   */
  function cancel () {
    console.warn('cancel all requests')
    // this.cancelTokenSource.cancel()
    // generate a new cancel token source
    // this.cancelTokenSource = CancelToken.source()
    cancelControl.abort()

    // generate a new controller
    // cancelControl = new AbortController()
  }
  /**
   * Check if user authorization session timeout
   *
   * @returns {boolean}
   */
  function isSessionTimeout () {
    return isSessionInvalid(options.expiresInMillisecond)
  }
  function get (url, data, setting) {
    return fetch(url, data, { ...setting, method: 'GET' })
  }
  function post (url, data, setting) {
    return fetch(url, data, { ...setting, method: 'POST' })
  }
  function put (url, data, setting) {
    return fetch(url, data, { ...setting, method: 'PUT' })
  }
  function patch (url, data, setting) {
    return fetch(url, data, { ...setting, method: 'PATCH' })
  }
  function del (url, data, setting) {
    return fetch(url, data, { ...setting, method: 'DELETE' })
  }

  return {
    http: fetch,
    cancel,
    isSessionTimeout,
    get,
    post,
    put,
    patch,
    del
  }
}
