import { NextApiRequest, NextApiResponse } from 'next'
import { AppDataSource } from '@common/lib/ormconfig'
import { User   } from '@common/entity/User'  

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!AppDataSource.isInitialized) await AppDataSource.initialize()
  const repo = AppDataSource.getRepository(User)

  if (req.method === 'GET') {
    const users = await repo.find({ select: ['id', 'name', 'gender', 'ageGroup'] })
    return res.status(200).json({ users })
  }

  return res.status(405).json({ message: '허용되지 않은 메서드입니다.' })
}
