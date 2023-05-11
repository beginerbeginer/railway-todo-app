import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'

// 表示するタスク
export const Tasks = (props) => {
  const { tasks, selectListId, isDoneDisplay, getRemainingTime } = props
  const [focusedTaskId, setFocusedTaskId] = useState('')
  const taskRefs = useRef({})

  useEffect(() => {
    if (focusedTaskId && taskRefs.current[focusedTaskId]) {
      taskRefs.current[focusedTaskId].focus()
    }
  }, [focusedTaskId])

  if (tasks === null) return <></>

  const filteredTasks = tasks.filter((task) => {
    return isDoneDisplay === 'done' ? task.done : !task.done
  })

  // a11y:手の不自由なユーザーがキーボード操作でタスクの移動と選択ができるようにする処理
  const handleTaskNavigation = (event) => {
    const taskIds = filteredTasks.map((task) => task.id)
    const currentIndex = taskIds.indexOf(focusedTaskId)

    let newIndex

    switch (event.key) {
      case 'ArrowUp':
        newIndex = currentIndex - 1
        break
      case 'ArrowDown':
        newIndex = currentIndex + 1
        break
      case 'Enter': {
        if (taskRefs.current[focusedTaskId]) {
          taskRefs.current[focusedTaskId].click()
        }
        return
      }
      default:
        return
    }

    if (newIndex >= 0 && newIndex < filteredTasks.length) {
      setFocusedTaskId(taskIds[newIndex])
    }
  }

  return (
    <ul tabIndex={0} onKeyDown={handleTaskNavigation}>
      {filteredTasks.map((task, key) => {
        return (
          <li key={key} className="task-item" tabIndex={0} onFocus={() => setFocusedTaskId(task.id)}>
            <Link
              to={`/lists/${selectListId}/tasks/${task.id}`}
              className="task-item-link"
              id={`task-link-${task.id}`}
              ref={(el) => (taskRefs.current[task.id] = el)}
            >
              {task.title}
              <br />
              {task.done ? '完了' : '未完了'}, {getRemainingTime(task.limit)}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
