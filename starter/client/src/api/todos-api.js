import Axios from 'axios'

export async function getTodos(idToken) {
  console.log('Fetching todos')

  const response = await Axios.get(
    `${process.env.REACT_APP_API_ENDPOINT}/todos`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`
      }
    }
  )
  console.log('Todos:', response.data)
  return response.data.items
}

export async function createTodo(idToken, newTodo) {
  const response = await Axios.post(
    `${process.env.REACT_APP_API_ENDPOINT}/todos`,
    JSON.stringify(newTodo),
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`
      }
    }
  )
  return response.data.item
}

export async function patchTodo(idToken, todoId, updatedTodo) {
  await Axios.patch(
    `${process.env.REACT_APP_API_ENDPOINT}/todos/${todoId}`,
    JSON.stringify(updatedTodo),
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`
      }
    }
  )
}

export async function deleteTodo(idToken, todoId) {
  await Axios.delete(`${process.env.REACT_APP_API_ENDPOINT}/todos/${todoId}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(idToken, todoId) {
  const response = await Axios.post(
    `${process.env.REACT_APP_API_ENDPOINT}/todos/${todoId}/attachment`,
    '',
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`
      }
    }
  )
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl, file) {
  await Axios.put(uploadUrl, file)
}


// REACT_APP_AUTH0_DOMAIN='dev-vrcqihwbt0lygs6p.us.auth0.com'
// REACT_APP_AUTH0_CLIENT_ID='2ACRQFFUptl3Wzt7JbklgVgTOKGOobQQ'
// REACT_APP_API_ENDPOINT='https://amc3p9fhy8.execute-api.us-east-1.amazonaws.com/dev'
