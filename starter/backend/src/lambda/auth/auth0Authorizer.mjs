import axios from 'axios'
import { decode, verify } from 'jsonwebtoken'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('auth')

// In-memory cache for JWKS per issuer
const jwksCache = new Map()

function certToPEM(cert) {
  const wrapped = cert.match(/.{1,64}/g).join('\n')
  return `-----BEGIN CERTIFICATE-----\n${wrapped}\n-----END CERTIFICATE-----\n`
}

async function getSigningKey(issuer, kid) {
  const cacheKey = `${issuer}|${kid}`
  if (jwksCache.has(cacheKey)) {
    return jwksCache.get(cacheKey)
  }

  const jwksUri = `${issuer.replace(/\/$/, '')}/.well-known/jwks.json`
  logger.info('Fetching JWKS', { jwksUri, kid })
  const { data } = await axios.get(jwksUri)
  const keys = data.keys || []
  const jwk = keys.find((k) => k.kid === kid)
  if (!jwk) {
    throw new Error('Unable to find a signing key that matches the kid')
  }

  // Prefer x5c chain
  if (jwk.x5c && jwk.x5c.length > 0) {
    const publicKey = certToPEM(jwk.x5c[0])
    jwksCache.set(cacheKey, publicKey)
    return publicKey
  }

  // Fallback could convert n/e (RSA components) to PEM, but Auth0 provides x5c
  throw new Error('JWKS key does not contain x5c certificate')
}

function generatePolicy(principalId, effect, resource) {
  return {
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource
        }
      ]
    }
  }
}

export const handler = async (event) => {
  try {
    const authorizationHeader = event.authorizationToken || ''
    const token = authorizationHeader.split(' ')[1]
    if (!token) {
      logger.warn('Missing bearer token')
      return generatePolicy('unauthorized', 'Deny', event.methodArn)
    }

    const decoded = decode(token, { complete: true })
    if (!decoded || !decoded.header || !decoded.payload) {
      logger.warn('Failed to decode token')
      return generatePolicy('unauthorized', 'Deny', event.methodArn)
    }

    const { kid } = decoded.header
    const { iss, aud, sub } = decoded.payload

    if (!iss) {
      logger.warn('Token missing issuer (iss)')
      return generatePolicy('unauthorized', 'Deny', event.methodArn)
    }

    const publicKey = await getSigningKey(iss, kid)

    const verified = verify(token, publicKey, {
      algorithms: ['RS256'],
      issuer: iss
      // Optionally enforce audience by env, if provided
    })

    logger.info('Token verified', { sub: verified.sub, aud: verified.aud })
    return generatePolicy(verified.sub || sub || 'user', 'Allow', event.methodArn)
  } catch (err) {
    logger.error('Authorization error', { error: err.message })
    return generatePolicy('unauthorized', 'Deny', event.methodArn)
  }
}