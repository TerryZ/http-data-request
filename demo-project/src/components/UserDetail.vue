<template>
  <div class="px-5 pt-3">
    <div>
      <div class="row mb-3">
        <label class="col-sm-3 col-form-label">Id</label>
        <div class="col-sm-9">
          <input
            type="text"
            readonly
            class="form-control-plaintext"
            :value="user?.id"
          >
        </div>
      </div>
      <div class="row mb-3">
        <label class="col-sm-3 col-form-label">Name</label>
        <div class="col-sm-9">
          <input
            type="text"
            readonly
            class="form-control-plaintext"
            :value="user?.name"
          >
        </div>
      </div>
      <div class="row mb-3">
        <label class="col-sm-3 col-form-label">Username</label>
        <div class="col-sm-9">
          <input
            type="text"
            readonly
            class="form-control-plaintext"
            :value="user?.username"
          >
        </div>
      </div>
      <div class="row mb-3">
        <label class="col-sm-3 col-form-label">Email</label>
        <div class="col-sm-9">
          <input
            type="text"
            readonly
            class="form-control-plaintext"
            :value="user?.email"
          >
        </div>
      </div>
      <div class="row mb-3">
        <label class="col-sm-3 col-form-label">Phone</label>
        <div class="col-sm-9">
          <input
            type="text"
            readonly
            class="form-control-plaintext"
            :value="user?.phone"
          >
        </div>
      </div>
      <div class="row mb-3">
        <label class="col-sm-3 col-form-label">Website</label>
        <div class="col-sm-9">
          <input
            type="text"
            readonly
            class="form-control-plaintext"
            :value="user?.website"
          >
        </div>
      </div>
    </div>

    <div class="d-flex">
      <button
        type="button"
        class="btn btn-dark"
        @click="emit('close')"
      >Close</button>

      <div
        class="ms-3"
        v-if="loading"
      >Loading...</div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'

import { get } from '@http'

const props = defineProps({
  id: { type: Number, default: undefined }
})
const emit = defineEmits(['close'])

const loading = ref(true)
const user = ref({})

get(`https://jsonplaceholder.typicode.com/users/${props.id}`)
  .then(data => {
    console.log(data)
    user.value = data
  })
  .finally(() => {
    loading.value = false
  })
</script>
