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
      <div class="me-3">
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
      <div>
        <ol class="text-body-secondary">
          <li>request with access token</li>
          <li>response refresh token invalid</li>
          <li>redirect to login</li>
        </ol>
        <a
          href="javascript: void(0)"
          @click="accessTokenAndRefreshTokenInvalid"
        >使用 access token 请求，响应 refresh token 失效</a>
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
        refresh success with access token invalid
      </button>
      <button
        type="button"
        class="btn btn-danger"
        @click="multipleRefreshSuccess(true)"
      >
        refresh failure with access token invalid
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

  if (fail) {
    setRefreshTokenInvalid(true)
  }

  function handleRequest (params, status) {
    status.value = 'loading...'
    post(urlAccessTokenInvalid, params)
      .then(resp => {
        pushLog(resp)
        status.value = 'Load data successfully'
      })
      .catch(error => {
        status.value = error.message
        // console.log(1, error)
        // console.dir(error)
        pushErrorLog(error)
      })
  }

  handleRequest({ id: 1 }, request1)
  handleRequest({ id: 2 }, request2)
  handleRequest({ id: 3 }, request3)
  handleRequest({ id: 4 }, request4)
  handleRequest({ id: 5 }, request5)
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
function accessTokenAndRefreshTokenInvalid () {
  post('/auth/access-token-and-refresh-token-invalid')
    .then(resp => { pushLog(resp) })
    .catch(error => pushErrorLog(error))
    .finally(() => resetTokenState())
}
</script>
