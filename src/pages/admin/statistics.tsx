import { useEffect, useState } from 'react'
import axios from 'axios'
import {  BarChart,  Bar,  XAxis,  YAxis,  Tooltip,  ResponsiveContainer,  PieChart, Pie,  Cell,  Legend,
} from 'recharts'

interface FoodAverage {
  food: string
  avg: string
}

interface TopRatedFood {
  food: string
  count: string
}

interface ScoreDistribution {
  score: string
  count: string
}

export default function StatisticsPage() {
  const [avgByFood, setAvgByFood] = useState<FoodAverage[]>([])
  const [topRatedFoods, setTopRatedFoods] = useState<TopRatedFood[]>([])
  const [userCount, setUserCount] = useState(0)
  const [scoreDistribution, setScoreDistribution] = useState<ScoreDistribution[]>([])

  useEffect(() => {
    const fetchStats = async () => {
      const res = await axios.get('/api/admin/stats')
      setAvgByFood(res.data.avgByFood)
      setTopRatedFoods(res.data.topRatedFoods)
      setUserCount(res.data.userCount)
      setScoreDistribution(res.data.scoreDistribution)
    }
    fetchStats()
  }, [])

  return (
    <main style={{ padding: '2rem' }}>
      <h1>📊 통계 대시보드</h1>
      <p>총 회원 수: <strong>{userCount}</strong>명</p>

      <section style={{ marginTop: '2rem' }}>
        <h2>🍽 음식별 평균 평점</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={avgByFood} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <XAxis dataKey="food" />
            <YAxis domain={[0, 5]} />
            <Tooltip />
            <Legend />
            <Bar dataKey="avg" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h2>⭐ 평점 분포</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={scoreDistribution}>
            <XAxis dataKey="score" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h2>🏆 인기 음식 Top 5</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={topRatedFoods}
              dataKey="count"
              nameKey="food"
              outerRadius={100}
              label
            >
              {topRatedFoods.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AA336A'][index % 5]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </section>
    </main>
  )
}
