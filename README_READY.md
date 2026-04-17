# archery-app-full-ready

## 포함 사항
- Firebase `.env` 값 입력 완료
- 엔드 기반 / 거리 기반 선택 가능
- 업로드된 기록지 기준 샘플 데이터 6개 자동 로드
- 실제 사용자 기록이 생기면 샘플보다 실제 기록이 우선 표시

## 실행
```bash
npm install
npm run dev
```

브라우저:
- http://localhost:5173

## 변경 사항 v2
- 거리기반에서도 세트제 선택 가능
- 거리 옵션에 18m 추가
- 대시보드 Recent X-Sessions에 입력 방식(엔드기반/거리기반)과 경기 방식(누적제/세트제) 표시
- 종이 데이터 샘플은 로그인 후 `X-Dashboard > Recent X-Sessions`와 `X-Session`의 거리기반 입력으로 확인 가능


샘플 데이터 기준일은 2026-04-12입니다.


안정화 버전:
- 기본 샘플 기록지 2개(2026-03-22, 2026-04-12)가 항상 표시됩니다.
- 샘플은 X-Dashboard, X-Ranking, X-Analysis에서 기본 로드됩니다.


로그인 직후 기본 화면은 X-Dashboard로 설정했습니다.
