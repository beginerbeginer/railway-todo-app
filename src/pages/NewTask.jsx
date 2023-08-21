import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useCookies } from 'react-cookie'
import axios from 'axios'
import { URL, HOME } from '../const'
import { Header } from '../components/Header'
import { useNavigate } from 'react-router-dom'
import { getFormattedDeadLine } from '../util'
import '../scss/newTask.scss'

export const NewTask = () => {
  const { register, handleSubmit, setValue } = useForm()
  const [cookies] = useCookies()
  const navigation = useNavigate()
  const onCreateTask = async (data) => {
    const { selectListId, title, detail, deadLine } = data
    const formattedData = {
      title,
      detail,
      done: false,
      limit: getFormattedDeadLine(deadLine),
    }

    try {
      await axios.post(`${URL}/lists/${selectListId}/tasks`, formattedData, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      navigation(HOME.PATH)
    } catch (err) {
      setValue('errorMessage', `タスクの作成に失敗しました。${err}`)
    }
  }

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const res = await axios.get(`${URL}/lists`, {
          headers: {
            authorization: `Bearer ${cookies.token}`,
          },
        })
        setValue('lists', res.data)
        setValue('selectListId', res.data[0]?.id)
      } catch (err) {
        setValue('errorMessage', `リストの取得に失敗しました。${err}`)
      }
    }

    fetchLists()
  }, [cookies.token, setValue])

  return (
    <div>
      <Header />
      <main className="new-task">
        <h2>タスク新規作成</h2>
        <p className="error-message">{register('errorMessage').value}</p>
        <form className="new-task-form" onSubmit={handleSubmit(onCreateTask)}>
          <label>リスト</label>
          <br />
          <select {...register('selectListId')} className="new-task-select-list">
            {(register('lists').value || []).map((list, key) => (
              <option key={key} className="list-item" value={list.id}>
                {list.title}
              </option>
            ))}
          </select>
          <br />
          <label>タイトル</label>
          <br />
          <input type="text" {...register('title')} className="new-task-title" />
          <br />
          <label>詳細</label>
          <br />
          <textarea type="text" {...register('detail')} className="new-task-detail" />
          <br />
          <label>期限</label>
          <br />
          <input type="datetime-local" {...register('deadLine')} className="new-task-limit" />
          <br />
          <button type="submit" className="new-task-button">
            作成
          </button>
        </form>
      </main>
    </div>
  )
}
