import axios from 'axios'

import { key, HEADER_ACCESS_TOKEN, message, exception } from './constants'
import { handleToken } from './storage'
import { useStateCheck } from './utils'
import { refreshAccessToken } from './handle'
import { Cache } from './cache'

export function prototype (options) {
  // refreshing access token
  let isRefreshing = false
  let waitingQueue = []

  const handleQueue = error => {
    waitingQueue.forEach(request => request(error))
    waitingQueue = []
  }

  const http = axios.create()

  /**
   * config default options
   */
  http.defaults.headers = {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json; charset=UTF-8'
    // 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
  }

  /**
   * the timeout option in axios is response timeout, not connection timeout
   */
  http.defaults.timeout = options.timeout
  http.defaults.withCredentials = false

  /**
   * request interceptors
   */
  http.interceptors.request.use(
    config => {
      // put user authorization access token in to the header
      const token = Cache.get(key.token)
      if (token) {
        config.headers[HEADER_ACCESS_TOKEN] = token
      }
      // console.log(config)
      return config
    },
    error => Promise.reject(error)
  )
  /**
   * response interceptors
   */
  http.interceptors.response.use(
    // Any status code from range of 2xx
    async response => {
      const originalRequest = response.config
      const { isAccessTokenInvalid } = useStateCheck(response?.data?.code, options)
      // success and business exception
      if (!isAccessTokenInvalid()) return response
      /**
       * Authorization failed
       * only handle access token invalid and need to refresh situation below
       */
      if (!isRefreshing) {
        isRefreshing = true

        try {
          const resp = await refreshAccessToken(http, options)
          // update the access token in storage
          handleToken(resp.data, options)
          // retry original request
          return await http(originalRequest)
        } catch (error) {
          return Promise.reject(error)
        } finally {
          isRefreshing = false
          handleQueue()
        }
      } else {
        // other requests put into waiting queue when refresh work in execution
        return new Promise((resolve, reject) => {
          waitingQueue.push(error => {
            if (error) {
              reject(error)
            } else {
              resolve(http(originalRequest))
            }
          })
        })
      }
    },
    // Any status codes outside range of 2xx
    error => Promise.reject(error)
  )

  return http
}

export class Exception extends Error {
  constructor (msg = message.error, type = exception.business) {
    super(msg)

    this.type = type
  }

  isAuthInvalid () {
    return this.type === exception.authInvalid
  }

  isBusiness () {
    return this.type === exception.business
  }

  isCancelled () {
    return this.type === exception.cancelled
  }
}
