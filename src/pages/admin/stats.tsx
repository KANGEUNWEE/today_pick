import { useEffect, useState } from 'react'
import axios from 'axios'

interface StatResponse {
  avgByFood: { food: string; avg: string }[]
  topRatedFoods: { food: string; count: string }[]
  userCount: number
  scoreDistribution: { score: number; count: string }[]
}

export default function AdminStatsPage() {
  const [data, setData] = useState<StatResponse | null>(null)

  useEffect(() => {
    axios.get('/api/admin/stats').then((res) => {
      setData(res.data)
    })
  }, [])

  if (!data) return <p>로딩 중...</p>

  return (
    <main style={{ padding: '2rem' }}>
      <h1>📊 통계 대시보드</h1>

      <section>
        <h2>👥 전체 유저 수: {data.userCount}</h2>
      </section>

      <section>
        <h2>⭐ 음식별 평균 평점</h2>
        <ul>
          {data.avgByFood.map((item) => (
            <li key={item.food}>{item.food}: {Number(item.avg).toFixed(2)}점</li>
          ))}
        </ul>
      </section>

      <section>
        <h2>🔥 가장 많이 평가된 음식 Top 5</h2>
        <ul>
          {data.topRatedFoods.map((item) => (
            <li key={item.food}>{item.food} ({item.count}회)</li>
          ))}
        </ul>
      </section>

      <section>
        <h2>📈 평점 분포</h2>
        <ul>
          {data.scoreDistribution.map((item) => (
            <li key={item.score}>{item.score}점: {item.count}개</li>
          ))}
        </ul>
      </section>
    </main>
  )
}
