import React from 'react'
import { useSelector } from 'react-redux'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import { Home } from '../pages/Home'
import { NotFound } from '../pages/NotFound'
import { SignIn } from '../pages/SignIn'
import { NewTask } from '../pages/NewTask'
import { NewList } from '../pages/NewList'
import { EditTask } from '../pages/EditTask'
import { SignUp } from '../pages/SignUp'
import { EditList } from '../pages/EditList'
import { HOME, TASK, LIST, SIGNIN, SIGNUP } from '../const'

export const Router = () => {
  const auth = useSelector((state) => state.auth.isSignIn)

  return (
    <BrowserRouter>
      <Routes>
        <Route exact path={SIGNIN.PATH} element={<SignIn />} />
        <Route exact path={SIGNUP.PATH} element={<SignUp />} />
        {auth ? (
          <>
            <Route exact path={HOME.PATH} element={<Home />} />
            <Route exact path={TASK.NEW_PATH} element={<NewTask />} />
            <Route exact path={LIST.NEW_PATH} element={<NewList />} />
            <Route exact path={TASK.EDIT_PATH} element={<EditTask />} />
            <Route exact path={LIST.EDIT_PATH} element={<EditList />} />
          </>
        ) : (
          <Route path="*" element={<Navigate to={SIGNIN.PATH} />} />
        )}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
