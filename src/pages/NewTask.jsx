import React, { useState, useEffect } from 'react'
import { useCookies } from 'react-cookie'
import axios from 'axios'
import { URL, HOME } from '../const'
import { Header } from '../components/Header'
import './newTask.scss'
import { useNavigate } from 'react-router-dom'
<<<<<<< HEAD
import { getFormattedDeadLine } from '../util'
=======
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
dayjs.locale('ja')
dayjs.extend(utc)
dayjs.extend(timezone)
>>>>>>> a689194 (追加：タスク新規作成画面に期限を追加。)

export const NewTask = () => {
  const [selectListId, setSelectListId] = useState()
  const [lists, setLists] = useState([])
  const [title, setTitle] = useState('')
  const [detail, setDetail] = useState('')
<<<<<<< HEAD
  const [deadLine, setDeadLine] = useState('')
=======
  const [limit, setLimit] = useState('')
>>>>>>> a689194 (追加：タスク新規作成画面に期限を追加。)
  const [errorMessage, setErrorMessage] = useState('')
  const [cookies] = useCookies()
  const navigation = useNavigate()
  const handleTitleChange = (e) => setTitle(e.target.value)
  const handleDetailChange = (e) => setDetail(e.target.value)
  const handleSelectList = (id) => setSelectListId(id)
<<<<<<< HEAD
  const handleDeadLineChange = (e) => setDeadLine(e.target.value)
=======
  const handleLimitChange = (e) => setLimit(e.target.value)
>>>>>>> a689194 (追加：タスク新規作成画面に期限を追加。)
  const onCreateTask = () => {
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const formattedLimit = dayjs.tz(limit, userTimezone).utc().format()

    const data = {
      title: title,
      detail: detail,
      done: false,
<<<<<<< HEAD
      limit: getFormattedDeadLine(deadLine),
=======
      limit: formattedLimit,
>>>>>>> a689194 (追加：タスク新規作成画面に期限を追加。)
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
          <input type="text" onChange={handleTitleChange} className="new-task-title" />
          <br />
          <label>詳細</label>
          <br />
          <textarea type="text" onChange={handleDetailChange} className="new-task-detail" />
          <br />
          <label>期限</label>
          <br />
<<<<<<< HEAD
          <input type="datetime-local" onChange={handleDeadLineChange} className="new-task-limit" />
=======
          <input type="datetime-local" onChange={handleLimitChange} className="new-task-limit" />
>>>>>>> a689194 (追加：タスク新規作成画面に期限を追加。)
          <br />
          <button type="button" className="new-task-button" onClick={onCreateTask}>
            作成
          </button>
        </form>
      </main>
    </div>
  )
}
