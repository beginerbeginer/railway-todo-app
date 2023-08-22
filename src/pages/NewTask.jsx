import React, { useEffect, useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { useCookies } from 'react-cookie'
import axios from 'axios'
import { URL, HOME } from '../const'
import { Header } from '../components/Header'
import { useNavigate } from 'react-router-dom'
import { getFormattedDeadLine } from '../util'
import { SelectList } from '../components/TaskFormComponents/SelectList'
import { TextInput } from '../components/TaskFormComponents/TextInput'
import { TextArea } from '../components/TaskFormComponents/TextArea'
import { SubmitButton } from '../components/ButtonComponents/SubmitButton'
import '../scss/newTask.scss'

export const NewTask = () => {
  const { register, handleSubmit, setValue } = useForm()
  const [cookies] = useCookies()
  const navigation = useNavigate()

  // listsの状態とその更新関数を定義
  const [lists, setLists] = useState([])
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
        // APIから取得したデータをlistsの状態にセット
        setLists(res.data)
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
        <FormProvider register={register} setValue={setValue}>
          <form className="new-task-form" onSubmit={handleSubmit(onCreateTask)}>
            <SelectList lists={lists} />
            <TextInput name="title" label="タイトル" className="new-task-title" />
            <TextArea name="detail" label="詳細" className="new-task-detail" />
            <TextInput name="deadLine" label="期限" className="new-task-limit" type="datetime-local" />
            <SubmitButton text="作成" className="new-task-button" />
          </form>
        </FormProvider>
      </main>
    </div>
  )
}
