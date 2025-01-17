import React, { useState } from 'react'
import axios from 'axios'
import { useCookies } from 'react-cookie'
import { useNavigate, Link, Navigate } from 'react-router-dom'
import { Header } from '../components/Header'
import { useDispatch, useSelector } from 'react-redux'
import { signIn } from '../authSlice'
import { URL, HOME, SIGNUP } from '../const'
import '../scss/signin.scss'

export const SignIn = () => {
  const auth = useSelector((state) => state.auth.isSignIn)
  const dispatch = useDispatch()
  const navigation = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState()
  const [_cookies, setCookie, _removeCookie] = useCookies()
  const handleEmailChange = (e) => setEmail(e.target.value)
  const handlePasswordChange = (e) => setPassword(e.target.value)
  const onSignIn = () => {
    axios
      .post(`${URL}/signin`, { email: email, password: password })
      .then((res) => {
        setCookie('token', res.data.token)
        dispatch(signIn())
        navigation(HOME.PATH)
      })
      .catch((err) => {
        setErrorMessage(`サインインに失敗しました。${err}`)
      })
  }

  if (auth) return <Navigate to={HOME.PATH} />

  return (
    <div>
      <Header />
      <main className="signin">
        <h2>サインイン</h2>
        <p className="error-message">{errorMessage}</p>
        <form className="signin-form">
          <label className="email-label">メールアドレス</label>
          <br />
          <input type="email" className="email-input" onChange={handleEmailChange} />
          <br />
          <label className="password-label">パスワード</label>
          <br />
          <input type="password" className="password-input" onChange={handlePasswordChange} />
          <br />
          <button type="button" className="signin-button" onClick={onSignIn}>
            サインイン
          </button>
        </form>
        <Link to={SIGNUP.PATH} className="signup-link">
          新規作成
        </Link>
      </main>
    </div>
  )
}
