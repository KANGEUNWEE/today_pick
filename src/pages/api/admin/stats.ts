import type { NextApiRequest, NextApiResponse } from 'next'
import { AppDataSource } from '@common/lib/ormconfig'
import { Rating } from '@common/models/Rating'
import { User   } from '@common/entity/User'  
import { Between } from 'typeorm'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!AppDataSource.isInitialized) await AppDataSource.initialize()

  const ratingRepo = AppDataSource.getRepository(Rating)
  const userRepo = AppDataSource.getRepository(User)

  const { from, to } = req.query

  const dateFilter = from && to
    ? {
        createdAt: Between(new Date(from as string), new Date(to as string)),
      }
    : {}

  // 음식별 평균 평점
  const avgByFood = await ratingRepo
    .createQueryBuilder('rating')
    .select('rating.food', 'food')
    .addSelect('AVG(rating.score)', 'avg')
    .where(dateFilter)
    .groupBy('rating.food')
    .getRawMany()

  // 많이 평가된 음식 Top 5
  const topRatedFoods = await ratingRepo
    .createQueryBuilder('rating')
    .select('rating.food', 'food')
    .addSelect('COUNT(*)', 'count')
    .where(dateFilter)
    .groupBy('rating.food')
    .orderBy('count', 'DESC')
    .limit(5)
    .getRawMany()

  // 전체 유저 수
  const userCount = await userRepo.count()

  // 평점 분포
  const scoreDistribution = await ratingRepo
    .createQueryBuilder('rating')
    .select('rating.score', 'score')
    .addSelect('COUNT(*)', 'count')
    .where(dateFilter)
    .groupBy('rating.score')
    .orderBy('rating.score')
    .getRawMany()

  return res.status(200).json({
    avgByFood,
    topRatedFoods,
    userCount,
    scoreDistribution,
  })
}
