import type { NextApiRequest, NextApiResponse } from 'next'
import { AppDataSource } from '@common/lib/ormconfig'
import { User } from '@common/entity/User'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: '허용되지 않은 메서드입니다.' })
  }

  const { id, email, newPassword } = req.body

  if (!id || !email || !newPassword) {
    return res.status(400).json({ message: 'id, email, newPassword가 필요합니다.' })
  }

  try {
    if (!AppDataSource.isInitialized) await AppDataSource.initialize()
    const repo = AppDataSource.getRepository(User)

    const user = await repo.findOneBy({ id, email })
    if (!user) return res.status(404).json({ message: '해당 유저를 찾을 수 없습니다.' })

    user.password = newPassword
    await repo.save(user)

    return res.status(200).json({ message: '비밀번호가 성공적으로 변경되었습니다.' })
  } catch (err) {
    console.error('❌ 비밀번호 재설정 에러:', err)
    return res.status(500).json({ message: '서버 오류' })
  }
}
