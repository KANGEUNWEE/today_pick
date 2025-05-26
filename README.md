# 🍱 TODAY_PICK – 마이크로서비스 기반 랜덤 음식 추천 플랫폼

TODAY_PICK은 사용자의 별점 이력과 카테고리 기반 추천 로직을 활용해 “오늘 뭐 먹지?” 고민을 덜어주는 웹 서비스입니다.
Node.js, TypeScript 기반 MSA(Microservices Architecture) 구조로,
각 서비스(추천, 평가, 통계, 이메일 등)가 독립적으로 동작합니다.

🚩 프로젝트 개요
목표: 음식 선택의 스트레스를 줄여주는 추천/평가/통계 서비스
아키텍처: Node.js + TypeScript 기반 마이크로서비스 구조로 구현
핵심:
    - 음식 추천, 별점 등록, 평점 기반 재추천
    - 관리자용 CRUD, 통계 대시보드
    - 이메일 인증, 카카오 지도 연동 등 실무형 부가 기능

## 🛠️ 기술 스택

- **Frontend**: Next.js, TypeScript, React Hooks, Recharts
- **Backend**: Node.js, TypeScript, REST API, Serverless Framework (AWS Lambda, serverless-offline), Express (부분)
- **Database**: MySQL + TypeORM
- **공통 모듈:** 타입/엔티티를 별도 common 패키지로 분리 및 재사용
- **모노레포:** 폴더별 tsconfig로 서비스/공통/프론트 관리
- **API 테스트**: Postman
- **지도**: Kakao Local API (Maps & Places)
- **인증/메일**: nodemailer (Gmail SMTP)//   JWT (추후)

+ **CI/CD**: Github Actions, Docker, Vercel 배포 등 (추후)

---

## 📂 디렉토리 구조
```text
today_pick/
│
├── common/                            # 공통 엔티티/타입/유틸 (프론트·람다 공유)
│   ├── src/
│   │   ├── entity/
│   │   │   ├── Food.ts
│   │   │   ├── User.ts
│   │   │   └── Rating.ts
│   │   ├── types/
│   │   │   └── index.d.ts
│   │   └── utils/
│   │       └── stringHelper.ts
│   ├── dist/                          # 빌드 산출물 (.js/.d.ts)
│   │   └── entity/
│   └── tsconfig.json
│
├── lambda/                            # Serverless Lambda(마이크로서비스) 핸들러
│   ├── functions/
│   │   ├── recommend.handler.ts       # 음식 추천 기능
│   │   ├── rate.handler.ts            # 평점 등록
│   │   ├── stats.handler.ts           # 통계 조회
│   │   ├── sendEmail.handler.ts       # 이메일 인증/발송
│   │   └── …                          # 기타 서비스
│   ├── serverless.yml                 # 람다/게이트웨이 구성 파일
│   └── tsconfig.json                  # (루트 tsconfig만 사용)
│
├── frontend/                          # Next.js + TypeScript 기반 프론트엔드
│   ├── src/
│   │   ├── pages/
│   │   │   ├── index.tsx              # 메인(추천/평가)
│   │   │   ├── result.tsx             # 추천 결과
│   │   │   ├── api/
│   │   │   │   └── admin/             # 어드민 API (Next.js API Route)
│   │   │   └── auth/                  # 로그인/회원가입/찾기
│   │   ├── components/
│   │   │   ├── RecommendBox.tsx
│   │   │   ├── StatsChart.tsx
│   │   │   └── …
│   │   ├── contexts/
│   │   │   └── UserContext.tsx
│   │   ├── lib/
│   │   │   └── ormconfig.ts
│   │   ├── models/
│   │   │   └── Rating.ts
│   │   ├── styles/
│   │   │   └── global.css
│   │   └── entity/                    # (공통 entity import 시)
│   ├── public/                        # 정적 자산
│   └── tsconfig.json
│
├── .env.example                       # 환경 변수 샘플
├── README.md                          # 프로젝트 설명
├── docs/                              # 설계/ERD/API 명세(노션 연동 등)
├── tsconfig.json                      # 루트(모노레포) 타입스크립트 설정
└── package.json
```


- 서비스별 API(추천, 평점, 통계 등)는 각각 독립적인 **람다 함수**로 분리되어 있음  
- **공통 엔티티/타입(common)**은 프론트/백엔드에서 import해서 타입 일관성 보장
- 모노레포 기반: 폴더별 tsconfig로 빌드/관리


## 🛠️ 적용된 **MSA(Microservices Architecture) 요소**

- 서비스별 REST API 독립 구현(추천, 평가, 통계, 인증 등)
- 각 서비스는 별도의 람다 함수로 배포/스케일 업 가능
- 공통 타입/엔티티 모듈 분리 → 코드 중복 최소화, 타입 안전성 극대화
- 프론트/백엔드(람다) 완전 분리, 독립 개발·테스트·배포
- (확장성) 각 서비스/공통 모듈을 npm 패키지, 별도 저장소로 분리 가능


 ## ⚙️ 기술 선택 이유
│  TODAY_PICK은 빠른 MVP 개발, 실시간 사용자 피드백을 목표로 설계되었습니다.

│  Node.js + Next.js: 서버/클라이언트 통합 개발 및 빠른 MVP 개발 지원
│  TypeORM: 데코레이터 기반 Entity 관리, 코드 우선 설계 가능
│  Serverless/Lambda: 각 서비스 독립 배포·운영(마이크로서비스)
│  Recharts: React 친화적 차트 라이브러리로 빠르게 시각화
│  Kakao API: 한국 시장 특화된 위치 기반 서비스 연동
|  모노레포 구조: 공통/서비스별 코드/타입 관리 효율화

🔁 주요 기능 (MVP)
기능	  |  설명
-----------------------
회원가입           | 성별, 나이대 선택 + 이메일 인증
로그인/찾기        | 자동 로그인, 이메일 기반 아이디·비밀번호 찾기
음식 추천          | 카테고리 기반 랜덤 추천
별점 등록          | 0~5점 입력 → DB 저장
재추천	          | 2.5점 이하 음식 제외 후 재추천
위치 기반 맛집 검색 | Kakao Maps/Places API 연동으로 내 주변 맛집 실시간 검색
관리자 기능        | 음식/회원 CRUD, 통계 대시보드
통계 시각화        | 평균 평점, 평점 분포, Top5, 회원 수 시각화

🎯 실행 가이드

# 공통 모듈 빌드
npm run build:common

# 람다 함수 로컬 실행
npx serverless offline

# 프론트엔드 개발 서버
cd frontend
npm install
npm run dev

# 브라우저 열기
http://localhost:3000

🛠️ 향후 계획
    JWT/쿠키 인증 강화, OAuth 연동
    개인화 추천(협업 필터링 등 알고리즘 고도화)
    리뷰/코멘트 기능 추가
    모바일 UI/반응형 최적화
    Docker, CI/CD, Vercel 배포 등 클라우드 확장

