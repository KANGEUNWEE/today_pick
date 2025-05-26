import type { NextApiRequest, NextApiResponse } from 'next'
import { AppDataSource } from "@common/lib/ormconfig"
import { Rating }     from "@common/models/Rating"
import { Food }       from "@common/entity/Food"
import { LessThanOrEqual } from 'typeorm'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize()
    await AppDataSource.synchronize()
    console.log('✅ DB 동기화 완료')
  }

  if (req.method === 'POST') {
    try {
      const ratingRepo = AppDataSource.getRepository(Rating)
      const foodRepo   = AppDataSource.getRepository(Food)

      // 1. 2.5점 이하를 받은 모든 음식 리스트 조회
      const lowRated = await ratingRepo.find({
        where: { score: LessThanOrEqual(2.5) }
      })
      const excludeFoods = Array.from(new Set(lowRated.map(r => r.food)))
      console.log('⛔ 제외할 음식:', excludeFoods)

      // 2. DB에서 전체 음식 목록 조회
      const allFoods = await foodRepo.find()
      const candidates = allFoods
        .map(f => f.name)
        .filter(name => !excludeFoods.includes(name))

      console.log('🎯 추천 후보:', candidates)

      // 3. 후보 중 무작위 선택, 후보가 없으면 fallback
      const newFood = candidates.length > 0
        ? candidates[Math.floor(Math.random() * candidates.length)]
        : allFoods[Math.floor(Math.random() * allFoods.length)].name

      return res.status(200).json({ food: newFood })
    } catch (err) {
      console.error('❌ retry error:', err)
      return res.status(500).json({ message: '서버 에러' })
    }
  }

  return res.status(405).json({ message: 'Method Not Allowed' })
}
