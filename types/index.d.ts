import { AxiosRequestConfig } from 'axios'
import { HttpDataRequestOptions } from './type'

export * from './type'

/**
 * Data request
 * @param url request api address
 * @param data the data that send to server
 * @param options axios request options
 */
declare function HttpDataRequest(
  url: string,
  data?: any,
  options?: AxiosRequestConfig
): Promise<any>

interface HttpDataRequestMethods {
  http: typeof HttpDataRequest
  /**
   * Http request with get method
   */
  get: typeof HttpDataRequest
  /**
   * Http request with post method
   */
  post: typeof HttpDataRequest
  /**
   * Http request with put method
   */
  put: typeof HttpDataRequest
  /**
   * Http request with patch method
   */
  patch: typeof HttpDataRequest
  /**
   * Http request with delete method
   */
  del: typeof HttpDataRequest
  /**
   * Cancel all current request
   */
  cancel: () => void
  /**
   * Check if session timeout
   */
  isSessionTimeout: () => boolean
}

/**
 * Create customized data request methods for web projects
 * @param options
 */
export declare function useHttpDataRequest(options: HttpDataRequestOptions): HttpDataRequestMethods
