import {
  useHttpDataRequest,
  EXCEPTION_BUSINESS,
  EXCEPTION_AUTH_INVALID
} from 'http-data-request'
import { DialogMessageError, DialogAlertError } from 'v-dialogs'
// import { logout } from './auth'

const options = {
  baseUrl: 'https://example.com/api',
  // global exception handle
  exception (message, type) {
    // display business exceptions message
    if (type === EXCEPTION_BUSINESS) {
      DialogMessageError(message)
      return
    }
    // display rest of other exceptions message
    DialogAlertError(message)
    // some action for user authorization expired
    if (type === EXCEPTION_AUTH_INVALID) {
      // cancel all current request when
      cancel()
      // logout and redirect to login page
      // logout()
    }
  }
}

export const {
  http, get, post, put, patch, del, cancel
} = useHttpDataRequest(options)
