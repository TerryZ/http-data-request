import { SESSION_TIMEOUT_UNLIMITED, key } from './constants'
import { Cache } from './cache'

/**
 * Storage user access token when exists
 *
 * @param {object} data
 * @param {object} options
 */
export function handleToken (data, options) {
  if (!data || !Object.keys(data).length) return

  const { access } = data

  if (!access || !Object.keys(access).length) return

  if (Object.hasOwn(access, options.keyAccessToken)) {
    Cache.set(key.token, access[options.keyAccessToken])
  }
  if (Object.hasOwn(access, 'refreshToken')) {
    Cache.set(key.refreshToken, access.refreshToken)
  }
  if (Object.hasOwn(access, options.keyExpiresIn)) {
    Cache.set(key.refreshExpires, access[options.keyExpiresIn])
  }
}

/**
 * Record the time of last successful request
 */
export function updateLastTime () {
  Cache.set(key.lastTimeRequest, new Date().getTime())
}

/**
 * Check if user authorization token is exists
 */
function haveToken () {
  const token = Cache.get(key.token)
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
  if (!Cache.have(key.lastTimeRequest)) return false

  const lastTime = Cache.get(key.lastTimeRequest)
  const gap = new Date().getTime() - lastTime
  return gap > sessionFreeTime
}
