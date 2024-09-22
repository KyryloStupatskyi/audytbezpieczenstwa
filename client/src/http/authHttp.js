import { $authHost, $host } from './index'
import { jwtDecode } from 'jwt-decode'

export const registration = async (email, password) => {
  try {
    if (!email || !password) {
      throw new Error('Login and password are required')
    }

    const { data } = await $host.post('/api/authRoute/registration', {
      email,
      password,
    })

    localStorage.setItem('token', data.token)

    return jwtDecode(data.token)
  } catch (error) {
    const validationErrors = error.response.data.message.errors
    if (validationErrors && validationErrors.length > 0) {
      alert(validationErrors[0].msg)
    } else {
      alert(error.response.data.message)
    }
  }
}

export const login = async (email, password) => {
  try {
    if (!email || !password) {
      throw new Error('Login and password are required')
    }

    const { data } = await $host.post('api/authRoute/login', {
      email,
      password,
    })

    localStorage.setItem('token', data.token)

    return jwtDecode(data.token)
  } catch (error) {
    const validationErrors = error.response.data.message.errors
    if (validationErrors && validationErrors.length > 0) {
      alert(validationErrors[0].msg)
    } else {
      alert(error.response.data.message)
    }
  }
}

export const auth = async () => {
  try {
    const { data } = await $authHost.get('api/authRoute/auth')

    if (data.token) {
      localStorage.setItem('token', data.token)
      return jwtDecode(data.token)
    }
  } catch (error) {}
}
