import { useState } from 'react'
import axios from 'axios'

export default function FindIdPage() {
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [serverCode, setServerCode] = useState('')
  const [step, setStep] = useState<'input' | 'verify' | 'done'>('input')
  const [foundId, setFoundId] = useState('')

  const sendCode = async () => {
    try {
      const res = await axios.post('/api/auth/send-code', { email })
      setServerCode(res.data.code)
      setStep('verify')
      alert('인증번호가 전송되었습니다.')
    } catch (err) {
      console.error('❌ 인증번호 전송 실패:', err)  
      alert('인증번호 전송 실패')
    }
  }

  const verifyCode = async () => {
    if (code !== serverCode) return alert('인증번호가 일치하지 않습니다.')

    try {
      const res = await axios.post('/api/auth/find-id', { email })
      setFoundId(res.data.id)
      setStep('done')
    } catch (err) {
      console.error('❌ 아이디 조회 실패:', err)
      alert('아이디 조회 실패')
    }
  }

  return (
    <main style={{ padding: '2rem' }}>
      <h1>🔍 아이디 찾기</h1>

      {step === 'input' && (
        <>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="가입한 이메일 입력"
          />
          <button onClick={sendCode}>인증번호 발송</button>
        </>
      )}

      {step === 'verify' && (
        <>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="인증번호 입력"
          />
          <button onClick={verifyCode}>확인</button>
        </>
      )}

      {step === 'done' && (
        <p>✅ 가입한 아이디는 <strong>{foundId}</strong> 입니다.</p>
      )}
    </main>
  )
}
