import { useAuth0 } from '@auth0/auth0-react'
import React from 'react'
import { Button, Header, Segment, Grid, Icon } from 'semantic-ui-react'
import { motion } from 'framer-motion'

export function LogIn() {
  const { loginWithRedirect } = useAuth0()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <Grid centered verticalAlign="middle" style={{ minHeight: '60vh' }}>
        <Grid.Column width={8}>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <Segment style={{
              borderRadius: '25px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
              border: '2px solid #e1e8ed',
              padding: '3em',
              textAlign: 'center',
              background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)'
            }}>
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <Header as="h1" style={{ 
                  fontSize: '3.5em',
                  color: '#2c3e50',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
                  marginBottom: '0.5em'
                }}>
                  🚀 Welcome to TaskMaster Pro
                </Header>
              </motion.div>

              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.7 }}
              >
                <Header as="h3" style={{ 
                  color: '#7f8c8d',
                  fontWeight: 'normal',
                  marginBottom: '2em',
                  lineHeight: '1.6'
                }}>
                  Your ultimate productivity companion for managing tasks, 
                  organizing projects, and achieving your goals with style and efficiency.
                </Header>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.9 }}
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    size="massive"
                    onClick={() => loginWithRedirect()}
                    style={{
                      borderRadius: '30px',
                      padding: '20px 50px',
                      fontSize: '1.3em',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      border: 'none',
                      color: 'white',
                      boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)'
                    }}
                  >
                    <Icon name="sign-in" />
                    Get Started - Sign In
                  </Button>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1.2 }}
                style={{ marginTop: '2em' }}
              >
                <p style={{ 
                  color: '#95a5a6', 
                  fontSize: '1em',
                  fontStyle: 'italic'
                }}>
                  🔐 Secure authentication powered by Auth0
                </p>
              </motion.div>
            </Segment>
          </motion.div>
        </Grid.Column>
      </Grid>
    </motion.div>
  )
}
