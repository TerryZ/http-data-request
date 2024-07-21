<template>
  <div
    class="bg-light p-3 font-monospace"
    style="font-size: 13px;"
  >
    <h2>
      Log board
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
</template>

<script setup>
import { logList, clear } from './log-board'
</script>
