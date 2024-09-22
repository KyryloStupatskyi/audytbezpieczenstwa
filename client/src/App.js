import { BrowserRouter } from 'react-router-dom'
import AppRouter from './components/AppRouter'
import { useContext, useEffect, useState } from 'react'
import { auth } from './http/authHttp'
import { Context } from '.'
import { Skeleton } from '@mui/material'
import { observer } from 'mobx-react-lite'

const App = observer(() => {
  const { user } = useContext(Context)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAuth = async () => {
      try {
        const data = await auth()

        if (data) {
          user.setUser(data)
          user.setIsAuth(true)
        }

        setLoading(false)
      } catch (error) {
        console.log(error)
      }
    }

    fetchAuth()
  }, [])

  if (loading) {
    return <Skeleton variant="circular" />
  }

  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  )
})

export default App
