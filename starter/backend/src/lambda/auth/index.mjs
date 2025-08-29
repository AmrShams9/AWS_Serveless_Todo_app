import axios from 'axios'
import jwt from 'jsonwebtoken'

function certToPEM(cert) {
  const wrapped = cert.match(/.{1,64}/g).join('\n')
  return `-----BEGIN CERTIFICATE-----\n${wrapped}\n-----END CERTIFICATE-----\n`
}

async function getSigningKey(kid) {
  const domain = process.env.AUTH0_DOMAIN
  if (!domain) {
    throw new Error('Missing AUTH0_DOMAIN environment variable')
  }
  const jwksUrl = `https://${domain}/.well-known/jwks.json`
  const { data } = await axios.get(jwksUrl)
  const key = data.keys.find(k => k.kid === kid)
  if (!key || !key.x5c || !key.x5c.length) {
    throw new Error('Signing key not found for kid: ' + kid)
  }
  return certToPEM(key.x5c[0])
}

function generatePolicy(principalId, effect, resource, context = {}) {
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
    },
    context
  }
}

export async function handler(event) {
  try {
    console.log('Auth event:', JSON.stringify(event, null, 2))
    
    const token = (event.authorizationToken || '').split(' ')[1]
    if (!token) {
      console.error('Missing bearer token')
      return generatePolicy('anonymous', 'Deny', event.methodArn)
    }

    const decodedHeader = jwt.decode(token, { complete: true })
    if (!decodedHeader || !decodedHeader.header || !decodedHeader.header.kid) {
      console.error('Invalid token header')
      return generatePolicy('anonymous', 'Deny', event.methodArn)
    }

    const signingKey = await getSigningKey(decodedHeader.header.kid)

    const verifyOptions = {
      algorithms: ['RS256'],
      issuer: `https://${process.env.AUTH0_DOMAIN}/`
    }

    const verified = jwt.verify(token, signingKey, verifyOptions)
    console.log('Token verified successfully:', { sub: verified.sub, aud: verified.aud, iss: verified.iss })

    const userId = verified.sub
    return generatePolicy(userId, 'Allow', event.methodArn, { userId })
  } catch (err) {
    console.error('Authorization error:', err.message, err.stack)
    return generatePolicy('anonymous', 'Deny', event.methodArn)
  }
} 