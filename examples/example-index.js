import { ref } from 'vue'

// import { DialogMessageSuccess } from 'v-dialogs'
// import sinon from 'sinon'

import {
  http,
  get, post, put, patch, del,
  cancel, isSessionTimeout
} from './http'
import { pushLog, pushErrorLog } from './log-board'
import { Cache } from '@/cache'
// import { baseUrl } from './mock'

// const server = sinon.fakeServer.create()

// const commonUrl = 'https://run.mocky.io/v3/4a7ae569-f190-4400-bd36-2d6593e74d63'

export const loading = ref(false)

export function regularSuccess () {
  const success = http('/success')

  success.then(resp => {
    // console.log(resp)
    pushLog(resp)
    // DialogMessageSuccess('Request success!')
  }).catch(resp => {
    console.log('catch-' + resp)
  })
}
export function businessError () {
  http('/business-error')
    .then(resp => console.log('then-' + resp))
    .catch(resp => {
      // console.log(typeof resp)
      // console.dir(resp)
      // console.log('catch-' + resp)
      pushErrorLog(resp)
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
  // const url = commonUrl + '?mocky-delay=10s'
  const url = '/long-time'

  post(url, undefined, {
    timeout: 1000
  })
    .then(resp => console.log(resp))
    .catch(error => {
      // console.log(typeof resp)
      console.dir(error)
      // console.log(error)
      pushErrorLog(error)
    })
}
export function successWithCustomAccess () {
  http('https://run.mocky.io/v3/5628ccfe-141b-4241-ade5-14d89c67411e')
    .then(resp => {})
}
export function error500 () {
  post('/500-error')
    .then(resp => {})
    .catch(error => {
      console.log(error)
      const { status, statusText } = error.response
      pushLog({ status, statusText }, true)
    })
}
export function error404 () {
  post('/404-error')
    .then(resp => {})
    .catch(error => {
      console.log(error)
      const { status, statusText } = error.response
      pushLog({ status, statusText }, true)
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
      pushErrorLog(error)
    })
    .finally(() => {
      loading.value = false
    })

  setTimeout(cancel, 1500)
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
  get('/success').then(() => {
    pushLog('get request success!')
  })
}
export function doPost () {
  post('/success').then(() => {
    pushLog('post request success!')
  })
}
export function doPut () {
  put('/success').then(() => {
    pushLog('put request success!')
  })
}
export function doPatch () {
  patch('/success').then(() => {
    pushLog('patch request success!')
  })
}
export function doDelete () {
  del('/success').then(() => {
    pushLog('delete request success!')
  })
}
export function noBody () {
  post('/no-body')
    .then(resp => console.log(resp))
    .catch(error => {
      // console.log(typeof resp)
      // console.dir(resp)
      console.dir(error)
      pushErrorLog(error)
    })
}
