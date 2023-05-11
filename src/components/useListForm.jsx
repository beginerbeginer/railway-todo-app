import { useState } from 'react'

export const useListForm = (initialTitle = '') => {
  const [title, setTitle] = useState(initialTitle)
  const [errorMessage, setErrorMessage] = useState('')

  const handleTitleChange = (e) => setTitle(e.target.value)

  return {
    title,
    setTitle,
    errorMessage,
    setErrorMessage,
    handleTitleChange,
  }
}
