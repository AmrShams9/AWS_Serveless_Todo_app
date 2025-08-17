import { useAuth0 } from '@auth0/auth0-react'
import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button, Form, Header, Icon, Segment, Grid } from 'semantic-ui-react'
import { motion } from 'framer-motion'
import { getUploadUrl, uploadFile } from '../api/todos-api'

const UploadState = {
  NoUpload: 'NoUpload',
  FetchingPresignedUrl: 'FetchingPresignedUrl',
  UploadingFile: 'UploadingFile'
}

export function EditTodo() {
  function renderButton() {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div style={{ textAlign: 'center' }}>
          {uploadState === UploadState.FetchingPresignedUrl && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ color: '#667eea', fontSize: '1.1em' }}
            >
              🔄 Uploading image metadata...
            </motion.p>
          )}
          {uploadState === UploadState.UploadingFile && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ color: '#667eea', fontSize: '1.1em' }}
            >
              📤 Uploading file...
            </motion.p>
          )}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              loading={uploadState !== UploadState.NoUpload} 
              type="submit"
              size="large"
              style={{
                borderRadius: '25px',
                padding: '15px 40px',
                fontSize: '1.2em',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                color: 'white'
              }}
            >
              <Icon name="upload" />
              {uploadState === UploadState.NoUpload ? 'Upload Image' : 'Uploading...'}
            </Button>
          </motion.div>
        </div>
      </motion.div>
    )
  }

  function handleFileChange(event) {
    const files = event.target.files
    if (!files) return

    setFile(files[0])
  }

  async function handleSubmit(event) {
    event.preventDefault()

    try {
      if (!file) {
        alert('Please select a file to upload')
        return
      }

      setUploadState(UploadState.FetchingPresignedUrl)
      const accessToken = await getAccessTokenSilently({
        audience: `https://dev-vrcqihwbt0lygs6p.us.auth0.com/api/v2/`,
        scope: 'write:todo'
      })
      const uploadUrl = await getUploadUrl(accessToken, todoId)

      setUploadState(UploadState.UploadingFile)
      await uploadFile(uploadUrl, file)

      alert('🎉 Image uploaded successfully!')
      navigate('/')
    } catch (e) {
      alert('❌ Could not upload file: ' + e.message)
    } finally {
      setUploadState(UploadState.NoUpload)
    }
  }

  const [file, setFile] = useState(undefined)
  const [uploadState, setUploadState] = useState(UploadState.NoUpload)
  const { getAccessTokenSilently } = useAuth0()
  const { todoId } = useParams()
  const navigate = useNavigate()

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
            📸 Upload Image
          </Header>
          <Header as="h3" style={{ 
            color: '#7f8c8d',
            fontWeight: 'normal',
            marginTop: '0'
          }}>
            Add a visual attachment to your task
          </Header>
        </motion.div>
      </div>

      <Grid centered>
        <Grid.Column width={8}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Segment style={{
              borderRadius: '20px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              border: '2px solid #e1e8ed',
              padding: '2em'
            }}>
              <Form onSubmit={handleSubmit}>
                <Form.Field>
                  <label style={{ fontSize: '1.2em', color: '#2c3e50', marginBottom: '1em' }}>
                    📁 Select Image File
                  </label>
                  <motion.div whileHover={{ scale: 1.02 }}>
                    <input
                      type="file"
                      accept="image/*"
                      placeholder="Image to upload"
                      onChange={handleFileChange}
                      style={{
                        padding: '15px',
                        border: '2px dashed #667eea',
                        borderRadius: '15px',
                        width: '100%',
                        fontSize: '1.1em',
                        background: 'rgba(102, 126, 234, 0.05)'
                      }}
                    />
                  </motion.div>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    style={{ 
                      color: '#7f8c8d', 
                      fontSize: '0.9em', 
                      marginTop: '0.5em',
                      fontStyle: 'italic'
                    }}
                  >
                    Supported formats: JPG, PNG, GIF, WebP
                  </motion.p>
                </Form.Field>

                {renderButton()}
              </Form>
            </Segment>
          </motion.div>
        </Grid.Column>
      </Grid>
    </motion.div>
  )
}
