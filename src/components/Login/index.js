import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class Login extends Component {
  state = {
    username: '',
    password: '',
    error: '',
  }

  tokenGet = jwtToken => {
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    const {history} = this.props
    history.replace('/')
  }

  loginApi = async userData => {
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userData),
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      this.setState({error: ''})
      this.tokenGet(data.jwt_token)
    } else {
      const data = await response.json()
      this.errorMsgCall(data)
    }
  }

  errorMsgCall = data => {
    this.setState({error: data})
  }

  onChangeInput = event => {
    const Name = event.target.name
    const Value = event.target.value
    this.setState(prev => ({...prev, [Name]: Value}))
  }

  onSubmitAll = event => {
    event.preventDefault()
    const {username, password} = this.state
    const userData = {username, password}
    this.loginApi(userData)
  }

  render() {
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    const {username, password, error} = this.state

    return (
      <div className="body-cont">
        <div className="login-container">
          <h1 className="main-heading">Login Form</h1>
          <form className="formContainer">
            <div className="input-container">
              <label htmlFor="userId" className="label">
                USERNAME
              </label>
              <input
                type="text"
                name="username"
                value={username}
                placeholder="Username"
                className="loginInput"
                id="userId"
                onChange={this.onChangeInput}
              />
            </div>
            <div className="input-container">
              <label htmlFor="passwordId" className="label">
                PASSWORD
              </label>
              <input
                type="password"
                name="password"
                value={password}
                placeholder="Password"
                className="loginInput"
                id="passwordId"
                onChange={this.onChangeInput}
              />
            </div>
            <button
              type="submit"
              className="submitButton"
              onClick={this.onSubmitAll}
            >
              Login
            </button>
            {error === '' ? null : (
              <p className="errorMsg">{error.error_msg}</p>
            )}
          </form>
        </div>
      </div>
    )
  }
}
export default Login
