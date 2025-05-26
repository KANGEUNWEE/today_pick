import type { NextApiRequest, NextApiResponse } from 'next'
import { AppDataSource } from '@common/lib/ormconfig'
import { User } from '@common/entity/User'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') return res.status(405).json({ message: 'Method Not Allowed' })

  const { id } = req.body
  if (!id) return res.status(400).json({ message: 'id 필요' })

  try {
    if (!AppDataSource.isInitialized) await AppDataSource.initialize()
    const userRepo = AppDataSource.getRepository(User)
    const user = await userRepo.findOneBy({ id })

    if (!user) return res.status(404).json({ message: '사용자를 찾을 수 없음' })

    await userRepo.remove(user)
    return res.status(200).json({ message: '회원 탈퇴 완료' })
  } catch (err) {
    console.error('❌ 탈퇴 오류:', err)
    return res.status(500).json({ message: '서버 오류' })
  }
}