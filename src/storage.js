import {
  SESSION_TIMEOUT_UNLIMITED,
  STORAGE_KEY_ACCESS_TOKEN,
  STORAGE_KEY_LAST_TIME_REQUEST,
  STORAGE_KEY_REFRESH_TOKEN,
  STORAGE_KEY_REFRESH_TOKEN_EXPIRES
} from './constants'
import { getOptionKeys } from './utils'
import { Cache } from './cache'

/**
 * Storage user access token when exists
 *
 * @param {object} data
 * @param {object} options
 */
export function handleToken (data, options) {
  if (!data || !Object.keys(data).length) return

  const { dataSet, accessToken, refreshToken, expiresIn } = getOptionKeys(options)
  const access = data[dataSet]

  if (!access || !Object.keys(access).length) return

  if (Object.hasOwn(access, accessToken)) {
    Cache.set(STORAGE_KEY_ACCESS_TOKEN, access[accessToken])
  }
  if (Object.hasOwn(access, refreshToken)) {
    Cache.set(STORAGE_KEY_REFRESH_TOKEN, access[refreshToken])
  }
  if (Object.hasOwn(access, expiresIn)) {
    Cache.set(STORAGE_KEY_REFRESH_TOKEN_EXPIRES, access[expiresIn])
  }
}

/**
 * Record the time of last successful request
 */
export function updateLastTime () {
  Cache.set(STORAGE_KEY_LAST_TIME_REQUEST, new Date().getTime())
}

/**
 * Check if user authorization token is exists
 */
function haveToken () {
  const token = Cache.get(STORAGE_KEY_ACCESS_TOKEN)
  return Boolean(token)
}

/**
 * Check if user session times out
 * @param {number} sessionFreeTime(millisecond)
 */
export function isSessionTimeout (sessionFreeTime) {
  // always allow do http request
  if (sessionFreeTime === SESSION_TIMEOUT_UNLIMITED) return false
  // have not user authorization token
  if (!haveToken()) return true
  // first time authorized
  if (!Cache.have(STORAGE_KEY_LAST_TIME_REQUEST)) return false

  const lastTime = Cache.get(STORAGE_KEY_LAST_TIME_REQUEST)
  const gap = new Date().getTime() - lastTime
  return gap > sessionFreeTime
}
