import type { NextApiRequest, NextApiResponse } from 'next'
import { AppDataSource } from '@common/lib/ormconfig'
import { Rating } from '@common/models/Rating'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize()
  }

  if (req.method === 'GET') {
    try {
      const ratingRepo = AppDataSource.getRepository(Rating)
      const ratings = await ratingRepo.find({
        order: { id: 'DESC' },
      })

      return res.status(200).json({ ratings })
    } catch (err) {
      console.error('❌ 어드민 rating 조회 에러:', err)
      return res.status(500).json({ message: '서버 에러' })
    }
  }

  return res.status(405).json({ message: '허용되지 않은 메서드입니다.' })
}
