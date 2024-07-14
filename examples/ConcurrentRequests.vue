<template>
  <section class="my-3">
    <h3>Token</h3>
    <div class="d-flex">
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
        class="btn btn-danger"
        @click="accessTokenInvalid"
      >
        access token invalid
      </button>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

import { baseUrl } from './mock'
import { post } from './http'

const request1 = ref('')
const request2 = ref('')
const request3 = ref('')
const request4 = ref('')
const request5 = ref('')

function accessTokenInvalid () {
  // https://run.mocky.io/v3/cb5d1196-df3c-4a1e-b3c5-2c9d2e9992b4
  // baseUrl + '/http/access-token-invalid'
  const url = baseUrl + '/http/access-token-invalid'

  request1.value = 'loading...'
  request2.value = 'loading...'
  request3.value = 'loading...'
  request4.value = 'loading...'
  request5.value = 'loading...'

  post(url, { id: 1 })
    .then(resp => { console.dir(resp) })
    .catch(error => {
      request1.value = error.message
      console.log(1, error)
      // console.dir(error)
    })
  post(url, { id: 2 })
    .then(resp => { console.dir(resp) })
    .catch(error => {
      request2.value = error.message
      console.log(2, error)
      // console.dir(error)
    })
  post(url, { id: 3 })
    .then(resp => { console.dir(resp) })
    .catch(error => {
      request3.value = error.message
      console.log(3, error)
      // console.dir(error)
    })
  post(url, { id: 4 })
    .then(resp => { console.dir(resp) })
    .catch(error => {
      request4.value = error.message
      console.log(4, error)
      // console.dir(error)
    })
  post(url, { id: 5 })
    .then(resp => { console.dir(resp) })
    .catch(error => {
      request5.value = error.message
      console.log(5, error)
      // console.dir(error)
    })
}
</script>
