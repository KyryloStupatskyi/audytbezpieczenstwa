import { makeAutoObservable } from 'mobx'

export default class FileStore {
  constructor() {
    this._files = []
    this._parent = []
    makeAutoObservable(this)
  }

  setFiles(file) {
    this._files = file
  }

  getFiles() {
    return this._files
  }

  setParent(parentId) {
    this._parent.push(parentId)
  }

  moveBackParent() {
    this._parent.pop()
  }

  getCurrentParent() {
    return this._parent.at(-1)
  }

  zeroParent() {
    this._parent = []
  }
}
