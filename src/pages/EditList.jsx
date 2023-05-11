import React, { useEffect } from 'react'
import { useCookies } from 'react-cookie'
import { useNavigate, useParams } from 'react-router-dom'
import { Header } from '../components/Header'
import { URL, HOME } from '../const'
import { useListForm } from '../components/useListForm'
import axios from 'axios'
import '../scss/editList.scss'

export const EditList = () => {
  const navigation = useNavigate()
  const { listId } = useParams()
  const { title, setTitle, errorMessage, handleTitleChange, setErrorMessage } = useListForm()
  const [cookies] = useCookies()
  const onUpdateList = () => {
    const data = {
      title: title,
    }

    axios
      .put(`${URL}/lists/${listId}`, data, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then(() => {
        navigation(HOME.PATH)
      })
      .catch((err) => {
        setErrorMessage(`更新に失敗しました。 ${err}`)
      })
  }

  const onDeleteList = () => {
    axios
      .delete(`${URL}/lists/${listId}`, {
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
      .get(`${URL}/lists/${listId}`, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then((res) => {
        const list = res.data
        setTitle(list.title)
      })
      .catch((err) => {
        setErrorMessage(`リスト情報の取得に失敗しました。${err}`)
      })
  }, [cookies.token, listId, setTitle, setErrorMessage])

  return (
    <div>
      <Header />
      <main className="edit-list">
        <h2>リスト編集</h2>
        <p className="error-message">{errorMessage}</p>
        <form className="edit-list-form">
          <label>タイトル</label>
          <br />
          <input type="text" className="edit-list-title" value={title} onChange={handleTitleChange} />
          <br />
          <button type="button" className="delete-list-button" onClick={onDeleteList}>
            削除
          </button>
          <button type="button" className="edit-list-button" onClick={onUpdateList}>
            更新
          </button>
        </form>
      </main>
    </div>
  )
}
