<template>
  <section class="mb-5">
    <h3>Token</h3>
    <h4>access token 失效</h4>
    <div class="mb-3 d-flex">
      <div class="me-3">
        <ol class="text-body-secondary">
          <li>access token invalid</li>
          <li>refresh access token(success)</li>
          <li>resend request and get data</li>
        </ol>
        <a
          href="javascript: void(0)"
          @click="accessTokenInvalidRefreshSuccess"
        >access token 失效，刷新成功</a>
      </div>
      <div>
        <ol class="text-body-secondary">
          <li>access token invalid</li>
          <li>refresh access token(failure)</li>
          <li>redirect to login</li>
        </ol>
        <a
          href="javascript: void(0)"
          @click="accessTokenInvalidRefreshFail"
        >access token 失效，刷新失败</a>
      </div>
    </div>

    <h4>并发请求</h4>
    <div class="d-flex flex-column mb-3">
      <div class="me-3">
        request1:
        <span
          class="text-danger"
          v-text="request1"
        />
      </div>
      <div class="me-3">
        request2:
        <span
          class="text-danger"
          v-text="request2"
        />
      </div>
      <div class="me-3">
        request3:
        <span
          class="text-danger"
          v-text="request3"
        />
      </div>
      <div class="me-3">
        request4:
        <span
          class="text-danger"
          v-text="request4"
        />
      </div>
      <div class="me-3">
        request5:
        <span
          class="text-danger"
          v-text="request5"
        />
      </div>
    </div>
    <div>
      <button
        type="button"
        class="btn btn-success me-3"
        @click="multipleRefreshSuccess(false)"
      >
        access token invalid refresh success
      </button>
      <button
        type="button"
        class="btn btn-danger"
        @click="multipleRefreshSuccess(true)"
      >
        access token invalid refresh failure
      </button>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

import {
  setRefreshTokenInvalid,
  resetTokenState
} from './mock'
import { pushLog, pushErrorLog } from './log-board'
import { post } from './http'

const urlAccessTokenInvalid = '/auth/access-token-invalid'

const request1 = ref('')
const request2 = ref('')
const request3 = ref('')
const request4 = ref('')
const request5 = ref('')

function multipleRefreshSuccess (fail = false) {
  resetTokenState()
  // https://run.mocky.io/v3/cb5d1196-df3c-4a1e-b3c5-2c9d2e9992b4
  // baseUrl + '/http/access-token-invalid'

  request1.value = 'loading...'
  request2.value = 'loading...'
  request3.value = 'loading...'
  request4.value = 'loading...'
  request5.value = 'loading...'

  if (fail) {
    setRefreshTokenInvalid(true)
  }

  post(urlAccessTokenInvalid, { id: 1 })
    .then(resp => {
      pushLog(resp)
      request1.value = 'Load data successfully'
    })
    .catch(error => {
      request1.value = error.message
      console.log(1, error)
      // console.dir(error)
      pushErrorLog(error)
    })
  post(urlAccessTokenInvalid, { id: 2 })
    .then(resp => {
      pushLog(resp)
      request2.value = 'Load data successfully'
    })
    .catch(error => {
      request2.value = error.message
      console.log(2, error)
      // console.dir(error)
      pushErrorLog(error)
    })
  post(urlAccessTokenInvalid, { id: 3 })
    .then(resp => {
      pushLog(resp)
      request3.value = 'Load data successfully'
    })
    .catch(error => {
      request3.value = error.message
      console.log(3, error)
      // console.dir(error)
      pushErrorLog(error)
    })
  post(urlAccessTokenInvalid, { id: 4 })
    .then(resp => {
      pushLog(resp)
      request4.value = 'Load data successfully'
    })
    .catch(error => {
      request4.value = error.message
      console.log(4, error)
      // console.dir(error)
      pushErrorLog(error)
    })
  post(urlAccessTokenInvalid, { id: 5 })
    .then(resp => {
      pushLog(resp)
      request5.value = 'Load data successfully'
    })
    .catch(error => {
      request5.value = error.message
      console.log(5, error)
      // console.dir(error)
      pushErrorLog(error)
    })
}

function accessTokenInvalidRefreshSuccess () {
  post(urlAccessTokenInvalid)
    .then(resp => { pushLog(resp) })
    .catch(error => { console.dir(error) })
    .finally(() => resetTokenState())
}
function accessTokenInvalidRefreshFail () {
  setRefreshTokenInvalid(true)
  post(urlAccessTokenInvalid)
    .then(resp => { pushLog(resp) })
    .catch(error => {
      pushLog({ message: error.message, type: error.type }, true)
      console.dir(error)
    })
    .finally(() => resetTokenState())
}
</script>
