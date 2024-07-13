import axios from 'axios'

import { key, HEADER_ACCESS_TOKEN } from './constants'
import { handleToken } from './storage'
import { refreshAccessToken } from './handle'
import { isAccessTokenInvalid } from './utils'
import { Cache } from './cache'

export function prototype (options, canceller) {
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
      // config.signal = canceller.getCancelControl().signal
      return config
    },
    error => Promise.reject(error)
  )
  /**
   * response interceptors
   */
  http.interceptors.response.use(
    async response => { // Any status code from range of 2xx
      const originalRequest = response.config
      const { data: { code } } = response
      // success and business exception
      if (!isAccessTokenInvalid(code)) return response
      console.log('isRefreshing:', isRefreshing)
      /**
       * Authorization failed
       * only handle access token invalid and need to refresh situation below
       */
      if (!isRefreshing) {
        isRefreshing = true
        // let errorResult
        console.log(originalRequest.data)

        try {
          const resp = await refreshAccessToken(http, options)
          // update access token
          handleToken(resp.data, options)
          // retry original request
          return await http(originalRequest)
        } catch (error) {
          console.log('waitingQueue length:', waitingQueue.length)
          // errorResult = error
          // canceller.cancel()
          return Promise.reject(error)
        } finally {
          isRefreshing = false
          handleQueue()
        }

        // return refreshAccessToken(http, options)
        //   .then(resp => {
        //     // update access token
        //     handleToken(resp.data, options)
        //     // handleQueue()
        //     // request again with new access token and return to caller
        //     return http(originalRequest).then(data => {
        //       // handleQueue()
        //       return data
        //     })
        //   })
        //   .catch(error => {
        //     // handleQueue(error)
        //     console.log('waitingQueue length:', waitingQueue.length)
        //     errorResult = error
        //     return Promise.reject(error)
        //   })
        //   // .catch(error => {
        //   //   handleQueue(error)
        //   //   return Promise.reject(error)
        //   // })
        //   .finally(() => {
        //     isRefreshing = false
        //     handleQueue(errorResult)
        //   })
      } else {
        // other requests put into waiting queue when refresh work in execution
        return new Promise((resolve, reject) => {
          waitingQueue.push(error => {
            // console.log('signal aborted:', originalRequest.signal.aborted)
            // console.log('queue', error)
            if (error) {
              reject(error)
            } else {
              resolve(http(originalRequest))
            }
          })
        })
      }
    },
    error => { // Any status codes outside range of 2xx
      console.log(error)
      return Promise.reject(error)
    }
  )

  return http
}

export const CancelToken = axios.CancelToken
