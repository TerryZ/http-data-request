export default {
  /**
   * http 原生状态码本地化
   *
   * 1xx：消息
   * 2xx：成功
   * 3xx：重定向
   * 4xx：请求错误
   * 5xx：服务器错误
   */
  status: {
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
  },
  message: {
    error: '系统异常，请稍后重试',
    authInvalid: '您的登录授权已失效',
    cancelled: '当前请求已被中断',
    timeout: '数据请求超时，请稍后重试',
    offline: '网络连接中断，请检查上行链路连接或联系网络供应商解决',
    network: '网络错误，请稍后重试',
    noUrl: '未指定数据请求位置'
    // noStatus: '数据加载失败，请稍后重试'
  }
}
