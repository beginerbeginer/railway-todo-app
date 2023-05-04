import React from 'react'
import { useCookies } from 'react-cookie'
import { useSelector, useDispatch } from 'react-redux/es/exports'
import { useNavigate } from 'react-router-dom'
import { signOut } from '../authSlice'
import '../scss/header.scss'
import { SIGNIN } from '../const'

export const Header = () => {
  const auth = useSelector((state) => state.auth.isSignIn)
  const dispatch = useDispatch()
  const navigation = useNavigate()
  const [_cookies, _setCookie, removeCookie] = useCookies()
  const handleSignOut = () => {
    dispatch(signOut())
    removeCookie('token')
    navigation(SIGNIN.PATH)
  }

  return (
    <header className="header">
      <h1>Todoアプリ</h1>
      {auth ? (
        <button onClick={handleSignOut} className="sign-out-button">
          サインアウト
        </button>
      ) : (
        <></>
      )}
    </header>
  )
}
