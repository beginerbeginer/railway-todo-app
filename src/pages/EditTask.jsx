import React, { useEffect } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { Header } from '../components/Header'
import axios from 'axios'
import { useCookies } from 'react-cookie'
import { URL, HOME } from '../const'
import { useNavigate, useParams } from 'react-router-dom'
import dayjs from 'dayjs'
import { getFormattedDeadLine } from '../util'
import { TextInput } from '../components/TaskFormComponents/TextInput'
import { TextArea } from '../components/TaskFormComponents/TextArea'
import { SubmitButton } from '../components/ButtonComponents/SubmitButton'
import { DeleteButton } from '../components/ButtonComponents/DeleteButton'
import { RadioButton } from '../components/ButtonComponents/RadioButton'
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
        <FormProvider register={register} setValue={setValue}>
          <form className="edit-task-form" onSubmit={handleSubmit(onUpdateTask)}>
            <TextInput name="title" label="タイトル" className="edit-task-title" />
            <TextArea name="detail" label="詳細" className="edit-task-detail" />
            <TextInput name="deadLine" label="期限" className="edit-task-due-date" type="datetime-local" />
            <div>
              <RadioButton text="未完了" type="radio" id="todo" name="isDone" value="todo" {...register('isDone')} />
              <RadioButton text="完了" type="radio" id="done" name="isDone" value="done" {...register('isDone')} />
            </div>
            <DeleteButton text="削除" className="delete-task-button" onClick={onDeleteTask} />
            <SubmitButton text="更新" className="edit-task-button" />
          </form>
        </FormProvider>
      </main>
    </div>
  )
}
