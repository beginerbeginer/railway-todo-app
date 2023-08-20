import React, { useEffect, useState } from 'react'
import { Header } from '../components/Header'
import axios from 'axios'
import { useCookies } from 'react-cookie'
import { URL, HOME } from '../const'
import { useNavigate, useParams } from 'react-router-dom'
import dayjs from 'dayjs'
import { getFormattedDeadLine } from '../util'
import { useTaskForm } from '../components/useTaskForm'
import '../scss/editTask.scss'

export const EditTask = () => {
  const navigation = useNavigate()
  const { listId, taskId } = useParams()
  const [cookies] = useCookies()
  const [isDone, setIsDone] = useState()
  const [errorMessage, setErrorMessage] = useState('')
  const taskForm = useTaskForm({})
  const handleIsDoneChange = (e) => setIsDone(e.target.value === 'done')

  const onUpdateTask = () => {
    console.log(isDone)
    const data = {
      title: taskForm.title,
      detail: taskForm.detail,
      done: isDone,
      limit: getFormattedDeadLine(taskForm.deadLine),
    }

    axios
      .put(`${URL}/lists/${listId}/tasks/${taskId}`, data, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then((res) => {
        console.log(res.data)
        navigation(HOME.PATH)
      })
      .catch((err) => {
        setErrorMessage(`更新に失敗しました。${err}`)
      })
  }

  const onDeleteTask = () => {
    axios
      .delete(`${URL}/lists/${listId}/tasks/${taskId}`, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then(() => {
        navigation(HOME.PATH)
      })
      .catch((err) => {
        setErrorMessage(`削除に失敗しました。${err}`)
      })
  }

  useEffect(() => {
    axios
      .get(`${URL}/lists/${listId}/tasks/${taskId}`, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then((res) => {
        const task = res.data
        taskForm.setTitle(task.title)
        taskForm.setDetail(task.detail)
        setIsDone(task.done)
        taskForm.setDeadLine(dayjs(task.limit).format('YYYY-MM-DDTHH:mm'))
      })
      .catch((err) => {
        setErrorMessage(`タスク情報の取得に失敗しました。${err}`)
      })
  }, [cookies.token, listId, taskId, taskForm])

  return (
    <div>
      <Header />
      <main className="edit-task">
        <h2>タスク編集</h2>
        <p className="error-message">{errorMessage}</p>
        <form className="edit-task-form">
          <label>タイトル</label>
          <br />
          <input type="text" onChange={taskForm.handleTitleChange} className="edit-task-title" value={taskForm.title} />
          <br />
          <label>詳細</label>
          <br />
          <textarea
            type="text"
            onChange={taskForm.handleDetailChange}
            className="edit-task-detail"
            value={taskForm.detail}
          />
          <br />
          <label>期限</label>
          <br />
          <input
            type="datetime-local"
            onChange={taskForm.handledeadLineChange}
            className="edit-task-due-date"
            value={taskForm.deadLine}
          />
          <br />
          <div>
            <input
              type="radio"
              id="todo"
              name="status"
              value="todo"
              onChange={handleIsDoneChange}
              checked={isDone === false ? 'checked' : ''}
            />
            未完了
            <input
              type="radio"
              id="done"
              name="status"
              value="done"
              onChange={handleIsDoneChange}
              checked={isDone === true ? 'checked' : ''}
            />
            完了
          </div>
          <button type="button" className="delete-task-button" onClick={onDeleteTask}>
            削除
          </button>
          <button type="button" className="edit-task-button" onClick={onUpdateTask}>
            更新
          </button>
        </form>
      </main>
    </div>
  )
}
