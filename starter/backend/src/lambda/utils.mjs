import { parseUserId } from '../auth/utils.mjs'

export function getUserId(event) {
  const headers = event.headers || {}
  const authorization = headers.Authorization || headers.authorization
  if (!authorization) {
    throw new Error('Missing Authorization header')
  }
  const split = authorization.split(' ')
  const jwtToken = split[1]

  return parseUserId(jwtToken)
}
