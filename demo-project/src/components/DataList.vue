<template>
  <div class="bg-warning-subtle rounded-3 mb-3 p-3">
    <h3>TIP</h3>
    <div>
      The demo uses online data from
      <span class="badge rounded-pill text-bg-light">jsonplaceholder.typicode.com</span>.
      Since the returned data format cannot be customized, only the settings and application scenarios of
      <span class="badge rounded-pill text-bg-light">http-data-request</span>
      are demonstrated here. For more usage content, please refer to the
      <a href="https://terryz.github.io/docs-utils/http-data-request/" target="_blank">documentation</a>
    </div>
  </div>
  <div>
    <div>
      <h3>Users</h3>
      <div class="p-3 shadow-sm border rounded-3 mb-3">
        <table class="table table-striped m-0">
          <thead>
            <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Username</th>
            <th>Email</th>
          </tr>
          </thead>
          <tbody>
            <tr v-for="user in list" :key="user.id">
            <td>{{ user.id }}</td>
            <td>
              <a
                href="javascript: void(0)"
                @click="userDetail(user.id)"
              >
                {{ user.name }}
              </a>
            </td>
            <td>{{ user.username }}</td>
            <td>{{ user.email }}</td>
          </tr>
          </tbody>
        </table>
        <div class="mt-3" v-if="loading">Now loading...</div>
      </div>

    </div>
    <div>
      <button
        type="button"
        class="btn btn-dark"
        @click="getUsers"
      >Load users</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

import { DialogModal } from 'v-dialogs'
import { get } from '@http'

import UserDetail from './UserDetail.vue'

const loading = ref(false)
const list = ref([])

function getUsers () {
  loading.value = true
  list.value = []
  get('https://jsonplaceholder.typicode.com/users')
    .then(data => {
      console.log(data)
      list.value = data
    })
    .finally(() => {
      loading.value = false
    })
}
function userDetail (id) {
  DialogModal(UserDetail, {
    title: 'User Detail',
    params: { id },
    width: 500,
    height: 450
  })
}
</script>
