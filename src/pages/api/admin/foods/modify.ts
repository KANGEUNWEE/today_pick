import type { NextApiRequest, NextApiResponse } from 'next'
import { AppDataSource } from '@common/lib/ormconfig'
import { Food } from '@common/entity/Food'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!AppDataSource.isInitialized) await AppDataSource.initialize()
  const repo = AppDataSource.getRepository(Food)

  const code = Number(req.query.code)
  if (!code) return res.status(400).json({ message: 'code가 필요합니다.' })

  if (req.method === 'PUT') {
    const { name, category } = req.body
    if (!name || !category) return res.status(400).json({ message: 'name과 category가 필요합니다.' })

    const food = await repo.findOneBy({ code })
    if (!food) return res.status(404).json({ message: '해당 음식이 없습니다.' })

    food.name = name
    food.category = category
    const updated = await repo.save(food)

    return res.status(200).json({ message: '수정 완료', food: updated })
  }

  if (req.method === 'DELETE') {
    const food = await repo.findOneBy({ code })
    if (!food) return res.status(404).json({ message: '해당 음식이 없습니다.' })

    await repo.remove(food)
    return res.status(200).json({ message: '삭제 완료' })
  }

  return res.status(405).json({ message: '허용하지지 않은 메서드입니다.' })
}

