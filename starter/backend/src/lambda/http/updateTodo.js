import { DynamoDBClient, UpdateItemCommand } from '@aws-sdk/client-dynamodb';

const dynamoDb = new DynamoDBClient();

export async function updateTodo(event) {
  console.log('--- Incoming Event ---');
  console.log(JSON.stringify(event, null, 2));

  const todoId = event.pathParameters?.todoId;
  const userId = event.requestContext?.authorizer?.principalId || 'test-user';

  if (!todoId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing todoId in path parameters' })
    };
  }

  let updatedTodo;
  try {
    updatedTodo = JSON.parse(event.body);
  } catch (err) {
    console.error('Invalid JSON in request body:', err);
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Invalid JSON in request body' })
    };
  }

  const command = new UpdateItemCommand({
    TableName: process.env.TODOS_TABLE,
    Key: {
      userId: { S: userId },
      todoId: { S: todoId }
    },
    UpdateExpression: 'set #n = :n, dueDate = :d, done = :done',
    ExpressionAttributeNames: { '#n': 'name' },
    ExpressionAttributeValues: {
      ':n': { S: updatedTodo.name },
      ':d': { S: updatedTodo.dueDate },
      ':done': { BOOL: !!updatedTodo.done }
    }
  });

  try {
    const result = await dynamoDb.send(command);
    console.log('DynamoDB update result:', result);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'PATCH,OPTIONS'
      },
      body: JSON.stringify({ message: 'Todo updated successfully' })
    };
  } catch (err) {
    console.error('Failed to update todo in DynamoDB:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to update todo', error: err.message })
    };
  }
}
