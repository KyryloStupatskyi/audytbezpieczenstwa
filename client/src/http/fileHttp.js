import { $authHost } from '.'

export const getFiles = async (parentId, sort) => {
  const { data } = await $authHost.get(
    `api/fileRoute/getFiles?parentId=${parentId ? parentId : ''}&sort=${
      sort ? sort : ''
    }`
  )

  return data
}

export const createDir = async (parentFileId, name) => {
  try {
    const { data } = await $authHost.post('api/fileRoute/createDir', {
      parentFileId,
      name,
    })
    return data
  } catch (error) {
    alert(error.response.data.message)
  }
}

export const deleteFile = async (id) => {
  try {
    const { data } = await $authHost.delete(
      `api/fileRoute/deleteFile?id=${id ? id : ''}`
    )
    return data
  } catch (error) {
    alert(error.response.data.message)
  }
}

export const uploadFile = async (file, parent) => {
  try {
    const formData = new FormData()

    formData.append('file', file)
    if (parent) {
      formData.append('parent', parent)
    }
    const { data } = await $authHost.post('api/fileRoute/uploadFile', formData)

    return data
  } catch (error) {
    alert(error.response.data.message)
  }
}

export const downloadFile = async (id) => {
  try {
    const data = await $authHost.get(
      `api/fileRoute/downloadFile?id=${id ? id : ''}`,
      {
        responseType: 'blob', // Указываем, что ожидаем Blob в ответе
      }
    )

    if (data.status === 200) {
      const blob = data.data // Данные blob находятся в response.data
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl

      // Имя файла можно получить из заголовков ответа или задать самостоятельно
      const contentDisposition = data.headers['content-disposition']
      let fileName = 'file'
      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="(.+)"/)
        if (fileNameMatch.length === 2) {
          fileName = fileNameMatch[1]
        }
      }
      link.download = fileName // Используем полученное или стандартное имя

      document.body.appendChild(link)
      link.click()
      link.remove()
    }
  } catch (error) {
    console.log(error)
  }
}
