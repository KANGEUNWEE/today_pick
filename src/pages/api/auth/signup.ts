import type { NextApiRequest, NextApiResponse } from 'next'
import { AppDataSource } from '@common/lib/ormconfig'
import { User } from '@common/entity/User'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' })

  const { name, password, gender, ageGroup } = req.body

  try {
    if (!AppDataSource.isInitialized) await AppDataSource.initialize()

    const userRepo = AppDataSource.getRepository(User)
    const existing = await userRepo.findOneBy({ name })
    if (existing) return res.status(400).json({ message: '이미 존재하는 사용자입니다.' })

    const newUser = userRepo.create({ name, password, gender, ageGroup })
    const saved = await userRepo.save(newUser)

    return res.status(200).json({ message: '회원가입 성공', user: saved })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: '서버 오류' })
  }
}
