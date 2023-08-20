import { useState } from 'react'

export const useTaskForm = (initialState = {}) => {
  const [formState, setFormState] = useState({
    title: initialState.title || '',
    detail: initialState.detail || '',
    deadLine: initialState.deadLine || '',
  })

  const handleChange = (field) => (e) => {
    setFormState((prev) => ({ ...prev, [field]: e.target.value }))
  }

  return {
    ...formState,
    setTitle: (value) => setFormState((prev) => ({ ...prev, title: value })),
    setDetail: (value) => setFormState((prev) => ({ ...prev, detail: value })),
    setDeadLine: (value) => setFormState((prev) => ({ ...prev, deadLine: value })),
    handleTitleChange: handleChange('title'),
    handleDetailChange: handleChange('detail'),
    handleDeadLineChange: handleChange('deadLine'),
  }
}
