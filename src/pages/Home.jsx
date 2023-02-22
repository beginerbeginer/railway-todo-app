import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useCookies } from 'react-cookie'
import axios from 'axios'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import { Header } from '../components/Header'
import { URL, LIST, TASK } from '../const'
import './home.scss'
dayjs.extend(timezone)

export const Home = () => {
  const [isDoneDisplay, setIsDoneDisplay] = useState('todo') // todo->未完了 done->完了
  const [lists, setLists] = useState([])
  const [selectListId, setSelectListId] = useState()
  const [tasks, setTasks] = useState([])
  const [errorMessage, setErrorMessage] = useState('')
  const [cookies] = useCookies()
  const handleIsDoneDisplayChange = (e) => setIsDoneDisplay(e.target.value)
  useEffect(() => {
    axios
      .get(`${URL}/lists`, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then((res) => {
        setLists(res.data)
      })
      .catch((err) => {
        setErrorMessage(`リストの取得に失敗しました。${err}`)
      })
  }, [cookies.token])

  useEffect(() => {
    const listId = lists[0]?.id
    if (typeof listId !== 'undefined') {
      setSelectListId(listId)
      axios
        .get(`${URL}/lists/${listId}/tasks`, {
          headers: {
            authorization: `Bearer ${cookies.token}`,
          },
        })
        .then((res) => {
          setTasks(res.data.tasks)
        })
        .catch((err) => {
          setErrorMessage(`タスクの取得に失敗しました。${err}`)
        })
    }
  }, [cookies.token, lists])

  const handleSelectList = (id) => {
    setSelectListId(id)
    axios
      .get(`${URL}/lists/${id}/tasks`, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then((res) => {
        setTasks(res.data.tasks)
      })
      .catch((err) => {
        setErrorMessage(`タスクの取得に失敗しました。${err}`)
      })
  }

  const handleKeyDown = (event) => {
    const currentIndex = lists.findIndex((list) => list.id === selectListId)
    switch (event.key) {
      case 'Enter': {
        const id = event.target.id
        handleSelectList(id)
        break
      }
      case 'ArrowLeft': {
        const previousIndex = (currentIndex - 1 + lists.length) % lists.length
        const previousList = lists[previousIndex]
        setSelectListId(previousList.id)
        axios
          .get(`${URL}/lists/${previousList.id}/tasks`, {
            headers: {
              authorization: `Bearer ${cookies.token}`,
            },
          })
          .then((res) => {
            setTasks(res.data.tasks)
          })
          .catch((err) => {
            setErrorMessage(`タスクの取得に失敗しました。${err}`)
          })
        break
      }
      case 'ArrowRight': {
        const nextIndex = (currentIndex + 1) % lists.length
        const nextList = lists[nextIndex]
        setSelectListId(nextList.id)
        axios
          .get(`${URL}/lists/${nextList.id}/tasks`, {
            headers: {
              authorization: `Bearer ${cookies.token}`,
            },
          })
          .then((res) => {
            setTasks(res.data.tasks)
          })
          .catch((err) => {
            setErrorMessage(`タスクの取得に失敗しました。${err}`)
          })
        break
      }
      default:
        break
    }
  }

  const getRemainingTime = (limitDate) => {
    const diffTime = dayjs(limitDate).diff(dayjs())
    const formattedDate = dayjs(limitDate).tz(dayjs.tz.guess()).format('YYYY/MM/DD HH:mm')
    const remainingDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    const remainingHours = Math.floor((diffTime / (1000 * 60 * 60)) % 24)
    const remainingMinutes = Math.floor((diffTime / (1000 * 60)) % 60)
    const remainingSeconds = Math.floor((diffTime / 1000) % 60)

    if (remainingDays <= 0 && remainingHours <= 0 && remainingMinutes <= 0 && remainingSeconds <= 0) {
      return <span className="overdue">期限切れ</span>
    } else {
      return `${formattedDate}, 残り日時：${remainingDays}日${remainingHours}時間${remainingMinutes}分${remainingSeconds}秒`
    }
  }

  return (
    <div>
      <Header />
      <main className="taskList">
        <p className="error-message">{errorMessage}</p>
        <div>
          <div className="list-header">
            <h2>リスト一覧</h2>
            <div className="list-menu">
              <p>
                <Link to={LIST.NEW_PATH}>リスト新規作成</Link>
              </p>
              <p>
                <Link to={`/lists/${selectListId}/edit`}>選択中のリストを編集</Link>
              </p>
            </div>
          </div>
          <ul className="list-tab">
            {lists.map((list, key) => {
              const isActive = list.id === selectListId
              return (
                <li
                  key={key}
                  className={`list-tab-item ${isActive ? 'active' : ''}`}
                  onClick={() => handleSelectList(list.id)}
                  onKeyDown={handleKeyDown}
                  tabIndex={0}
                  id={list.id}
                  role="button"
                  aria-label={list.title}
                >
                  {list.title}
                </li>
              )
            })}
          </ul>
          <div className="tasks">
            <div className="tasks-header">
              <h2>タスク一覧</h2>
              <Link to={TASK.NEW_PATH}>タスク新規作成</Link>
            </div>
            <div className="display-select-wrapper">
              <select onChange={handleIsDoneDisplayChange} className="display-select">
                <option value="todo">未完了</option>
                <option value="done">完了</option>
              </select>
            </div>
            <Tasks
              tasks={tasks}
              selectListId={selectListId}
              isDoneDisplay={isDoneDisplay}
              getRemainingTime={getRemainingTime}
            />
          </div>
        </div>
      </main>
    </div>
  )
}

// 表示するタスク
const Tasks = (props) => {
  const { tasks, selectListId, isDoneDisplay, getRemainingTime } = props
  if (tasks === null) return <></>

  const filteredTasks = tasks.filter((task) => {
    return isDoneDisplay === 'done' ? task.done : !task.done
  })
  return (
    <ul>
      {filteredTasks.map((task, key) => {
        return (
          <li key={key} className="task-item">
            <Link to={`/lists/${selectListId}/tasks/${task.id}`} className="task-item-link">
              {task.title}
              <br />
              {task.done ? '完了' : '未完了'}, 期限：{getRemainingTime(task.limit)}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
