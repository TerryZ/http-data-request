<template>
  <div
    class="d-grid"
    style="grid-template-rows: 1fr 1fr;"
  >
    <div
      class="bg-light p-3 font-monospace"
      style="font-size: 13px;"
    >
      <h2>
        Log messages
        <button
          type="button"
          class="btn btn-outline-secondary btn-sm"
          @click="clear"
        >
          Clear
        </button>
      </h2>
      <div
        class="mb-2"
        :class="{ 'text-danger': error }"
        :key="index"
        v-for="({ error, value, pre }, index) in logList"
      >
        <pre
          class="m-0"
          style="font-size: unset;"
          v-if="pre"
        >{{ value }}</pre>
        <template v-else>
          {{ value }}
        </template>
      </div>
    </div>

    <div
      class="bg-dark p-3 font-monospace"
      style="font-size: 13px;"
    >
      <h2 class="text-light">
        Console logs
        <button
          type="button"
          class="btn btn-light btn-sm"
          @click="clearConsoleLogs"
        >
          Clear
        </button>
      </h2>
      <div
        class="mb-2 d-flex"
        :key="index"
        v-for="({ message, type }, index) in consoleLogs"
      >
        <div class="text-white me-2 fw-bold">
          {{ type }}
        </div>
        <div class="text-danger">
          {{ message }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { logList, clear, consoleLogs, clearConsoleLogs } from './log-board'
</script>
