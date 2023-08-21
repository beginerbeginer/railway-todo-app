import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Header } from '../components/Header'
import axios from 'axios'
import { useCookies } from 'react-cookie'
import { URL, HOME } from '../const'
import { useNavigate, useParams } from 'react-router-dom'
import dayjs from 'dayjs'
import { getFormattedDeadLine } from '../util'
import '../scss/editTask.scss'

export const EditTask = () => {
  const navigation = useNavigate()
  const { listId, taskId } = useParams()
  const [cookies] = useCookies()
  const { register, handleSubmit, setValue, watch } = useForm()
  const onUpdateTask = async (data) => {
    const { title, detail, isDone, deadLine } = data
    const formattedData = {
      title,
      detail,
      done: isDone === 'done',
      limit: getFormattedDeadLine(deadLine),
    }

    try {
      await axios.put(`${URL}/lists/${listId}/tasks/${taskId}`, formattedData, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      navigation(HOME.PATH)
    } catch (err) {
      setValue('errorMessage', `更新に失敗しました。${err}`)
    }
  }

  const onDeleteTask = async () => {
    try {
      await axios.delete(`${URL}/lists/${listId}/tasks/${taskId}`, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      navigation(HOME.PATH)
    } catch (err) {
      setValue('errorMessage', `削除に失敗しました。${err}`)
    }
  }

  useEffect(() => {
    const fetchTaskData = async () => {
      try {
        const res = await axios.get(`${URL}/lists/${listId}/tasks/${taskId}`, {
          headers: {
            authorization: `Bearer ${cookies.token}`,
          },
        })
        const task = res.data
        setValue('title', task.title)
        setValue('detail', task.detail)
        setValue('isDone', task.done ? 'done' : 'todo')
        setValue('deadLine', dayjs(task.limit).format('YYYY-MM-DDTHH:mm'))
      } catch (err) {
        setValue('errorMessage', `タスク情報の取得に失敗しました。${err}`)
      }
    }

    fetchTaskData()
  }, [cookies.token, listId, taskId, setValue])

  return (
    <div>
      <Header />
      <main className="edit-task">
        <h2>タスク編集</h2>
        <p className="error-message">{watch('errorMessage')}</p>
        <form className="edit-task-form" onSubmit={handleSubmit(onUpdateTask)}>
          <label>タイトル</label>
          <br />
          <input type="text" {...register('title')} className="edit-task-title" />
          <br />
          <label>詳細</label>
          <br />
          <textarea type="text" {...register('detail')} className="edit-task-detail" />
          <br />
          <label>期限</label>
          <br />
          <input type="datetime-local" {...register('deadLine')} className="edit-task-due-date" />
          <br />
          <div>
            <input type="radio" id="todo" name="isDone" value="todo" {...register('isDone')} />
            未完了
            <input type="radio" id="done" name="isDone" value="done" {...register('isDone')} />
            完了
          </div>
          <button type="button" className="delete-task-button" onClick={onDeleteTask}>
            削除
          </button>
          <button type="submit" className="edit-task-button">
            更新
          </button>
        </form>
      </main>
    </div>
  )
}
