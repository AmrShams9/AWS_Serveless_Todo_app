import { DynamoDBClient, DeleteItemCommand } from '@aws-sdk/client-dynamodb';

const dynamoDb = new DynamoDBClient();

export async function deleteTodo(event) {
  console.log('--- Incoming Event ---');
  console.log(JSON.stringify(event, null, 2));

  // Use a default userId for testing if no authorizer is set
  const userId = event.requestContext?.authorizer?.principalId || 'test-user';

  const todoId = event.pathParameters?.todoId;
  if (!todoId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing todoId in path parameters' })
    };
  }

  const command = new DeleteItemCommand({
    TableName: process.env.TODOS_TABLE,
    Key: {
      userId: { S: userId },
      todoId: { S: todoId }
    }
  });

  try {
    const result = await dynamoDb.send(command);
    console.log('DynamoDB delete result:', result);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'DELETE,OPTIONS'
      },
      body: JSON.stringify({ message: `Todo ${todoId} deleted successfully` })
    };
  } catch (err) {
    console.error('Failed to delete todo:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to delete todo', error: err.message })
    };
  }
}
