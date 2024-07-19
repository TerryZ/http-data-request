<template>
  <div
    class="bg-light p-3 font-monospace"
    style="font-size: 14px;"
  >
    <h2>Log board</h2>
    <div
      class="mb-2"
      :class="{ 'text-danger': error }"
      v-for="({ error, value }, index) in logList"
      :key="index"
      v-text="value"
    />
  </div>
</template>

<script setup>
import { logList } from './log-board'
</script>
