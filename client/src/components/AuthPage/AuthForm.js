import { Button, TextField, Typography } from '@mui/material'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { useContext, useState } from 'react'
import { login, registration } from '../../http/authHttp'
import { Context } from '../..'
import '../../styles/components/AuthForm.scss'

const AuthForm = observer(() => {
  const location = useLocation()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPass, setConfirmPass] = useState('')

  const { user } = useContext(Context)

  const isLogin = location.pathname === '/login'
  const to = isLogin ? '/registration' : '/login'

  const sendData = async () => {
    try {
      if (!isLogin && password !== confirmPass) {
        throw new Error(
          'Passwords do not match. Please make sure both passwords are identical'
        )
      }

      let data
      if (isLogin) {
        data = await login(email, password)
        console.log(data)
      } else {
        data = await registration(email, password)
      }

      if (data) {
        user.setUser(data)
        user.setIsAuth(true)
        navigate('/homepage')
      }
    } catch (error) {
      alert(error.message)
    }
  }

  return (
    <div className="auth-form">
      <Typography
        sx={{
          textAlign: 'center',
          fontSize: '25px',
          fontWeight: 'bold',
          borderBottom: '1px solid black',
        }}
      >
        {isLogin ? 'Login' : 'Registration'}
      </Typography>

      <div className="form-item">
        <Typography variant="h6">Please enter your email address</Typography>
        <TextField
          type="text"
          id="login"
          placeholder="Login"
          size="small"
          onChange={(event) => setEmail(event.target.value)}
          value={email}
          fullWidth
        />
      </div>

      <div className="form-item">
        <Typography variant="h6">Please enter your password</Typography>
        <TextField
          type="password"
          id="password"
          placeholder="Password"
          size="small"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          fullWidth
        />
      </div>

      {!isLogin ? (
        <div className="form-item">
          <Typography variant="h6">Confirm your password</Typography>
          <TextField
            type="password"
            id="confirmPass"
            placeholder="Confirm password"
            size="small"
            value={confirmPass}
            onChange={(event) => setConfirmPass(event.target.value)}
            fullWidth
          />
        </div>
      ) : (
        ''
      )}

      <Button
        variant="contained"
        fullWidth
        sx={{ mt: 1 }}
        onClick={() => sendData(email, password)}
      >
        {isLogin ? 'Login' : 'Register'}
      </Button>
      <NavLink to={to} style={{ textAlign: 'center' }}>
        {isLogin
          ? 'Dont have an account yet? Register!'
          : 'Already have account? Login!'}
      </NavLink>
    </div>
  )
})

export default AuthForm
