import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb';

// Make sure the region matches your table
const dynamoDb = new DynamoDBClient({ region: process.env.AWS_REGION || 'us-east-1' });

export async function getTodos(event) {
  console.log('--- Lambda invoked ---');
  console.log('Event received:', JSON.stringify(event, null, 2));

  // Fallback userId for local testing
  const userId = event.requestContext?.authorizer?.principalId || 'test-user';
  console.log('Using userId:', userId);

  // Check environment variable
  const tableName = process.env.TODOS_TABLE;
  if (!tableName) {
    console.error('TODOS_TABLE environment variable is missing!');
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({ message: 'Server misconfiguration: TODOS_TABLE not set' })
    };
  }
  console.log('Using DynamoDB table:', tableName);

  try {
    const command = new QueryCommand({
      TableName: tableName,
      KeyConditionExpression: 'userId = :u',
      ExpressionAttributeValues: {
        ':u': { S: userId }
      }
    });

    console.log('Sending query to DynamoDB...');
    const result = await dynamoDb.send(command);
    console.log('Query result:', JSON.stringify(result, null, 2));

    const items = result.Items
      ? result.Items.map(item => ({
          userId: item.userId.S,
          todoId: item.todoId.S,
          createdAt: item.createdAt.S,
          name: item.name.S,
          dueDate: item.dueDate.S,
          done: item.done.BOOL,
          attachmentUrl: item.attachmentUrl ? item.attachmentUrl.S : null
        }))
      : [];

    console.log('Returning items:', items);

    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify({ items })
    };
  } catch (error) {
    console.error('DynamoDB query failed:', error);

    return {
      statusCode: 200, // still returns 200 so frontend can read message
      headers: corsHeaders(),
      body: JSON.stringify({
        message: 'DynamoDB query failed',
        error: error.message,
        stack: error.stack
      })
    };
  }
}

// Helper function for consistent CORS headers
function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*', // change to your frontend URL in production
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Access-Control-Allow-Methods': 'GET,OPTIONS'
  };
}
