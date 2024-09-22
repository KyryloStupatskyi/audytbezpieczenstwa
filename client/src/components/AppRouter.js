import { Navigate, Route, Routes } from 'react-router-dom'
import AuthPage from '../pages/AuthPage'
import HomePage from '../pages/HomePage'
import { useContext } from 'react'
import { Context } from '..'
import { observer } from 'mobx-react-lite'

const AppRouter = observer(() => {
  const { user } = useContext(Context)
  return (
    <Routes>
      {user.getIsAuth() && <Route path="/homepage" element={<HomePage />} />}
      <Route path="/login" element={<AuthPage />} />
      <Route path="/registration" element={<AuthPage />} />
      <Route
        path="*"
        element={
          <Navigate to={user.getIsAuth() ? '/homepage' : '/login'} replace />
        }
      />
    </Routes>
  )
})

export default AppRouter
