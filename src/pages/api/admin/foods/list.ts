import type { NextApiRequest, NextApiResponse } from 'next'
import { AppDataSource } from '@common/lib/ormconfig'
import { Food } from '@common/entity/Food';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!AppDataSource.isInitialized) await AppDataSource.initialize()
  const repo = AppDataSource.getRepository(Food)

  if (req.method === 'GET') {
    const foods = await repo.find()
    return res.status(200).json({ foods })
  }

  if (req.method === 'POST') {
    const { code, category, name } = req.body
    const exists = await repo.findOneBy({ code })
    if (exists) return res.status(400).json({ message: '이미 존재하는 코드입니다.' })

    const newFood = repo.create({ code, category, name })
    const saved = await repo.save(newFood)
    return res.status(201).json({ message: '추가 완료', food: saved })
  }

  return res.status(405).json({ message: '허용되지 않은 메서드입니다.' })
}
