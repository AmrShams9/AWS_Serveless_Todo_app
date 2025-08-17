import update from 'immutability-helper'
import React, { useEffect, useState } from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Image,
  Loader,
  Card,
  Label
} from 'semantic-ui-react'
import { motion, AnimatePresence } from 'framer-motion'

import { useAuth0 } from '@auth0/auth0-react'
import { useNavigate } from 'react-router-dom'
import { deleteTodo, getTodos, patchTodo } from '../api/todos-api'
import { NewTodoInput } from './NewTodoInput'

export function Todos() {
  function renderTodos() {
    if (loadingTodos) {
      return renderLoading()
    }

    return renderTodosList()
  }

  function renderTodosList() {
    return (
      <Grid padded>
        <AnimatePresence>
          {todos.map((todo, pos) => (
            <motion.div
              key={todo.todoId}
              initial={{ opacity: 0, x: -50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.9 }}
              transition={{ duration: 0.3, delay: pos * 0.1 }}
              layout
            >
              <Grid.Row>
                <Grid.Column width={16}>
                  <motion.div
                    whileHover={{ scale: 1.02, y: -2 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card fluid style={{ 
                      borderRadius: '15px',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                      border: todo.done ? '2px solid #4CAF50' : '2px solid transparent',
                      background: todo.done ? 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' : 'white'
                    }}>
                      <Card.Content>
                        <Grid>
                          <Grid.Row verticalAlign="middle">
                            <Grid.Column width={1}>
                              <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                                <Checkbox
                                  onChange={() => onTodoCheck(pos)}
                                  checked={todo.done}
                                  style={{ transform: 'scale(1.3)' }}
                                />
                              </motion.div>
                            </Grid.Column>
                            <Grid.Column width={8}>
                              <motion.div
                                animate={{ 
                                  textDecoration: todo.done ? 'line-through' : 'none',
                                  opacity: todo.done ? 0.6 : 1
                                }}
                                transition={{ duration: 0.3 }}
                              >
                                <Header as="h4" style={{ 
                                  color: todo.done ? '#666' : '#333',
                                  margin: 0
                                }}>
                                  {todo.name}
                                </Header>
                              </motion.div>
                            </Grid.Column>
                            <Grid.Column width={3}>
                              <Label 
                                color={todo.done ? 'green' : 'blue'} 
                                size="small"
                                style={{ borderRadius: '20px' }}
                              >
                                📅 {todo.dueDate}
                              </Label>
                            </Grid.Column>
                            <Grid.Column width={2}>
                              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <Button
                                  icon
                                  color="blue"
                                  onClick={() => onEditButtonClick(todo.todoId)}
                                  style={{ borderRadius: '50%', width: '40px', height: '40px' }}
                                >
                                  <Icon name="pencil" />
                                </Button>
                              </motion.div>
                            </Grid.Column>
                            <Grid.Column width={2}>
                              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <Button
                                  icon
                                  color="red"
                                  onClick={() => onTodoDelete(todo.todoId)}
                                  style={{ borderRadius: '50%', width: '40px', height: '40px' }}
                                >
                                  <Icon name="delete" />
                                </Button>
                              </motion.div>
                            </Grid.Column>
                          </Grid.Row>
                          {todo.attachmentUrl && (
                            <Grid.Row>
                              <Grid.Column width={16}>
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ duration: 0.5 }}
                                >
                                  <Image 
                                    src={todo.attachmentUrl} 
                                    size="small" 
                                    wrapped 
                                    style={{ 
                                      borderRadius: '10px',
                                      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                                    }}
                                  />
                                </motion.div>
                              </Grid.Column>
                            </Grid.Row>
                          )}
                        </Grid>
                      </Card.Content>
                    </Card>
                  </motion.div>
                </Grid.Column>
              </Grid.Row>
            </motion.div>
          ))}
        </AnimatePresence>
      </Grid>
    )
  }

  async function onTodoDelete(todoId) {
    try {
      const accessToken = await getAccessTokenSilently({
        audience: `https://dev-vrcqihwbt0lygs6p.us.auth0.com/api/v2/`,
        scope: 'delete:todo'
      })
      await deleteTodo(accessToken, todoId)
      setTodos(todos.filter((todo) => todo.todoId !== todoId))
    } catch (e) {
      alert('Todo deletion failed')
    }
  }

  async function onTodoCheck(pos) {
    try {
      const todo = todos[pos]
      const accessToken = await getAccessTokenSilently({
        audience: `https://dev-vrcqihwbt0lygs6p.us.auth0.com/api/v2/`,
        scope: 'write:todo'
      })
      await patchTodo(accessToken, todo.todoId, {
        name: todo.name,
        dueDate: todo.dueDate,
        done: !todo.done
      })
      setTodos(
        update(todos, {
          [pos]: { done: { $set: !todo.done } }
        })
      )
    } catch (e) {
      console.log('Failed to check a TODO', e)
      alert('Todo deletion failed')
    }
  }

  function onEditButtonClick(todoId) {
    navigate(`/todos/${todoId}/edit`)
  }

  const { user, getAccessTokenSilently } = useAuth0()
  const [todos, setTodos] = useState([])
  const [loadingTodos, setLoadingTodos] = useState(true)
  const navigate = useNavigate()

  console.log('User', {
    name: user.name,
    email: user.email
  })

  useEffect(() => {
    async function foo() {
      try {
        const accessToken = await getAccessTokenSilently({
          audience: `https://dev-vrcqihwbt0lygs6p.us.auth0.com/api/v2/`,
          scope: 'read:todos'
        })
        console.log('Access token: ' + accessToken)
        const todos = await getTodos(accessToken)
        setTodos(todos)
        setLoadingTodos(false)
      } catch (e) {
        alert(`Failed to fetch todos: ${e.message}`)
      }
    }
    foo()
  }, [getAccessTokenSilently])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div style={{ textAlign: 'center', marginBottom: '2em' }}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Header as="h1" style={{ 
            fontSize: '3em',
            color: '#2c3e50',
            textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
            marginBottom: '0.5em'
          }}>
            🎯 Your Tasks
          </Header>
          <Header as="h3" style={{ 
            color: '#7f8c8d',
            fontWeight: 'normal',
            marginTop: '0'
          }}>
            Stay organized and boost your productivity
          </Header>
        </motion.div>
      </div>

      <NewTodoInput onNewTodo={(newTodo) => setTodos([...todos, newTodo])} />

      {renderTodos(loadingTodos, todos)}
    </motion.div>
  )
}

function renderLoading() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ textAlign: 'center', padding: '4em' }}
    >
      <Loader indeterminate active inline="centered" size="large">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          🚀 Loading your tasks...
        </motion.div>
      </Loader>
    </motion.div>
  )
}
