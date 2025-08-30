import { PutObjectCommand, GetObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const urlExpiration = parseInt(process.env.SIGNED_URL_EXPIRATION, 10)
const bucket = process.env.TODOS_S3_BUCKET
const s3Client = new S3Client()

export async function generateAttachmentUrl(id) {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: id
  })

  return await getSignedUrl(s3Client, command, { expiresIn: urlExpiration })
}

export async function generateImageUrl(id) {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: id
  })

  return await getSignedUrl(s3Client, command, { expiresIn: 3600 }) // 1 hour for viewing
}

export function getFormattedUrl(id) {
  return `https://${bucket}.s3.us-east-1.amazonaws.com/${id}`
}