declare type HttpExceptionType = 'exception-business'
  | 'exception-auth-invalid'
  | 'exception-system'

/**
 * http 初始化设置参数模型
 */
declare interface HttpOptions {
  /**
   * 访问地址的基础前缀，若实际访问地址是以 http/https 开始，则使用实际地址，忽略前缀设定
   *
   * @default `/`
   */
  baseUrl: string
  /**
   * 执行刷新 refresh token 的 api 位置
   *
   * @default `/auth/refresh-token`
   */
  refreshUrl?: string
  /**
   * 执行刷新时传递 refresh token 使用的请求参数名
   *
   * @default `refreshToken`
   */
  paramRefreshToken?: string
  /**
   * 登录会话有效时长，单位为分钟
   *
   * @default 0
   */
  expiresIn?: number
  /**
   * 数据字段适配模型，用于适配服务器返回的数据字段，大多数情况下，应按照标准协议要求返
   * 回指定数据格式，但部分历史项目需要进行适配，此处提供了可兼容旧数据格式的方式
   *
   * @default `accessToken`
   */
  keyAccessToken?: string
  /**
   * 会话超时时间字段名
   *
   * @default `expiresIn`
   */
  keyExpiresIn?: string
  /**
   * 单次请求超时时间，单位：毫秒
   *
   * @default 20000
   */
  timeout?: number
  /**
   * 异常状态信息处理
   * 业务错误/用户登录授权失效/系统错误时的相关信息展示
   *
   * @param {string} message - 错误/异常信息内容
   * @param {number} type - 错误/异常类型
   */
  exception(
    message: string,
    type: HttpExceptionType
  ): void
}

/**
 * http 数据请求
 */
export module '@plugins-core/http' {
  /**
   * http 数据请求对象
   */
  export class Http {
    /**
     * 构造函数
     *
     * @param {HttpOptions} options - 插件初始化参数集
     * @constructor
     */
    constructor (options: HttpOptions): void
    /**
     * 执行 http 数据请求
     *
     * @param {string} url - 数据请求位置
     * @param {object=} data - 请求数据
     * @param {object=} userSettings - axios 原生请求设置参数
     *
     * @returns {function} a promise type function
     * @deprecated 该对象不再推荐使用，仅作为旧项目兼容
     */
    http (url: string, data?: object, userSettings?: object): Promise
    /**
     * 使用 get 方式执行 http 数据请求
     *
     * @param {string} url - 数据请求位置
     * @param {object=} data - 请求数据
     * @param {object=} userSettings - axios 原生请求设置参数
     *
     * @returns {function} a promise type function
     */
    get (url: string, data?: object, userSettings?: object): Promise
    /**
     * 使用 post 方式执行 http 数据请求
     *
     * @param {string} url - 数据请求位置
     * @param {object=} data - 请求数据
     * @param {object=} userSettings - axios 原生请求设置参数
     *
     * @returns {function} a promise type function
     */
    post (url: string, data?: object, userSettings?: object): Promise
    /**
     * 使用 put 方式执行 http 数据请求
     *
     * @param {string} url - 数据请求位置
     * @param {object=} data - 请求数据
     * @param {object=} userSettings - axios 原生请求设置参数
     *
     * @returns {function} a promise type function
     */
    put (url: string, data?: object, userSettings?: object): Promise
    /**
     * 使用 patch 方式执行 http 数据请求
     *
     * @param {string} url - 数据请求位置
     * @param {object=} data - 请求数据
     * @param {object=} userSettings - axios 原生请求设置参数
     *
     * @returns {function} a promise type function
     */
    patch (url: string, data?: object, userSettings?: object): Promise
    /**
     * 使用 delete 方式执行 http 数据请求
     *
     * @param {string} url - 数据请求位置
     * @param {object=} data - 请求数据
     * @param {object=} userSettings - axios 原生请求设置参数
     *
     * @returns {function} a promise type function
     */
    del (url: string, data?: object, userSettings?: object): Promise
    /**
     * 取消所有当前正在执行的请求
     */
    cancel (): void
    /**
     * 用户认证会话状态是否失效
     *
     * @returns {boolean}
     */
    isSessionTimeout (): void
  }
  /**
   * Setup the functions need to export
   *
   * @param {object} instance - HttpRequest 实例对象
   * @returns {object} http 函数集及工具集
   */
  export function httpSetup (instance: object): void
  /**
   * 业务异常状态
   */
  export const EXCEPTION_BUSINESS: HttpExceptionType
  /**
   * 用户身份认证状态失效
   */
  export const EXCEPTION_AUTH_INVALID: HttpExceptionType
  /**
   * 系统错误（底层服务异常）
   */
  export const EXCEPTION_SYSTEM: HttpExceptionType
}
