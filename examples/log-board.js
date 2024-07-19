import { ref } from 'vue'

export const logList = ref([])

export function pushLog (data, error = false) {
  logList.value.push({
    error,
    value: JSON.stringify(data, null, 2)
  })
}
