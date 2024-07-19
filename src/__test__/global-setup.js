import { setAccessTokenInvalid, setRefreshTokenInvalid } from '@example/mock'

export function setup ({ provide }) {
  provide({
    setAccessTokenInvalid,
    setRefreshTokenInvalid
  })
}
