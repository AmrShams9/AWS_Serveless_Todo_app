import { v4 as uuidv4 } from 'uuid';
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';

const dynamoDb = new DynamoDBClient();

export async function createTodo(event) {
  console.log('--- Incoming Event ---');
  console.log(JSON.stringify(event, null, 2));

  let userId = 'test-user'; // default for Postman testing
  if (event.requestContext?.authorizer?.principalId) {
    userId = event.requestContext.authorizer.principalId;
  }

  let newTodo;
  try {
    newTodo = JSON.parse(event.body);
  } catch (err) {
    console.error('Failed to parse JSON body:', err);
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Invalid JSON body' })
    };
  }

  if (!newTodo.name || !newTodo.dueDate) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing name or dueDate in request' })
    };
  }

  const todoId = uuidv4();
  const item = {
    userId: { S: userId },
    todoId: { S: todoId },
    createdAt: { S: new Date().toISOString() },
    name: { S: newTodo.name },
    dueDate: { S: newTodo.dueDate },
    done: { BOOL: false }
  };

  try {
    const command = new PutItemCommand({
      TableName: process.env.TODOS_TABLE,
      Item: item
    });

    const result = await dynamoDb.send(command);
    console.log('DynamoDB result:', result);

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST,OPTIONS'
      },
      body: JSON.stringify({ item })
    };
  } catch (err) {
    console.error('Failed to write to DynamoDB:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to create todo', error: err.message })
    };
  }
}
