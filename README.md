# http-data-request

Create customized data request methods for web projects

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

```js
// /src/config/http/index.js
import { useHttpDataRequest } from 'http-data-request'

const options = {
  baseUrl: 'https://example.com/api',
}

export const {
  http, get, post, put, patch, del, cancel
} = useHttpDataRequest(options)
```

```js
// vite.config.js
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

API definition

```js
// /src/api/user.js
import { get, post } from '@http'

export function getUser (userId) {
  return get(`/user/${userId}`)
}
```

In some component

```vue
<template>
  <div>
    <div>
      User name: {{ user.name }}
    </div>
    <div>
      User age: {{ user.age }}
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { getUser } from '@api/user'

const user = ref({})

getUser(10).then(data => {
  user.value = data
})
</script>
```

### Cancel request

Cancel a download request

```vue
<template>
  <div>
    <div>
      ...order form
    </div>
    <button
      type="button"
      @click="save"
    >Save order</button>
    <!--
    Clicking before the data is saved successfully
    will cancel the data request
    -->
    <button
      type="button"
      @click="cancel"
    >Cancel</button>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { DialogMessageSuccess } from 'v-dialogs'
import { cancel } from '@http'
import { saveOrder } from '@api/order'

function save () {
  saveOrder({ ...formData }).then(() => {
    DialogMessageSuccess('Order save successfully')
  })
}
</script>
```

## Global Settings

```js
import {
  useHttpDataRequest
  EXCEPTION_BUSINESS,
  EXCEPTION_AUTH_INVALID
} from 'http-data-request'
// Use v-dialogs to display exception message for example
import { DialogMessageError, DialogAlertError } from 'v-dialogs'
import { logout } from './auth'

const options = {
  baseUrl: 'https://example.com/api',
  // globally set the exception handler
  exception (message, type) {
    // display business exceptions
    if (type === EXCEPTION_BUSINESS) {
      DialogMessageError(message)
      return
    }

    // display rest of other exceptions
    DialogAlertError(message)

    // some action for user authorization expired
    if (type === EXCEPTION_AUTH_INVALID) {
      // cancel all current request when
      cancel()
      // logout and redirect to login page
      logout()
    }
  }
}

export const {
  http, get, post, put, patch, del, cancel
} = useHttpDataRequest(options)
```
