<template>
  <div class="p-3">
    <h2>Http 数据请求</h2>
    <div class="shadow p-5 rounded-3">
      <h3 class="mt-0">
        常规使用场景
      </h3>
      <button
        type="button"
        class="btn btn-light me-3"
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
    </div>

    <div class="border p-5 rounded-3 mt-5 mx-0">
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
    </div>

    <div class="border p-5 rounded-3 mt-5 row mx-0">
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
        <button
          type="button"
          class="btn btn-danger me-3"
          @click="cancel"
        >
          中断当前正在执行的请求
        </button>
      </div>
    </div>

    <div class="border p-5 rounded-3 mt-5">
      <h3>Token</h3>
      <div>
        <button
          type="button"
          class="btn btn-danger"
          @click="accessTokenInvalid"
        >
          access token invalid
        </button>
      </div>
    </div>

    <div class="shadow p-5 rounded-3 mt-5">
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
          清空 storge 中存储的数据
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { regularSuccess } from './example-index'
</script>