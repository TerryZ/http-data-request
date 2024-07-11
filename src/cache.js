/**
 * Cache helper
 */
export class Cache {
  static instance () {
    return window.localStorage
  }

  static get (key) {
    if (!key) return null
    const result = this.instance().getItem(key)
    try {
      return JSON.parse(result)
    } catch (e) {
      const exception = ['NaN', 'undefined']
      return exception.some(val => val === result) ? null : result
    }
  }

  /**
   * Get the decoded data from storage
   *
   * @static
   * @param {string} key
   * @returns
   * @memberof Cache
   */
  static getDecoded (key) {
    return window.atob(this.get(key))
  }

  static set (key, value) {
    if (!key) return
    this.instance().setItem(key, JSON.stringify(value))
  }

  /**
   * Put the encoded(base64) data into storage
   *
   * @static
   * @param {string} key
   * @param {*} value
   * @memberof Cache
   */
  static setEncoded (key, value) {
    this.set(key, window.btoa(value))
  }

  static have (key) {
    if (!key) return false
    return key in this.instance()
  }

  /**
   * remove item by key
   * @param key
   */
  static remove (key) {
    if (!key) return
    this.instance().removeItem(key)
  }

  /**
   * clear all items form the current site
   */
  static clear () {
    this.instance().clear()
  }
}
