import { useEffect, useContext } from 'react'
import { useRouter } from 'next/router'
import { UserContext } from 'src/contexts/UserContext'

export default function Header() {
const { user, setUser } = useContext(UserContext)
const router = useRouter()

   const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('user')
    alert('로그아웃 되었습니다.')
    router.push('/auth/login')
  }


  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setUser(parsed)
      } catch {
        localStorage.removeItem('user')
      }
    }
  }, [])

  return (
     <header style={{ padding: '1rem', background: '#eee' }}>
      {user ? (
        <>
          <span>👋 {user.name}님</span>
          <button onClick={handleLogout} style={{ marginLeft: '1rem' }}>
            로그아웃
          </button>
        </>
      ) : (
        <span>로그인이 필요합니다.</span>
      )}
    </header>
  )
}