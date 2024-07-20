import { ref } from 'vue'

export const logList = ref([])

export function pushLog (data, error = false, pre = false) {
  logList.value.push({
    error,
    pre,
    value: JSON.stringify(data, null, 2)
  })
}
export function pushErrorLog (error) {
  pushLog({ message: error.message, type: error.type }, true)
}
export function clear () {
  logList.value = []
}
