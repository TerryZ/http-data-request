import { prototype } from './settings'
import { isSessionTimeout } from './storage'
import { execute } from './handle'
import { handleUrl, timeConvert, buildSettings, checkEnvironment } from './utils'
import { defaultOptions, method } from './constants'

/**
 * http data request
 */
class Http {
  /**
   * Creates an instance of Http
   *
   * @param {object} options - plugin config options
   *
   * {
   *   # 访问地址的基础前缀，若实际访问地址是以 http/https 开始，则使用实际地址，忽略前缀设定
   *   baseUrl: string,
   *   # 执行刷新 refresh token 的 api 位置
   *   refreshUrl: string,
   *   # 执行刷新时传递 refresh token 使用的请求参数名，默认 `refreshToken`
   *   paramRefreshToken: string,
   *
   *   # 登录会话有效时长，单位为分钟
   *   # default: 0
   *   expiresIn: number,
   *
   *   # 数据字段适配模型，用于适配服务器返回的数据字段，大多数情况下，应要求服务器按前端要求返
   *   # 回指定数据格式，但部分历史项目需要进行适配，此处提供了可兼容旧数据格式的方式
   *   # default: 'accessToken'
   *   keyAccessToken: string,
   *   # default: 'expiresIn'
   *   keyExpiresIn: string,
   *
   *   # 单次请求超时时长，单位为毫秒，
   *   # default: 20000
   *   timeout: number,
   *
   *   # 业务错误/用户登录授权失效/系统错误时的相关信息展示
   *   # message {string} 异常信息文本
   *   # type    {string} 异常类型（常量）
   *   exception: function (message, type) {}
   * }
   *
   * @see constants.js defaultOptions content
   * @constructor
   * @memberof Http
   */
  constructor (options) {
    this.options = Object.assign({}, defaultOptions, options)
    // user authorization expires-in millisecond
    this.options.expiresInMillisecond = timeConvert(this.options.expiresIn)
    // axios instance
    this.http = prototype(this.options)
    // axios cancel token object
    // this.cancelTokenSource = CancelToken.source()
    this.cancelControl = new AbortController()
  }

  /**
   * Execute http request
   *
   * @param {string} url - required
   * @param {object} data - optional
   * @param {object} userSettings - optional
   *
   * @returns {function} a promise type function
   * @memberof Http
   */
  fetch (url, data, userSettings) {
    const { http, options } = this

    // check parameters, options and environment
    const result = checkEnvironment(url, options)
    if (result) {
      return Promise.reject(result)
    }

    const settings = buildSettings(handleUrl(url, options.baseUrl), data, userSettings)
    // settings.cancelToken = this.cancelTokenSource.token
    settings.signal = this.cancelControl.signal

    return execute(http, options, settings)
  }

  /**
   * Cancel all of the requests
   *
   * @memberof Http
   */
  cancel () {
    // this.cancelTokenSource.cancel()
    // generate a new cancel token source
    // this.cancelTokenSource = CancelToken.source()
    this.cancelControl.abort()
    this.cancelControl = new AbortController()
  }

  /**
   * Check if user authorization session timeout
   *
   * @returns {boolean}
   * @memberof Http
   */
  isSessionTimeout () {
    return isSessionTimeout(this.options.expiresInMillisecond)
  }
}

/**
 * Generate http methods(get, post, put, patch, delete) function in Http
 * class, and the function will setup the `method` attribute to the same
 * with function name by force
 *
 * @returns object(Promise)
 * @memberof Http
 */
Object.values(method).forEach(type => {
  Http.prototype[type] = function (url, data, userSettings) {
    const setting = { ...userSettings, method: type }
    return this.fetch(url, data, setting)
  }
})

export default Http
