import type { NextApiRequest, NextApiResponse } from 'next'
import { AppDataSource } from '@common/lib/ormconfig'
import { User } from '@common/entity/User'

export const config = {
  api: {
    bodyParser: true,
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize()
    await AppDataSource.synchronize()
  }

  if (req.method === 'POST') {
    const { gender, ageGroup } = req.body

    if (!gender || !ageGroup) {
      return res.status(400).json({ message: '성별과 나이대가 필요합니다.' })
    }

    try {
      const userRepo = AppDataSource.getRepository(User)
      const newUser = userRepo.create({ gender, ageGroup })
      const savedUser = await userRepo.save(newUser)

      return res.status(201).json({ message: '회원가입 완료', user: savedUser })
    } catch (err) {
      console.error('회원가입 오류:', err)
      return res.status(500).json({ message: '서버 오류' })
    }
  }

  return res.status(405).json({ message: '허용되지 않은 메서드입니다.' })
}
