<template>
  <div class="p-3">
    <section class="">
      <h3 class="mt-0">
        常规使用场景
      </h3>
      <button
        type="button"
        class="btn btn-secondary me-3"
        @click="regularSuccess"
      >
        请求成功
      </button>

      <button
        type="button"
        class="btn btn-danger me-3"
        @click="businessError"
      >
        业务错误
      </button>

      <button
        type="button"
        class="btn btn-warning me-3"
        @click="regularTimeout"
      >
        用户授权失效（服务器）
      </button>

      <button
        type="button"
        class="btn btn-success me-3"
        @click="successWithAccess"
      >
        请求成功，并带有 token 相关信息
      </button>

      <button
        type="button"
        class="btn btn-success me-3"
        @click="successWithCustomAccess"
      >
        请求成功，并带有非标准 token 字段信息
      </button>

      <button
        type="button"
        class="btn btn-danger me-3"
        @click="error500"
      >
        http-500
      </button>
    </section>

    <section class="my-3">
      <h3 class="mt-0 d-flex">
        HTTP Methods
      </h3>
      <button
        type="button"
        class="btn btn-outline-secondary me-3"
        @click="doGet"
      >
        Get
      </button>
      <button
        type="button"
        class="btn btn-outline-secondary me-3"
        @click="doPost"
      >
        Post
      </button>
      <button
        type="button"
        class="btn btn-outline-secondary me-3"
        @click="doPut"
      >
        Put
      </button>
      <button
        type="button"
        class="btn btn-outline-secondary me-3"
        @click="doPatch"
      >
        Patch
      </button>
      <button
        type="button"
        class="btn btn-outline-secondary"
        @click="doDelete"
      >
        Delete
      </button>
    </section>

    <section class="my-3 row">
      <div class="col-md-6">
        <h3 class="mt-0">
          请求异常
        </h3>
        <button
          type="button"
          class="btn btn-outline-danger me-3"
          @click="longTimeRequest"
        >
          单次请求超过时长限制
        </button>

        <button
          type="button"
          class="btn btn-outline-secondary"
          @click="checkSessionTimeout"
        >
          检查用户登录授权是否失效（本地）
        </button>
      </div>
      <div class="col-md-6">
        <h3 class="mt-0">
          中断请求
        </h3>

        <div class="d-flex">
          <div
            class="d-flex align-items-center me-3 bg-secondary-subtle rounded-3 px-3"
            v-if="loading"
          >
            <div
              class="spinner-border spinner-border-sm text-dark me-3"
              role="status"
            >
              <span class="visually-hidden">Loading...</span>
            </div>
            Loading...
          </div>

          <button
            type="button"
            class="btn btn-danger me-3"
            @click="doCancel"
          >
            中断当前正在执行的请求
          </button>
        </div>
      </div>
    </section>

    <ConcurrentRequests />

    <section class="">
      <h3 class="mt-0">
        调试
      </h3>
      <div>
        <button
          type="button"
          class="btn btn-success me-3"
          @click="generateToken"
        >
          Generate Token
        </button>
        <button
          type="button"
          class="btn btn-danger me-3"
          @click="cleanStorage"
        >
          清空 storage 中存储的数据
        </button>
      </div>
    </section>
  </div>
</template>

<script setup>
import {
  regularSuccess,
  businessError,
  checkSessionTimeout,
  cleanStorage,
  doCancel,
  doDelete,
  doGet,
  doPatch,
  doPost,
  doPut,
  error500,
  generateToken,
  longTimeRequest,
  regularTimeout,
  successWithAccess,
  successWithCustomAccess,

  loading
} from './example-index'
import ConcurrentRequests from './ConcurrentRequests.vue'
</script>
