import axios from 'axios'
import { key, HEADER_ACCESS_TOKEN } from './constants'
import { handleToken } from './storage'
import { refreshAccessToken } from './handle'
import { isAccessTokenInvalid } from './utils'
import { Cache } from './cache'

export function prototype (options) {
  let isRefreshing = false
  let waitingQueue = []

  const handleQueue = function (error) {
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
  // if(!ie9) axios.defaults.baseURL = config.baseUrl;
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
      return config
    },
    error => Promise.reject(error)
  )
  /**
   * response interceptors
   */
  http.interceptors.response.use(
    response => {
      const originalRequest = response.config
      const { data: { code } } = response

      // only handle access token invalid and need to refresh situation below
      if (!isAccessTokenInvalid(code)) return response

      if (!isRefreshing) {
        isRefreshing = true

        return refreshAccessToken(http, options)
          .then(resp => {
            // update access token
            handleToken(resp.data, options)
            handleQueue()
            // request again with new access token and return to caller
            return http(originalRequest)
          })
          .catch(error => {
            handleQueue(error)
            return Promise.reject(error)
          })
          .finally(() => {
            isRefreshing = false
          })
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
    error => Promise.reject(error)
  )

  return http
}

export const CancelToken = axios.CancelToken
