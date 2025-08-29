import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { deleteTodo } from '../../businessLogic/todos.mjs'
import { createLogger } from '../../utils/logger.mjs'
import { getUserId } from '../utils.mjs'

const logger = createLogger('http')

const deleteTodoHandler = async (event) => {
  logger.info('Starting deleteTodo event', {
    pathParameters: event.pathParameters,
    hasHeaders: Boolean(event.headers)
  })
  try {
    const { todoId } = event.pathParameters || {}
    if (!todoId) {
      logger.error('Missing todoId in pathParameters')
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing path parameter: todoId' })
      }
    }

    const userId = getUserId(event)
    await deleteTodo(userId, todoId)

    logger.info('Completing deleteTodo event')

    return {
      statusCode: 204
    }
  } catch (error) {
    logger.error('Error in deleteTodo handler', { error: error.message })
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to delete todo', message: error.message })
    }
  }
}

export const handler = middy(deleteTodoHandler)
  .use(httpErrorHandler())
  .use(cors({ credentials: true }))