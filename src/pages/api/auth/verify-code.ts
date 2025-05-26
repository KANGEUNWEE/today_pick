import type { NextApiRequest, NextApiResponse } from 'next'

// 간단한 메모리 기반 저장소 (실제 서비스에서는 Redis 등 사용 권장)
const codeStore = new Map<string, string>()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: '허용되지 않은 메서드입니다.' })
  }

  const { email, code } = req.body

  if (!email || !code) {
    return res.status(400).json({ message: '이메일과 인증번호가 필요합니다.' })
  }

  const savedCode = codeStore.get(email)

  if (!savedCode) {
    return res.status(400).json({ message: '인증번호가 요청되지 않았습니다.' })
  }

  if (savedCode !== code) {
    return res.status(400).json({ message: '인증번호가 일치하지 않습니다.' })
  }

  // 성공 후 코드 제거 (1회용)
  codeStore.delete(email)

  return res.status(200).json({ message: '인증 성공' })
}
