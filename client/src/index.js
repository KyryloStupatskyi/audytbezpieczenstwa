import React, { createContext } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import UserStore from './store/UserStore'
import { CssBaseline } from '@mui/material'
import FileStore from './store/FileStore'

const root = ReactDOM.createRoot(document.getElementById('root'))

export const Context = createContext(null)

root.render(
  <Context.Provider
    value={{
      user: new UserStore(),
      file: new FileStore(),
    }}
  >
    <CssBaseline />
    <App />
  </Context.Provider>
)
