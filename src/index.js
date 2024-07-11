import { exception } from './constants'

// export http class
export { default as Http } from './http'
// methods adaptor
export { httpSetup } from './utils'

// export exception constants
export const EXCEPTION_BUSINESS = exception.business
export const EXCEPTION_AUTH_INVALID = exception.authInvalid
export const EXCEPTION_SYSTEM = exception.system
