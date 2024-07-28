
export declare type EXCEPTION_BUSINESS = 'exception-business'
export declare type EXCEPTION_AUTH_INVALID = 'exception-auth-invalid'
export declare type EXCEPTION_SYSTEM = 'exception-system'
export declare type EXCEPTION_CANCELLED = 'exception-cancelled'

export declare type EXCEPTION_TYPE = EXCEPTION_BUSINESS | EXCEPTION_AUTH_INVALID | EXCEPTION_SYSTEM

type LanguageType = 'en' | 'zh-chs'

export declare interface HttpDataRequestOptions {
  /**
   * Plugin language
   * @default `en`
   */
  language?: LanguageType
  /**
   * Base url path
   * @default `/`
   */
  baseUrl: string
  /**
   * The url used to refresh new access token
   * @default `/auth/refresh-token`
   */
  refreshUrl?: string
  /**
   * @default 0
   */
  expiresIn?: number
  /**
   * Specifies the number of milliseconds before the request times out
   * @default 10000
   */
  timeout?: number
  /**
   * Customize the key name of the data node
   */
  keys?: {
    /**
     * Access data node name
     * @default `access`
     */
    dataSet?: string
    /**
     * Access token property name
     * @default `accessToken`
     */
    accessToken?: string
    /**
     * Refresh token property name
     * @default `refreshToken`
     */
    refreshToken?: string
    /**
     * Token expires in property name
     * @default `expiresIn`
     */
    expiresIn?: string
    /**
     * The property name in the request body to pass refresh token
     * @default `refreshToken`
     */
    paramRefreshToken?: string
    /**
     * The property name of the request headers to pass access token
     * @default `x-http-request-access-token`
     */
    header?: string
  }
  /**
   * Customize the status code of the response
   */
  statuses?: {
    /**
     * Success status code
     * @default 0
     */
    success?: number
    /**
     * Access token invalid status code
     * @default 10
     */
    invalidAccessToken?: number
    /**
     * Refresh token invalid status code
     * @default 11
     */
    invalidRefreshToken?: number
  }
  /**
   * Request exception handle
   */
  exception?: (message: string, type: EXCEPTION_TYPE) => void
}
