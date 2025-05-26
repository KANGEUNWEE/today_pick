import type { NextApiRequest, NextApiResponse } from 'next'
import { AppDataSource } from '@common/lib/ormconfig'
import { User   } from '@common/entity/User'  

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

  const { name, password } = req.body

  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize()
    }

    const userRepo = AppDataSource.getRepository(User)
    const user = await userRepo.findOneBy({ name })

    if (!user || user.password !== password) {
      return res.status(401).json({ message: '아이디 또는 비밀번호가 일치하지 않습니다.' })
    }

    return res.status(200).json({ message: '로그인 성공'
        , user })
  } catch (err) {
    console.error('❌ 로그인 에러:', err)
    return res.status(500).json({ message: '서버 오류' })
  }
}