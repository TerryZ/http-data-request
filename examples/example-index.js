import {
  http,
  get, post, put, patch, del,
  cancel, isSessionTimeout
} from './http'

const commonUrl = 'https://run.mocky.io/v3/4a7ae569-f190-4400-bd36-2d6593e74d63'
const commonData = {
  a: 1,
  b: 2
}

export function regularSuccess () {
  // console.log(typeof http)
  // http('https://www.mocky.io/v2/5ae5838e2e00005d003824ab', undefined, { method: 'put' })
  // this.$http('https://www.mocky.io/v2/5ae5838e2e00005d003824ab')
  http(commonUrl, undefined, { method: 'post' })
    .then(resp => {
      console.log('then method')
      console.log(resp)
    })
    .catch(resp => {
      console.log('catch-' + resp)
    })
}