import { useEffect, useState } from 'react'
import axios from 'axios'

interface Rating {
  id: number
  food: string
  score: number
}

export default function AdminPage() {
  const [ratings, setRatings] = useState<Rating[]>([])

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const res = await axios.get<{ ratings: Rating[] }>('/api/admin/ratings')
        setRatings(res.data.ratings)
      } catch (err) {
        console.error('어드민 데이터 로딩 실패:', err)
      }
    }

    fetchRatings()
  }, [])

  return (
    <main style={{ padding: '2rem' }}>
      <h1>📊 별점 내역 (Admin)</h1>
      <table border={1} cellPadding={10} style={{ marginTop: '1rem', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>음식</th>
            <th>평점</th>
          </tr>
        </thead>
        <tbody>
          {ratings.map(({ id, food, score }) => (
            <tr key={id}>
              <td>{id}</td>
              <td>{food}</td>
              <td>{score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}
