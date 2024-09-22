import { makeAutoObservable } from 'mobx'

export default class UserStore {
  constructor() {
    this._isAuth = false
    this._user = {}
    makeAutoObservable(this)
  }

  setIsAuth(newState) {
    this._isAuth = newState
  }

  getIsAuth() {
    return this._isAuth
  }

  setUser(user) {
    this._user = user
  }

  getUser() {
    return this._user
  }
}
