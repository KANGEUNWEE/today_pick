import type { NextApiRequest, NextApiResponse } from 'next'
import nodemailer from 'nodemailer'

const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' })

  const { email } = req.body
  if (!email) return res.status(400).json({ message: '이메일이 필요합니다.' })

  const code = generateCode()

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })

  const mailOptions = {
    from: `TODAY_PICK <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'TODAY_PICK 이메일 인증 코드',
    text: `인증 코드는 ${code} 입니다.`,
  }

  try {
    await transporter.sendMail(mailOptions)
    return res.status(200).json({ message: '인증 코드가 전송되었습니다.', code })
  } catch (error) {
    console.error('메일 전송 실패:', error)
    return res.status(500).json({ message: '메일 전송 실패' })
  }
}