import { useAuth0 } from '@auth0/auth0-react'
import dateFormat from 'dateformat'
import React, { useState } from 'react'
import { Divider, Grid, Input, Button, Icon } from 'semantic-ui-react'
import { motion } from 'framer-motion'
import { createTodo } from '../api/todos-api'

export function NewTodoInput({ onNewTodo }) {
  const [newTodoName, setNewTodoName] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  const { getAccessTokenSilently } = useAuth0()

  const onTodoCreate = async (event) => {
    if (!newTodoName.trim()) return
    
    try {
      setIsCreating(true)
      const accessToken = await getAccessTokenSilently({
        audience: `https://dev-vrcqihwbt0lygs6p.us.auth0.com/api/v2/`,
        scope: 'write:todos'
      })
      const dueDate = calculateDueDate()
      const createdTodo = await createTodo(accessToken, {
        name: newTodoName,
        dueDate
      })
      onNewTodo(createdTodo)
      setNewTodoName('')
    } catch (e) {
      console.log('Failed to created a new TODO', e)
      alert('Todo creation failed')
    } finally {
      setIsCreating(false)
    }
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      onTodoCreate(event)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <Grid.Row>
        <Grid.Column width={16}>
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div style={{
              background: 'white',
              borderRadius: '25px',
              padding: '20px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              border: '2px solid #e1e8ed'
            }}>
              <Grid>
                <Grid.Row verticalAlign="middle">
                  <Grid.Column width={12}>
                    <Input
                      fluid
                      size="large"
                      placeholder="✨ What would you like to accomplish today?"
                      value={newTodoName}
                      onChange={(event) => setNewTodoName(event.target.value)}
                      onKeyPress={handleKeyPress}
                      style={{
                        borderRadius: '20px',
                        fontSize: '1.1em'
                      }}
                    />
                  </Grid.Column>
                  <Grid.Column width={4}>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        color="teal"
                        size="large"
                        onClick={onTodoCreate}
                        loading={isCreating}
                        disabled={!newTodoName.trim()}
                        style={{
                          borderRadius: '20px',
                          padding: '15px 30px',
                          fontSize: '1.1em',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          border: 'none'
                        }}
                      >
                        <Icon name="plus" />
                        {isCreating ? 'Creating...' : 'Add Task'}
                      </Button>
                    </motion.div>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </div>
          </motion.div>
        </Grid.Column>
        <Grid.Column width={16}>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <Divider style={{ margin: '2em 0' }} />
          </motion.div>
        </Grid.Column>
      </Grid.Row>
    </motion.div>
  )
}

function calculateDueDate() {
  const date = new Date()
  date.setDate(date.getDate() + 7)

  return dateFormat(date, 'yyyy-mm-dd')
}
