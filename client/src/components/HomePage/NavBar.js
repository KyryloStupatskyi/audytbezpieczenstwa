import {
  AppBar,
  Button,
  IconButton,
  InputAdornment,
  InputBase,
  Toolbar,
  Typography,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { observer } from 'mobx-react-lite'
import { useContext } from 'react'
import { Context } from '../..'

const NavBar = observer(() => {
  const { user, file } = useContext(Context)
  const logout = () => {
    user.setIsAuth(false)
    user.setUser({})
    file.setFiles([])
    file.zeroParent()
    localStorage.removeItem('token')
  }
  return (
    <AppBar position="static" sx={{ backgroundColor: '#1F1F1F', padding: '' }}>
      <Toolbar>
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
        >
          MYCLOUD
        </Typography>
        <div style={{ display: 'flex', gap: '10px' }}>
          <InputBase
            sx={{
              bgcolor: 'white',
              borderRadius: '20px',
              paddingLeft: 2,
              width: '250px',
            }}
            startAdornment={
              <InputAdornment position="start">
                <IconButton>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            }
            placeholder="Cloud search"
          />

          <Button variant="contained" onClick={() => logout()}>
            LogOut
          </Button>
        </div>
      </Toolbar>
    </AppBar>
  )
})

export default NavBar
