import { ref } from 'vue'
// import sinon from 'sinon'

import {
  http,
  get, post, put, patch, del,
  cancel, isSessionTimeout
} from './http'
import { Cache } from '@/cache'
// import { baseUrl } from './mock'

// const server = sinon.fakeServer.create()

const commonUrl = 'https://run.mocky.io/v3/4a7ae569-f190-4400-bd36-2d6593e74d63'
const commonData = {
  a: 1,
  b: 2
}

export const loading = ref(false)

export function regularSuccess () {
  // console.log(typeof http)
  // http('https://www.mocky.io/v2/5ae5838e2e00005d003824ab', undefined, { method: 'put' })
  // this.$http('https://www.mocky.io/v2/5ae5838e2e00005d003824ab')
  http(commonUrl)
    .then(resp => {
      console.log('then method')
      console.log(resp)
    })
    .catch(resp => {
      console.log('catch-' + resp)
    })
}
export function businessError () {
  http('/http/business-error')
    .then(resp => console.log('then-' + resp))
    .catch(resp => {
      console.log(typeof resp)
      console.dir(resp)
      console.log('catch-' + resp)
    })
}
export function regularTimeout () {
  http('https://run.mocky.io/v3/ae6bfd54-0c42-4437-8eca-a9c8aa235e6a')
    .then(resp => console.log('then-' + resp))
    .catch(resp => {
      console.log(typeof resp)
      console.log('catch-' + resp)
    })
}
export function longTimeRequest () {
  // baseUrl + '/http/request-long-time'
  const url = commonUrl + '?mocky-delay=10s'
  // const url = '/long-time'

  post(url, undefined, {
    timeout: 100
  })
    .then(resp => console.log(resp))
    .catch(resp => {
      console.log(typeof resp)
      console.log('catch-' + resp)
    })
}
export function successWithAccess () {
  http('/login-success-with-access-token')
    .then(resp => {
      console.log(resp)
    })
}
export function successWithCustomAccess () {
  http('https://run.mocky.io/v3/5628ccfe-141b-4241-ade5-14d89c67411e')
    .then(resp => {})
}
export function error500 () {
  // 'https://run.mocky.io/v3/6ce6b422-e3e3-4d8b-a204-65c92ea096a2'
  post('/500-error')
    .then(resp => {})
    .catch(error => {
      console.log(error)
    })
}
export function doCancel () {
  loading.value = true
  // commonUrl + '?mocky-delay=10s'
  http('/long-time')
    .then(data => {
      console.log('request success!')
      console.log(data)
    })
    .catch(error => {
      console.dir(error)
    })
    .finally(() => {
      loading.value = false
    })

  setTimeout(cancel, 3000)
}
export function cleanStorage () {
  Cache.clear()
}
export function generateToken () {
  // Cache.set(key.token, Random.word(50, 80))
  // Cache.set(key.refreshToken, Random.word(50, 80))
  // Cache.set(key.refreshExpires, Random.datetime('T'))
}
export function checkSessionTimeout () {
  window.alert(isSessionTimeout())
}
export function doGet () {
  get(commonUrl, commonData).then(() => {
    console.log('get request success!')
  })
}
export function doPost () {
  post(commonUrl, commonData).then(() => {
    console.log('post request success!')
  })
}
export function doPut () {
  put(commonUrl, commonData).then(() => {
    console.log('put request success!')
  })
}
export function doPatch () {
  patch(commonUrl, commonData).then(() => {
    console.log('patch request success!')
  })
}
export function doDelete () {
  del(commonUrl, commonData).then(() => {
    console.log('delete request success!')
  })
}
