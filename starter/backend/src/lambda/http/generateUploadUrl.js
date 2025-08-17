import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { DynamoDBClient, UpdateItemCommand } from '@aws-sdk/client-dynamodb';

const s3 = new S3Client();
const dynamoDb = new DynamoDBClient();

export async function generateUploadUrl(event) {
  console.log('--- Incoming Event ---');
  console.log(JSON.stringify(event, null, 2));

  // Use default values for testing if authorizer is missing
  const todoId = event.pathParameters?.todoId;
  const userId = event.requestContext?.authorizer?.principalId || 'test-user';

  if (!todoId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing todoId in path parameters' })
    };
  }

  const bucketName = process.env.ATTACHMENTS_S3_BUCKET;
  const urlExpiration = parseInt(process.env.SIGNED_URL_EXPIRATION, 10) || 300;

  try {
    // Generate S3 signed URL
    const putCommand = new PutObjectCommand({
      Bucket: bucketName,
      Key: todoId
    });

    const uploadUrl = await getSignedUrl(s3, putCommand, { expiresIn: urlExpiration });
    console.log('Generated upload URL:', uploadUrl);

    // Update DynamoDB with attachment URL
    const command = new UpdateItemCommand({
      TableName: process.env.TODOS_TABLE,
      Key: {
        userId: { S: userId },
        todoId: { S: todoId }
      },
      UpdateExpression: 'set attachmentUrl = :a',
      ExpressionAttributeValues: {
        ':a': { S: `https://${bucketName}.s3.amazonaws.com/${todoId}` }
      }
    });

    const result = await dynamoDb.send(command);
    console.log('DynamoDB update result:', result);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST,OPTIONS'
      },
      body: JSON.stringify({ uploadUrl })
    };
  } catch (err) {
    console.error('Failed to generate upload URL or update DynamoDB:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to generate upload URL', error: err.message })
    };
  }
}
