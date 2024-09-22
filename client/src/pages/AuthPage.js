import AuthForm from '../components/AuthPage/AuthForm'
import '../styles/pages/AuthPage.scss'

const AuthPage = () => {
  return (
    <>
      <div className="auth-container">
        <AuthForm />
      </div>
      <img src="/auth-bg.png" alt="loading" className="bg" />
      <div className="overlay" />
    </>
  )
}

export default AuthPage
