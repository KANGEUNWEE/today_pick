import type { NextApiRequest, NextApiResponse } from 'next'
import { AppDataSource } from '@common/lib/ormconfig'
import { User } from '@common/entity/User'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

  try {
    if (!AppDataSource.isInitialized) await AppDataSource.initialize()
    const userRepo = AppDataSource.getRepository(User)

    const { id, password, gender, ageGroup, name } = req.body

    const user = await userRepo.findOneBy({ id })
    if (!user) return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' })

    user.password = password || user.password
    user.gender = gender || user.gender
    user.ageGroup = ageGroup || user.ageGroup
    user.name = name || user.name

    const saved = await userRepo.save(user)
    return res.status(200).json({ message: '수정 완료', user: saved })
  } catch (err) {
    console.error('❌ 사용자 정보 수정 오류:', err)
    return res.status(500).json({ message: '서버 오류' })
  }
}
