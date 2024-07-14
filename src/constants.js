/**
 * http 原生状态码本地化
 *
 * 1xx：消息
 * 2xx：成功
 * 3xx：重定向
 * 4xx：请求错误
 * 5xx：服务器错误
 */
export const statuses = {
  300: '多种选择',
  301: '永久移动',
  302: '临时移动',
  303: '查看其他位置',
  304: '未修改',
  305: '使用代理',
  306: '(未使用)',
  307: '临时重定向',
  308: '永久重定向',
  400: '错误请求',
  401: '无权限',
  402: '需要付款',
  403: '禁止访问',
  404: '未找到',
  405: '不允许使用该请求方法',
  406: '无法接受',
  407: '要求代理身份验证',
  408: '请求超时',
  409: '冲突',
  410: '已失效',
  411: '需要内容长度头',
  412: '预处理失败',
  413: '请求实体过长',
  414: '请求网址过长',
  415: '媒体类型不支持',
  416: '请求范围不合要求',
  417: '预期结果失败',
  418: '我是一个茶壶',
  421: '被误导的请求',
  422: '无法处理的实体',
  423: '锁定',
  424: '失败的依赖',
  425: '太早',
  426: '升级所需',
  428: '要求先决条件',
  429: '太多请求',
  431: '请求头字段太大',
  451: '因法律原因无法使用',
  500: '服务器内部错误',
  501: '未实现',
  502: '网关错误',
  503: '服务不可用',
  504: '网关超时',
  505: 'HTTP版本不受支持',
  506: '变体也进行协商',
  507: '存储空间不足',
  508: '检测到环路',
  509: '超出带宽限制',
  510: '扩展错误',
  511: '网络需要身份验证'
}

export const message = {
  error: '系统异常，请联系管理员！',
  authInvalid: '您的登录授权已失效！',
  cancelled: '当前请求已被中断！',
  timeout: '数据请求超时，请稍后重试……',
  network: '网络连接中断，请检查上行链路连接或联系网络供应商解决!',
  noUrl: '未指定数据请求位置',
  noStatus: '数据加载失败，请联系管理员！'
}

/**
 * Built-in State codes
 *
 * 0: success
 * 10: the access token is invalid., need to use refresh token to refresh
 * 11: the refresh token is invalid, need go to login
 *
 * rest of other codes are business exceptions
 */
export const state = {
  SUCCESS: 0,
  INVALID_ACCESS_TOKEN: 10,
  INVALID_REFRESH_TOKEN: 11
}

/**
 * The key name stored in Storage
 */
export const key = {
  token: 'auth-access-token',
  tokenExpires: 'auth-access-token-expires',
  lastTimeRequest: 'auth-last-time-request',
  refreshToken: 'auth-refresh-token',
  refreshExpires: 'auth-refresh-token-expires'
}

/**
 * Request method types
 */
export const method = {
  get: 'get',
  post: 'post',
  put: 'put',
  patch: 'patch',
  delete: 'delete'
}

/**
 * Exception types
 */
export const exception = {
  business: 'exception-business',
  authInvalid: 'exception-auth-invalid',
  system: 'exception-system',
  cancelled: 'exception-cancelled'
}

/**
 * Default options
 */
export const defaultOptions = {
  baseUrl: '/',
  // 执行刷新 refresh token 的 api 位置
  refreshUrl: '/auth/refresh-token',
  // 执行刷新时传递 refresh token 使用的请求参数名
  paramRefreshToken: 'refreshToken',
  // 会话默认允许空闲时长，单位：分钟
  expiresIn: 0,
  keyAccessToken: 'accessToken',
  keyExpiresIn: 'expiresIn',
  // 单次请求超时时间，单位：毫秒
  timeout: 20000,
  states: {
    success: state.SUCCESS,
    invalidAccessToken: state.INVALID_ACCESS_TOKEN,
    invalidRefreshToken: state.INVALID_REFRESH_TOKEN
  },
  exception: function (message, type) {
    window.alert(message)
  }
}

// 会话时长无限制
export const SESSION_TIMEOUT_UNLIMITED = 0
// axios 内部抛出异常的识别代码
export const AXIOS_ERROR_CODE = 'ECONNABORTED'
// 在数据请求头部用于传递 access token 数据的字段名
export const HEADER_ACCESS_TOKEN = 'http-request-access-token'
