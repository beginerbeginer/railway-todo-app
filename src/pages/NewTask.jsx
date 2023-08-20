import React, { useState, useEffect } from 'react'
import { useCookies } from 'react-cookie'
import axios from 'axios'
import { URL, HOME } from '../const'
import { Header } from '../components/Header'
import { useNavigate } from 'react-router-dom'
import { getFormattedDeadLine } from '../util'
import { useTaskForm } from '../components/useTaskForm'
import '../scss/newTask.scss'

export const NewTask = () => {
  const [selectListId, setSelectListId] = useState()
  const [lists, setLists] = useState([])
  const [errorMessage, setErrorMessage] = useState('')
  const [cookies] = useCookies()
  const navigation = useNavigate()
  const taskForm = useTaskForm({})
  const handleSelectList = (id) => setSelectListId(id)

  const onCreateTask = () => {
    const data = {
      title: taskForm.title,
      detail: taskForm.detail,
      done: false,
      limit: getFormattedDeadLine(taskForm.deadLine),
    }

    axios
      .post(`${URL}/lists/${selectListId}/tasks`, data, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then(() => {
        navigation(HOME.PATH)
      })
      .catch((err) => {
        setErrorMessage(`タスクの作成に失敗しました。${err}`)
      })
  }

  useEffect(() => {
    axios
      .get(`${URL}/lists`, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then((res) => {
        setLists(res.data)
        setSelectListId(res.data[0]?.id)
      })
      .catch((err) => {
        setErrorMessage(`リストの取得に失敗しました。${err}`)
      })
  }, [cookies.token])

  return (
    <div>
      <Header />
      <main className="new-task">
        <h2>タスク新規作成</h2>
        <p className="error-message">{errorMessage}</p>
        <form className="new-task-form">
          <label>リスト</label>
          <br />
          <select onChange={(e) => handleSelectList(e.target.value)} className="new-task-select-list">
            {lists.map((list, key) => (
              <option key={key} className="list-item" value={list.id}>
                {list.title}
              </option>
            ))}
          </select>
          <br />
          <label>タイトル</label>
          <br />
          <input type="text" onChange={taskForm.handleTitleChange} className="new-task-title" />
          <br />
          <label>詳細</label>
          <br />
          <textarea type="text" onChange={taskForm.handleDetailChange} className="new-task-detail" />
          <br />
          <label>期限</label>
          <br />
          <input type="datetime-local" onChange={taskForm.handleDeadLineChange} className="new-task-limit" />
          <br />
          <button type="button" className="new-task-button" onClick={onCreateTask}>
            作成
          </button>
        </form>
      </main>
    </div>
  )
}
