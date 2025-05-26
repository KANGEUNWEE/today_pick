import { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { UserContext } from 'src/contexts/UserContext'



export default function LoginPage() {
  const router = useRouter()
  const { setUser } = useContext(UserContext)
  const [id, setId] = useState('')
  const [password, setPassword] = useState('')
  const [autoLogin, setAutoLogin] = useState(false)

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser && autoLogin) {
      const user = JSON.parse(savedUser)
      alert(`${user.name}님 자동 로그인되었습니다.`)
      router.push('/')
    }
  })

  const handleLogin = async () => {
    try {
     const res = await axios.post('/api/auth/login', { id, password })
     const user = res.data.user

      setUser({
        id: user.id,
        name: user.name,
        gender: user.gender,
        ageGroup: user.ageGroup,
        email:user.email,
        })

      if (autoLogin) {
        localStorage.setItem('user', JSON.stringify(user))
      }

      alert(`${res.data.user.name}님 로그인 성공!`)
      router.push('/')

    } catch (err) {
      alert('로그인 실패: 아이디 또는 비밀번호를 확인하세요.')
      console.error('❌ login error:', err)
    }
  }

  return (
    <main style={{ padding: '2rem', maxWidth: 400, margin: '0 auto' }}>
      <h1>🔐 로그인</h1>

      <input
        type="text"
        placeholder="아이디"
        value={id}
        onChange={(e) => setId(e.target.value)}
        style={{ display: 'block', width: '100%', marginBottom: '1rem' }}
      />
      
      <br /><br />

      <input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ display: 'block', width: '100%', marginBottom: '1rem' }}
      />
      
      <br /><br />
      
      <label style={{ display: 'block', marginBottom: '1rem' }}>
        <input
          type="checkbox"
          checked={autoLogin}
          onChange={(e) => setAutoLogin(e.target.checked)}
        />{' '}
        자동 로그인
      </label>

      <button onClick={handleLogin} style={{ width: '100%', padding: '0.5rem' }}>
        로그인
      </button>

      <div style={{ marginTop: '1rem', textAlign: 'center' }}>
        <Link href="/auth/find-id">아이디 찾기</Link>
        <Link href="/auth/find-password">비밀번호 찾기</Link>
        <Link href="/auth/register">회원가입</Link>
      </div>

    </main>
  )
}
