import type { NextApiRequest, NextApiResponse } from 'next'
import { AppDataSource } from '@common/lib/ormconfig'
import { Rating } from '@common/models/Rating'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: '허용되지 않은 메서드입니다.' })
  }

  const { food, score } = req.body
  if (!food || typeof score !== 'number') {
    return res.status(400).json({ message: 'food, score 값이 필요합니다.' })
  }

  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize()
    await AppDataSource.synchronize()
  }

  try {
    const ratingRepo = AppDataSource.getRepository(Rating)
    const newRating = ratingRepo.create({ food, score })
    await ratingRepo.save(newRating)

    return res.status(200).json({ message: '별점 저장 완료', data: newRating })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: '서버 에러' })
  }
}
