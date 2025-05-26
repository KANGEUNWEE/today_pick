import { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import { UserContext } from 'src/contexts/UserContext'

export default function Home() {
  const router = useRouter()
  const { user } = useContext(UserContext)
  const [food, setFood] = useState<string>('')
  const [score, setScore] = useState<number>(0)

  useEffect(() => {
    if (!user) {
      alert('로그인이 필요합니다.')
      router.push('/auth/login')
    }
  }, [user])

  const getRecommendation = async () => {
    try {
      const res = await axios.get('/api/recommend') as { data: { food: string } }
      const recommended = res.data.food || '김치찌개'
      setFood(recommended)
    } catch (err) {
      console.error('추천 오류:', err)
    }
  }

  const submitRating = async () => {
    try {
      await axios.post('/api/rate', { food, score })
      if (score <= 2.5) {
        setTimeout(() => alert('새로운 추천이 도착했어요!'), 300)
        await getRecommendation()
        setScore(0)
      } else {
        alert('별점이 저장되었습니다.')
      }
    } catch (err) {
      console.error('평가 오류:', err)
    }
  }

  const retry = async () => {
    try {
      const res = await axios.post('/api/retry', { food, score }) as { data: { food: string } }
      const newFood = res.data.food || '비빔밥'
      setFood(newFood)
      setScore(0)
    } catch (err) {
      console.error('재추천 오류:', err)
    }
  }

 return (
    <main style={{ padding: '2rem' }}>
      <h1>🍱 오늘 뭐 먹지?</h1>
      {user && <p>👤 {user.name}님</p>}

      <button onClick={getRecommendation}>음식 추천 받기</button>

      {food && (
        <>
          <p>추천 음식: <strong>{food}</strong></p>
          <input
            type="number"
            min="0"
            max="5"
            step="0.5"
            value={score}
            onChange={(e) => setScore(Number(e.target.value))}
            placeholder="별점 입력 (0~5)"
          />
          <button onClick={submitRating}>⭐ 별점 제출</button>

          {score > 0 && score <= 2.5 && (
            <button onClick={retry} style={{ marginLeft: '1rem' }}>
              🔁 재추천 요청
            </button>
          )}
        </>
      )}
    </main>
  )
}
