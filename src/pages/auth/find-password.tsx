import { useState } from 'react'
import axios from 'axios'

export default function FindPasswordPage() {
  const [id, setId] = useState('')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [serverCode, setServerCode] = useState('')
  const [step, setStep] = useState<'input' | 'verify' | 'reset' | 'done'>('input')
  const [newPassword, setNewPassword] = useState('')

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

  const verifyCode = () => {
    if (code !== serverCode) return alert('인증번호가 일치하지 않습니다.')
    setStep('reset')
  }

  const resetPassword = async () => {
    try {
      await axios.post('/api/auth/reset-password', { id, email, newPassword })
      alert('비밀번호가 재설정되었습니다.')
      setStep('done')
    } catch (err) {
      console.error('❌ 비밀번호 재설정 실패', err) 
      alert('비밀번호 재설정 실패')
    }
  }

  return (
    <main style={{ padding: '2rem' }}>
      <h1>🔑 비밀번호 찾기</h1>

      {step === 'input' && (
        <>
          <input
            type="text"
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="아이디 입력"
          />
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

      {step === 'reset' && (
        <>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="새 비밀번호 입력"
          />
          <button onClick={resetPassword}>비밀번호 재설정</button>
        </>
      )}

      {step === 'done' && (
        <p>✅ 비밀번호가 성공적으로 변경되었습니다. 로그인해주세요.</p>
      )}
    </main>
  )
}
