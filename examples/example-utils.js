import { computed } from 'vue'
import { Cache } from '@/cache'
import {
  KEY_DATA_SET,
  KEY_ACCESS_TOKEN,
  KEY_REFRESH_TOKEN,
  KEY_EXPIRES_IN,
  STATE_SUCCESS,
  STATE_INVALID_ACCESS_TOKEN,
  STATE_INVALID_REFRESH_TOKEN
} from '@/constants'

const keyLanguage = 'example-language'
const keyAccess = 'example-access'
const keyAccessToken = 'example-access-token'
const keyRefreshToken = 'example-refresh-token'
const keyExpiresIn = 'example-expires-in'
const keyCodeSuccess = 'example-code-success'
const keyCodeInvalidAccessToken = 'example-code-invalid-access-token'
const keyCodeInvalidRefreshToken = 'example-code-invalid-refresh-token'

const setter = (key, val) => {
  Cache.set(key, val)
}

export const exampleLanguage = computed({
  get: () => Cache.get(keyLanguage) || 'en',
  set: val => setter(keyLanguage, val)
})
export const exampleAccess = computed({
  get: () => Cache.get(keyAccess) || KEY_DATA_SET,
  set: val => setter(keyAccess, val)
})
export const exampleAccessToken = computed({
  get: () => Cache.get(keyAccessToken) || KEY_ACCESS_TOKEN,
  set: val => setter(keyAccessToken, val)
})
export const exampleRefreshToken = computed({
  get: () => Cache.get(keyRefreshToken) || KEY_REFRESH_TOKEN,
  set: val => setter(keyRefreshToken, val)
})
export const exampleExpiresIn = computed({
  get: () => Cache.get(keyExpiresIn) || KEY_EXPIRES_IN,
  set: val => setter(keyExpiresIn, val)
})
export const exampleCodeSuccess = computed({
  get: () => Cache.get(keyCodeSuccess) || STATE_SUCCESS,
  set: val => setter(keyCodeSuccess, val)
})
export const exampleCodeInvalidAccessToken = computed({
  get: () => Cache.get(keyCodeInvalidAccessToken) || STATE_INVALID_ACCESS_TOKEN,
  set: val => setter(keyCodeInvalidAccessToken, val)
})
export const exampleCodeInvalidRefreshToken = computed({
  get: () => Cache.get(keyCodeInvalidRefreshToken) || STATE_INVALID_REFRESH_TOKEN,
  set: val => setter(keyCodeInvalidRefreshToken, val)
})

export function applySetting () {
  window.location.reload()
}
