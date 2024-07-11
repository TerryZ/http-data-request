import { message, exception } from './constants'

export default class Exception extends Error {
  constructor (msg = message.error, type = exception.business) {
    super(msg)

    this.type = type
  }

  isAuthInvalid () {
    return this.type === exception.authInvalid
  }

  isBusiness () {
    return this.type === exception.business
  }

  isCancelled () {
    return this.type === exception.cancelled
  }
}
