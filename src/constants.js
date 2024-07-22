import { EN } from './locale'

/**
 * Built-in State codes
 *
 * 0: success
 * 10: the access token is invalid., need to use refresh token to refresh
 * 11: the refresh token is invalid, need go to login
 *
 * rest of other codes are business exceptions
 */
export const STATE_SUCCESS = 0
export const STATE_INVALID_ACCESS_TOKEN = 10
export const STATE_INVALID_REFRESH_TOKEN = 11
/**
 * The key name stored in Storage
 */
export const STORAGE_KEY_ACCESS_TOKEN = 'auth-access-token'
export const STORAGE_KEY_ACCESS_TOKEN_EXPIRES = 'auth-access-token-expires'
export const STORAGE_KEY_REFRESH_TOKEN = 'auth-refresh-token'
export const STORAGE_KEY_REFRESH_TOKEN_EXPIRES = 'auth-refresh-token-expires'
export const STORAGE_KEY_LAST_TIME_REQUEST = 'auth-last-time-request'

export const SESSION_TIMEOUT_UNLIMITED = 0
// the key name in the data request header used to pass access token data
export const KEY_HEADER_ACCESS_TOKEN = 'x-http-request-access-token'
export const KEY_ACCESS_TOKEN = 'accessToken'
export const KEY_REFRESH_TOKEN = 'refreshToken'
export const KEY_EXPIRES_IN = 'expiresIn'
export const KEY_PARAM_REFRESH_TOKEN = 'refreshToken'
/**
 * Exception types
 */
export const EXCEPTION_BUSINESS = 'exception-business'
export const EXCEPTION_AUTH_INVALID = 'exception-auth-invalid'
export const EXCEPTION_SYSTEM = 'exception-system'
export const EXCEPTION_CANCELLED = 'exception-cancelled'
/**
 * Request method types
 */
export const [
  METHOD_GET, METHOD_POST, METHOD_PUT, METHOD_PATCH, METHOD_DELETE
] = ['get', 'post', 'put', 'patch', 'delete']

/**
 * Http data request default options
 */
export const defaultOptions = {
  language: EN,
  baseUrl: '/',
  // the url used to refresh new access token
  refreshUrl: '/auth/refresh-token',
  // 会话默认允许空闲时长，单位：分钟
  expiresIn: 0,
  timeout: 20000,
  keys: {
    accessToken: KEY_ACCESS_TOKEN,
    refreshToken: KEY_REFRESH_TOKEN,
    expiresIn: KEY_EXPIRES_IN,
    // 执行刷新时传递 refresh token 使用的请求参数名
    paramRefreshToken: KEY_PARAM_REFRESH_TOKEN,
    header: KEY_HEADER_ACCESS_TOKEN
  },
  states: {
    success: STATE_SUCCESS,
    invalidAccessToken: STATE_INVALID_ACCESS_TOKEN,
    invalidRefreshToken: STATE_INVALID_REFRESH_TOKEN
  },
  exception: (message, type) => window.alert(message)
}
