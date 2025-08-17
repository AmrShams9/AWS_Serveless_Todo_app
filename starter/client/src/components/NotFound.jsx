import React from 'react'
import { Header, Button, Segment, Grid, Icon } from 'semantic-ui-react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

export function NotFound() {
  const navigate = useNavigate()

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
                  fontSize: '6em',
                  color: '#e74c3c',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
                  marginBottom: '0.5em'
                }}>
                  😵 404
                </Header>
              </motion.div>

              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.7 }}
              >
                <Header as="h2" style={{ 
                  color: '#2c3e50',
                  marginBottom: '1em'
                }}>
                  Oops! Page Not Found
                </Header>
              </motion.div>

              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.9 }}
              >
                <Header as="h4" style={{ 
                  color: '#7f8c8d',
                  fontWeight: 'normal',
                  marginBottom: '2em',
                  lineHeight: '1.6'
                }}>
                  The page you're looking for seems to have wandered off into the digital wilderness. 
                  Don't worry, let's get you back on track!
                </Header>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.1 }}
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    size="large"
                    onClick={() => navigate('/')}
                    style={{
                      borderRadius: '25px',
                      padding: '15px 40px',
                      fontSize: '1.2em',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      border: 'none',
                      color: 'white',
                      boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)'
                    }}
                  >
                    <Icon name="home" />
                    Back to Home
                  </Button>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1.3 }}
                style={{ marginTop: '2em' }}
              >
                <p style={{ 
                  color: '#95a5a6', 
                  fontSize: '1em',
                  fontStyle: 'italic'
                }}>
                  🧭 Lost in the digital maze? We've got your back!
                </p>
              </motion.div>
            </Segment>
          </motion.div>
        </Grid.Column>
      </Grid>
    </motion.div>
  )
}
