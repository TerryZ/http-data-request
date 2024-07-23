<template>
  <section class="mb-5">
    <h3 class="mt-0 d-flex align-items-center">
      定制化设置

      <button
        type="button"
        class="btn btn-outline-secondary btn-sm ms-3"
        @click="visible=!visible"
      >
        open
      </button>
    </h3>
    <div
      class="p-3 border rounded-3 shadow-sm"
      style="width: 25rem;"
      v-show="visible"
    >
      <div class="mb-3">
        <div class="form-check form-check-inline">
          <input
            class="form-check-input"
            type="radio"
            name="inlineRadioOptions"
            id="language-english"
            value="en"
            v-model="exampleLanguage"
          >
          <label
            class="form-check-label"
            for="language-english"
          >English</label>
        </div>
        <div class="form-check form-check-inline">
          <input
            class="form-check-input"
            type="radio"
            name="inlineRadioOptions"
            id="language-cn"
            value="zh-chs"
            v-model="exampleLanguage"
          >
          <label
            class="form-check-label"
            for="language-cn"
          >简体中文</label>
        </div>
      </div>
      <div>
        <div class="row mb-3">
          <label
            for="input-access"
            class="col-sm-5 col-form-label"
          >data set key</label>
          <div class="col-sm-7">
            <input
              type="email"
              class="form-control"
              id="input-access"
              v-model="exampleAccess"
            >
          </div>
        </div>
        <div class="row mb-3">
          <label
            for="input-access-token"
            class="col-sm-5 col-form-label"
          >access token key</label>
          <div class="col-sm-7">
            <input
              type="email"
              class="form-control"
              id="input-access-token"
              v-model="exampleAccessToken"
            >
          </div>
        </div>
        <div class="row mb-3">
          <label
            for="input-refresh-token"
            class="col-sm-5 col-form-label"
          >refresh token key</label>
          <div class="col-sm-7">
            <input
              type="email"
              class="form-control"
              id="input-refresh-token"
              v-model="exampleRefreshToken"
            >
          </div>
        </div>
        <div class="row mb-3">
          <label
            for="input-expires-in"
            class="col-sm-5 col-form-label"
          >expires in key</label>
          <div class="col-sm-7">
            <input
              type="email"
              class="form-control"
              id="input-expires-in"
              v-model="exampleExpiresIn"
            >
          </div>
        </div>
      </div>
      <div>
        <button
          type="button"
          class="btn btn-dark"
          @click="applySetting"
        >
          应用设置
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import {
  exampleLanguage,
  exampleAccess,
  exampleAccessToken,
  exampleRefreshToken,
  exampleExpiresIn,
  applySetting
} from './example-utils'

const visible = ref(false)
</script>
