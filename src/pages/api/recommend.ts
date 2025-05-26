import type { NextApiRequest, NextApiResponse } from 'next'
import { AppDataSource } from '@common/lib/ormconfig'
import { Rating } from '@common/models/Rating'
import { Food } from '@common/entity/Food'


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
    await AppDataSource.synchronize();
  }

  const foodRepo = AppDataSource.getRepository(Food)
  const ratingRepo = AppDataSource.getRepository(Rating)

  // 1. 모든 카테고리 목록 불러오기
  const categories = await foodRepo
    .createQueryBuilder('food')
    .select('DISTINCT food.category', 'category')
    .getRawMany()

  const categoryList = categories.map((c) => c.category)
  const randomCategory = categoryList[Math.floor(Math.random() * categoryList.length)]

  // 2. 선택된 카테고리에서 음식 후보 불러오기
  const foodsInCategory = await foodRepo.findBy({ category: randomCategory })
  const foodList = foodsInCategory.map((f) => f.name)

  // 3. 최근 2.5점 이하 음식 제외
  const lowRatedRaw = await ratingRepo
  .createQueryBuilder('rating')
  .select('DISTINCT rating.food', 'food')
  .where('rating.score <= :threshold', { threshold: 2.5 })
  .getRawMany<{ food: string }>()

  const excludedFoods = lowRatedRaw.map((r) => r.food)
  console.log('⛔ 제외할 음식:', excludedFoods)

  // 4. 제외하고 남은 음식 후보
  const candidates = foodList.filter((f) => !excludedFoods.includes(f))
  console.log('🎯 추천 후보:', candidates)

  const randomFood =
    candidates.length > 0
      ? candidates[Math.floor(Math.random() * candidates.length)]
      : foodList[Math.floor(Math.random() * foodList.length)]

  return res.status(200).json({ category: randomCategory, food: randomFood })
}
