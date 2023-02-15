import React, { useEffect, useState } from 'react'
import { Header } from '../components/Header'
import axios from 'axios'
import { useCookies } from 'react-cookie'
import { URL, HOME } from '../const'
import { useNavigate, useParams } from 'react-router-dom'
import './editTask.css'

export const EditTask = () => {
  const navigation = useNavigate()
  const { listId, taskId } = useParams()
  const [cookies] = useCookies()
  const [title, setTitle] = useState('')
  const [detail, setDetail] = useState('')
  const [isDone, setIsDone] = useState()
  const [errorMessage, setErrorMessage] = useState('')
  const handleTitleChange = (e) => setTitle(e.target.value)
  const handleDetailChange = (e) => setDetail(e.target.value)
  const handleIsDoneChange = (e) => setIsDone(e.target.value === 'done')
  const onUpdateTask = () => {
    console.log(isDone)
    const data = {
      title: title,
      detail: detail,
      done: isDone,
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
        setTitle(task.title)
        setDetail(task.detail)
        setIsDone(task.done)
      })
      .catch((err) => {
        setErrorMessage(`タスク情報の取得に失敗しました。${err}`)
      })
  }, [cookies.token, listId, taskId])

  return (
    <div>
      <Header />
      <main className="edit-task">
        <h2>タスク編集</h2>
        <p className="error-message">{errorMessage}</p>
        <form className="edit-task-form">
          <label htmlFor="edit-task-title">タイトル</label>
          <br />
          <input
            type="text"
            id="edit-task-title"
            className="edit-task-title"
            value={title}
            onChange={handleTitleChange}
          />
          <br />
          <label htmlFor="edit-task-detail">詳細</label>
          <br />
          <textarea id="edit-task-detail" onChange={handleDetailChange} className="edit-task-detail" value={detail} />
          <br />
          <div>
            <input type="radio" id="todo" name="status" value="todo" onChange={handleIsDoneChange} checked={!isDone} />
            <label htmlFor="todo">未完了</label>
            <input type="radio" id="done" name="status" value="done" onChange={handleIsDoneChange} checked={isDone} />
            <label htmlFor="done">完了</label>
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
