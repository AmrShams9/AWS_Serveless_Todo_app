import { useAuth0 } from '@auth0/auth0-react'
import React from 'react'
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import { Grid, Menu, Segment } from 'semantic-ui-react'
import { motion, AnimatePresence } from 'framer-motion'

import { EditTodo } from './components/EditTodo'
import { LogIn } from './components/LogIn'
import { NotFound } from './components/NotFound'
import { Todos } from './components/Todos'

export default function App() {
  function generateMenu() {
    return (
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Menu inverted style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '0 0 20px 20px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          margin: '0 20px'
        }}>
          <Menu.Item as={Link} to={'/'} style={{ fontSize: '1.2em', fontWeight: 'bold' }}>
            🚀 TaskMaster Pro
          </Menu.Item>

          <Menu.Menu position="right">{logInLogOutButton()}</Menu.Menu>
        </Menu>
      </motion.div>
    )
  }

  function logInLogOutButton() {
    if (isAuthenticated) {
      return (
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Menu.Item 
            name="logout" 
            onClick={() => logout({ returnTo: window.location.origin })}
            style={{ 
              background: 'rgba(255,255,255,0.1)', 
              borderRadius: '25px',
              margin: '5px'
            }}
          >
            👋 Log Out
          </Menu.Item>
        </motion.div>
      )
    } else {
      return (
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Menu.Item 
            name="login" 
            onClick={() => loginWithRedirect()}
            style={{ 
              background: 'rgba(255,255,255,0.1)', 
              borderRadius: '25px',
              margin: '5px'
            }}
          >
            🔐 Log In
          </Menu.Item>
        </motion.div>
      )
    }
  }

  const { isAuthenticated, isLoading, loginWithRedirect, logout } = useAuth0()

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
    }}>
      <Segment style={{ padding: '2em 0em' }} vertical>
        <Grid container stackable verticalAlign="middle">
          <Grid.Row>
            <Grid.Column width={16}>
              <BrowserRouter>
                {generateMenu()}

                <AnimatePresence mode="wait">
                  {generateCurrentPage(isAuthenticated)}
                </AnimatePresence>
              </BrowserRouter>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    </div>
  )
}

function generateCurrentPage(isAuthenticated) {
  if (!isAuthenticated) {
    return (
      <motion.div
        key="login"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
      >
        <LogIn />
      </motion.div>
    )
  }

  return (
    <Routes>
      <Route path="/" exact element={
        <motion.div
          key="todos"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          <Todos />
        </motion.div>
      } />

      <Route path="/todos/:todoId/edit" exact element={
        <motion.div
          key="edit"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          <EditTodo />
        </motion.div>
      } />

      <Route path="*" element={
        <motion.div
          key="notfound"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          <NotFound />
        </motion.div>
      } />
    </Routes>
  )
}
