import { Button, Card, Modal, TextField, Typography } from '@mui/material'
import { observer } from 'mobx-react-lite'
import { useContext, useState } from 'react'
import { Context } from '../..'
import { getFiles, uploadFile } from '../../http/fileHttp'

const ModalUploadFile = observer(
  ({ isUploadModal, handleModalUploadClose }) => {
    const { file } = useContext(Context)
    const [fileItem, setFileItem] = useState(null)

    const dataHandler = async () => {
      const curParrrent = file.getCurrentParent()
      await uploadFile(fileItem, curParrrent)
      const data = await getFiles(curParrrent)

      file.setFiles(data)
      handleModalUploadClose()
    }

    return (
      <Modal open={isUploadModal} onClose={handleModalUploadClose}>
        <Card
          sx={{
            width: '400px',
            padding: '20px',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <Typography sx={{ padding: '10px 0px', textAlign: 'center' }}>
            Please choose file to upload
          </Typography>

          <TextField
            placeholder="Dirrectory name"
            size="small"
            type="file"
            onChange={(event) => setFileItem(event.target.files[0])}
            fullWidth
          />

          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 2 }}
            onClick={() => dataHandler()}
          >
            Upload
          </Button>
        </Card>
      </Modal>
    )
  }
)

export default ModalUploadFile
