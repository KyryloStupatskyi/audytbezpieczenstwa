import { observer } from 'mobx-react-lite'
import NavBar from '../components/HomePage/NavBar'
import {
  Button,
  Card,
  Grid2,
  LinearProgress,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Skeleton,
  Typography,
} from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import { Context } from '..'
import EmailIcon from '@mui/icons-material/Email'
import UndoIcon from '@mui/icons-material/Undo'
import { deleteFile, downloadFile, getFiles } from '../http/fileHttp'
import FolderIcon from '@mui/icons-material/Folder'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'
import ImageIcon from '@mui/icons-material/Image'
import '../styles/pages/HomePage.scss'
import ModalCreateDir from '../components/HomePage/ModalCreateDir'
import ModalUploadFile from '../components/HomePage/ModalUploadFIle'

const HomePage = observer(() => {
  const { user, file } = useContext(Context)
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)

  const userSpace = {
    available: (+user.getUser().diskSpace / 1024 ** 3).toFixed(2),
    used: (+user.getUser().usedSpace / 1024 ** 3).toFixed(2),
  }

  const iconHandler = (type) => {
    switch (type) {
      case 'dir':
        return <FolderIcon sx={{ color: '#FFCF66', fontSize: '60px' }} />
      case 'png':
      case 'jpg':
        return <ImageIcon sx={{ fontSize: '60px' }} />
      default:
        return <InsertDriveFileIcon sx={{ fontSize: '60px' }} />
    }
  }

  useEffect(() => {
    const getData = async () => {
      const data = await getFiles()

      if (data) {
        file.setFiles(data)
      }

      setLoading(false)
    }

    getData()
  }, [])

  const moveDir = async (parentId) => {
    try {
      const data = await getFiles(parentId)
      file.setFiles(data)
      file.setParent(parentId)
    } catch (error) {
      alert(error.response.data.message)
    }
  }

  const moveBackDir = async () => {
    try {
      file.moveBackParent()
      const parent = file.getCurrentParent()
      const data = await getFiles(parent)
      file.setFiles(data)
    } catch (error) {
      alert(error)
    }
  }

  const sort = async (sortType) => {
    let data
    switch (sortType) {
      case 'type':
        data = await getFiles(file.getCurrentParent(), sortType)
        file.setFiles(data)
        break
      case 'date':
        data = await getFiles(file.getCurrentParent(), sortType)
        file.setFiles(data)
        break
      default:
        data = await getFiles()
        file.setFiles(data)
        break
    }
  }

  const deleteHandler = async (id) => {
    const message = await deleteFile(id)
    const data = await getFiles(file.getCurrentParent())

    file.setFiles(data)

    alert(message.message)
  }

  const downloadHandler = async (id) => {
    await downloadFile(id)
  }

  const handleModalClose = () => setIsModalOpen(false)
  const handleModalUploadClose = () => setIsUploadModalOpen(false)

  if (loading) {
    return <Skeleton variant="circular" />
  }
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <NavBar />
      <div
        style={{
          display: 'flex',
          gap: '5px',
          flexGrow: '1',
          padding: '10px',
        }}
      >
        <div
          className="left-side"
          style={{
            width: '25%',
            padding: '10px',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ display: 'flex', gap: '10px' }}>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => setIsModalOpen(true)}
            >
              + Create Dirrectory
            </Button>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => setIsUploadModalOpen(true)}
            >
              + Upload File
            </Button>
          </div>

          <Card
            sx={{ width: '100%', mt: 2, padding: '20px', textAlign: 'center' }}
          >
            <Typography sx={{ fontWeight: 'bold' }}>
              3.8 / {userSpace.available} GB
              <LinearProgress value={25} variant="determinate" />
              <Button variant="contained" fullWidth sx={{ mt: 2 }} color="info">
                Increase the capacity
              </Button>
            </Typography>
          </Card>

          <List>
            <ListItemButton
              onClick={async () => {
                const data = await getFiles()
                file.setFiles(data)
              }}
            >
              <ListItemIcon>
                <EmailIcon />
              </ListItemIcon>
              <ListItemText primary="Home page files" />
            </ListItemButton>

            <ListItemButton onClick={() => moveBackDir()}>
              <ListItemIcon>
                <UndoIcon />
              </ListItemIcon>
              <ListItemText primary="Back" />
            </ListItemButton>
          </List>
        </div>

        <div
          className="right-side"
          style={{
            width: '75%',
            padding: '10px',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              width: '100%',
              display: 'flex',
              gap: '10px',
              justifyContent: 'center',
            }}
          >
            <Button variant="contained" onClick={() => sort()}>
              Default
            </Button>
            <Button variant="contained" onClick={() => sort('date')}>
              Sort by date
            </Button>
            <Button variant="contained" onClick={() => sort('type')}>
              Sort by type
            </Button>
          </div>

          {!loading && Object.keys(file.getFiles()).length === 0 ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexGrow: '1',
              }}
            >
              <Typography>
                Your file cloud is empty. You can create new files or folders
                right now!
              </Typography>
            </div>
          ) : (
            <>
              <Grid2
                container
                spacing={1}
                alignItems={'center'}
                textAlign={'center'}
                mt={4}
                borderBottom={'1px solid black'}
                padding={'5px'}
              >
                <Grid2 size={1}>
                  <Typography>Type</Typography>
                </Grid2>
                <Grid2 size={7}>
                  <Typography>Name</Typography>
                </Grid2>
                <Grid2 size={2}>
                  <Typography>Date create</Typography>
                </Grid2>
                <Grid2 size={2}>
                  <Typography>Size</Typography>
                </Grid2>
              </Grid2>

              <Grid2
                container
                spacing={1}
                alignItems={'center'}
                textAlign={'center'}
                padding={'5px'}
              >
                {file.getFiles().map((item) => (
                  <div
                    key={item.id}
                    style={{
                      width: '100%',
                      gap: '8px',
                      textAlign: 'center',
                      display: 'flex',
                      alignItems: 'center',
                      cursor: 'pointer',
                    }}
                    className="list-item"
                    onClick={() => {
                      if (item.type === 'dir') {
                        moveDir(item.id)
                      }
                    }}
                  >
                    <Grid2 size={1}>
                      <Typography>{iconHandler(item.type)}</Typography>
                    </Grid2>
                    <Grid2 size={7}>
                      <Typography>{item.name}</Typography>
                    </Grid2>
                    <Grid2 size={2}>
                      <Typography className="list-item--date">
                        {item.createdAt && item.createdAt.slice(0, 10)}
                      </Typography>
                      <Button
                        className="downloadBtn"
                        variant="contained"
                        color="success"
                        onClick={(event) => {
                          event.stopPropagation()
                          downloadHandler(item.id)
                        }}
                      >
                        Download
                      </Button>
                    </Grid2>
                    <Grid2 size={2}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                          }}
                        >
                          <Typography className="list-item--size">
                            {item.size}
                          </Typography>
                          <Button
                            className="deleteBtn"
                            variant="contained"
                            color="error"
                            onClick={(event) => {
                              event.stopPropagation()
                              deleteHandler(item.id)
                            }}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </Grid2>
                  </div>
                ))}
              </Grid2>
            </>
          )}
        </div>
      </div>
      <ModalCreateDir
        isModalOpen={isModalOpen}
        handleModalClose={handleModalClose}
      />
      <ModalUploadFile
        isUploadModal={isUploadModalOpen}
        handleModalUploadClose={handleModalUploadClose}
      />
    </div>
  )
})

export default HomePage
