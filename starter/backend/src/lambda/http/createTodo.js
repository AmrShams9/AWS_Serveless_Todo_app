import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { createTodo } from '../../businessLogic/todos.mjs'
import { createLogger } from '../../utils/logger.mjs'
import { getUserId } from '../utils.mjs'

const logger = createLogger('http')

const createTodoHandler = async (event) => {
  logger.info('Starting createTodo event')

  try {
    const newTodo = JSON.parse(event.body)
    const userId = getUserId(event)
    const item = await createTodo(newTodo, userId)

    logger.info('Completing createTodo event')

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        item // ✅ fixed: use "item" instead of "newItem"
      })
    }
  } catch (error) {
    logger.error('Error creating todo', { error })
    throw error
  }
}
  


export const handler = middy(createTodoHandler)
  .use(httpErrorHandler())
  .use(cors({ credentials: true }))