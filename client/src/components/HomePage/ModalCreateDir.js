import { Button, Card, Modal, TextField, Typography } from '@mui/material'
import { useContext, useState } from 'react'
import { createDir, getFiles } from '../../http/fileHttp'
import { observer } from 'mobx-react-lite'
import { Context } from '../..'

const ModalCreateDir = observer(({ isModalOpen, handleModalClose }) => {
  const { file } = useContext(Context)
  const [dirName, setDirName] = useState('')
  const createDirFunc = async () => {
    await createDir(file.getCurrentParent(), dirName)

    const data = await getFiles(file.getCurrentParent())
    file.setFiles(data)
    setDirName('')
    handleModalClose()
  }

  return (
    <Modal open={isModalOpen} onClose={handleModalClose}>
      <Card
        sx={{
          width: '300px',
          padding: '20px',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <Typography sx={{ padding: '10px 0px', textAlign: 'center' }}>
          Please enter dirrectory name
        </Typography>

        <TextField
          type="text"
          placeholder="Dirrectory name"
          size="small"
          value={dirName}
          onChange={(event) => setDirName(event.target.value)}
          fullWidth
        />

        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 2 }}
          onClick={() => createDirFunc()}
        >
          Create
        </Button>
      </Card>
    </Modal>
  )
})

export default ModalCreateDir
