# http-data-request

Create customized data request methods for web projects

[![CircleCI](https://circleci.com/gh/TerryZ/http-data-request/tree/main.svg?style=svg)](https://circleci.com/gh/TerryZ/http-data-request/tree/main)
[![code coverage](https://codecov.io/gh/TerryZ/http-data-request/branch/main/graph/badge.svg)](https://codecov.io/gh/TerryZ/http-data-request)
[![npm version](https://img.shields.io/npm/v/http-data-request.svg)](https://www.npmjs.com/package/http-data-request)
[![license](https://img.shields.io/badge/license-MIT-brightgreen.svg)](https://mit-license.org/)
[![npm](https://img.shields.io/npm/dy/http-data-request.svg)](https://www.npmjs.com/package/http-data-request)

## Features

- Automatically save and apply authorization tokens
- Unified handling of exception information
- Customizable status code
- Customizable authorization data node
- Provides quick access functions for each request method
- Provides a function to cancel all current requests

## Examples and Documentation

Documentation and examples please visit below sites

- [Github pages](https://terryz.github.io/docs-utils/http-data-request/)

## Installation

```sh
# npm
npm i http-data-request
# yarn
yarn add http-data-request
# pnpm
pnpm add http-data-request
```

### Setup to your project

Add a file in the project, such as `/src/config/http/index.js`, to set the global configuration of `http-data-request` and export various functional functions

```js
import { useHttpDataRequest } from 'http-data-request'

const options = {
  baseUrl: 'https://example.com/api',
}

export const {
  http, get, post, put, patch, del, cancel
} = useHttpDataRequest(options)
```

In the Vite configuration file `vite.config.js`, set an alias for the project installation module directory for http

```js
import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@api': fileURLToPath(new URL('./src/api', import.meta.url)),
      '@http': fileURLToPath(new URL('./src/config/http', import.meta.url))
    }
  },
  ...
})
```

## Usage

Define data request methods for business

```js
// /src/api/user.js
import { get, post } from '@http'

export function getUser (userId) {
  return get(`/user/${userId}`)
}
```

Use in component

```vue
<template>
  <div>
    <div>User name: {{ user.name }}</div>
    <div>User age: {{ user.age }}</div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { getUser } from '@api/user'

const user = ref({})

getUser(10).then(data => { user.value = data })
</script>
```
