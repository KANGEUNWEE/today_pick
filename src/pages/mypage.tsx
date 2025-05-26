import { useContext } from 'react'
import { useRouter } from 'next/router'
import { UserContext } from 'src/contexts/UserContext'
import Link from 'next/link'

export default function MyPage() {
  const router = useRouter()
  const { user, setUser } = useContext(UserContext)

  const handleDelete = async () => {
    if (!confirm('정말 탈퇴하시겠습니까?')) return

    try {
      await fetch('/api/user/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: user?.id }),
      })

      localStorage.removeItem('user')
      setUser(null)
      alert('탈퇴가 완료되었습니다.')
      router.push('/')
    } catch (err) {
      console.error('❌ delete error:', err)
      alert('탈퇴 실패')
    }
  }

  if (!user) return <p>로그인이 필요합니다.</p>

  return (
    <main style={{ padding: '2rem' }}>
      <h1>🙋 마이페이지</h1>

      <p><strong>닉네임:</strong> {user.name}</p>
      <p><strong>성별:</strong> {user.gender}</p>
      <p><strong>이메일:</strong> {user.email}</p>
      <p><strong>나이대:</strong> {user.ageGroup}</p>

      <div style={{ marginTop: '1rem' }}>
        <Link href="/auth/edit">
          <button>✏️ 회원 정보 수정</button>
        </Link>
      </div>

      <div style={{ marginTop: '1rem' }}>
        <button onClick={handleDelete} style={{ color: 'red' }}>🗑️ 회원 탈퇴</button>
      </div>
    </main>
  )
}
