import React from 'react'
import { useCookies } from 'react-cookie'
import axios from 'axios'
import { Header } from '../components/Header'
import { useNavigate } from 'react-router-dom'
import { URL, HOME } from '../const'
import { useListForm } from '../components/useListForm'
import '../scss/newList.scss'

export const NewList = () => {
  const [cookies] = useCookies()
  const navigation = useNavigate()
  const { title, errorMessage, handleTitleChange, setErrorMessage } = useListForm()
  const onCreateList = () => {
    const data = {
      title: title,
    }

    axios
      .post(`${URL}/lists`, data, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then(() => {
        navigation(HOME.PATH)
      })
      .catch((err) => {
        setErrorMessage(`リストの作成に失敗しました。${err}`)
      })
  }

  return (
    <div>
      <Header />
      <main className="new-list">
        <h2>リスト新規作成</h2>
        <p className="error-message">{errorMessage}</p>
        <form className="new-list-form">
          <label>タイトル</label>
          <br />
          <input type="text" onChange={handleTitleChange} className="new-list-title" value={title} />
          <br />
          <button type="button" onClick={onCreateList} className="new-list-button">
            作成
          </button>
        </form>
      </main>
    </div>
  )
}
