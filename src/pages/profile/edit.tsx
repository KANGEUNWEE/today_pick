import { useState, useContext } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import { UserContext } from 'src/contexts/UserContext'

function getRandomNickname(): string {
  const adjectives = ['귀여운', '배고픈', '신난', '용감한', '즐거운', '밝은', '예쁜', '멋진','반가운', '엄청난', '희망찬', '행복한', '사랑스러운'
    , '매혹적인', '빛나는', '우아한', '세련된', '신성한', '위대한', '화려한', '강력한', '평온한', '유쾌한', '반짝이는', '찬란한', '황홀한', '순수한'
    , '부드러운', '지적인', '로맨틱한', '쿨한', '당찬', '당당한', '똑똑한', '강렬한', '감성적인', '친근한', '믿음직한', '따뜻한', '독특한', '힙한'
    , '카리스마', '트렌디한', '포근한', '섬세한', '소중한', '느긋한', '대담한', '명랑한', '다정한', '매력적인']
  const nouns = ['고양이', '강아지', '거북이', '토끼', '뱀', '사자', '호랑이', '표범', '치타', '하이에나', '기린', '코끼리', '코뿔소', '하마',
     '악어', '펭귄', '부엉이', '올빼미', '곰', '돼지', '소', '닭', '독수리', '타조', '고릴라', '오랑우탄', '침팬지', '원숭이', '코알라',
      '캥거루', '고래', '상어', '칠면조', '직박구리', '쥐', '청설모', '메추라기', '앵무새', '삵', '스라소니', '판다', '오소리', '오리', '거위',
       '백조', '두루미', '고슴도치', '두더지', '아홀로틀', '맹꽁이', '너구리', '개구리', '두꺼비', '카멜레온', '이구아나', '노루', '제비', '까치',
        '고라니', '수달', '당나귀', '순록', '염소', '공작', '바다표범', '들소', '박쥐', '참새', '물개', '바다사자', '살모사', '구렁이', '얼룩말',
         '산양', '멧돼지', '카피바라', '도롱뇽', '북극곰', '퓨마', '미어캣', '코요테', '라마', '딱따구리', '기러기', '비둘기', '스컹크', '돌고래',
          '까마귀', '매', '낙타', '여우', '사슴', '늑대', '재규어', '알파카', '양', '다람쥐', '담비', '흑염룡']
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)]
  const noun = nouns[Math.floor(Math.random() * nouns.length)]
  return `${adj}${noun}`
}

export default function EditProfilePage() {
  const router = useRouter()
  const { user, setUser } = useContext(UserContext)

  const [password, setPassword] = useState('')
  const [gender, setGender] = useState(user?.gender || '')
  const [ageGroup, setAgeGroup] = useState(user?.ageGroup || '')
  const [name, setName] = useState(user?.name || getRandomNickname())

  const [email, setEmail] = useState(user?.email || '')
  const [verifyCode, setVerifyCode] = useState('')
  const [serverCode, setServerCode] = useState('')
  const [emailVerified, setEmailVerified] = useState(false)

  const refreshNickname = () => {
    setName(getRandomNickname())
  }

  const handleUpdate = async () => {
    if (!user || typeof user.id !== 'number') {
      alert('로그인이 필요합니다.')
      return
    }

    if (!emailVerified) {
      alert('이메일 인증을 완료해주세요.')
      return
    }

    try {
      await axios.put('/api/user/update', {
        id: user.id,
        password,
        gender,
        ageGroup,
        name,
      })

      const updated = { ...user, name, gender, ageGroup }
      setUser(updated)
      localStorage.setItem('user', JSON.stringify(updated))
      alert('회원 정보가 수정되었습니다.')
      router.push('/')
    } catch (err) {
      console.error('❌ update error:', err)
      alert('회원 정보 수정 실패')
    }
  }

  const sendCode = async () => {
    try {
      const res = await axios.post('/api/auth/send-code', { email })
      setServerCode(res.data.code)
      alert('인증번호가 이메일로 전송되었습니다.')
    } catch {
      alert('인증번호 전송 실패')
    }
  }

  const checkCode = () => {
    if (verifyCode === serverCode) {
      alert('인증 완료!')
      setEmailVerified(true)
    } else {
      alert('인증번호가 일치하지 않습니다.')
    }
  }

  return (
    <main style={{ padding: '2rem' }}>
      <h1>🙋 회원 정보 수정</h1>

      <p>현재 닉네임: <strong>{name}</strong></p>
      <button onClick={refreshNickname}>닉네임 새로고침 🔁</button>

      <input
        type="email"
        placeholder="이메일"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value)
          setEmailVerified(false) // 이메일 변경 시 인증 다시
        }}
      />
      <button onClick={sendCode}>인증번호 발송</button>

      <input
        type="text"
        placeholder="인증번호 입력"
        value={verifyCode}
        onChange={(e) => setVerifyCode(e.target.value)}
      />
      <button onClick={checkCode}>인증 확인</button>

      <div style={{ marginBottom: '1rem' }}>
        <input
          type="password"
          placeholder="새 비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <select value={gender} onChange={(e) => setGender(e.target.value)}>
          <option value="">성별 선택</option>
          <option value="male">남성</option>
          <option value="female">여성</option>
        </select>
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <select value={ageGroup} onChange={(e) => setAgeGroup(e.target.value)}>
          <option value="">나이대 선택</option>
          <option value="10">10대</option>
          <option value="20">20대</option>
          <option value="30">30대</option>
          <option value="40">40대</option>
          <option value="50">50대</option>
          <option value="60">60대 이상</option>
        </select>
      </div>
      <button onClick={handleUpdate}>수정 완료</button>
    </main>
  )
}
