# X-SESSION 배포 전 체크

- node_modules 제거 완료
- .env 제거 완료
- package.json name = x-session
- jsconfig.json ignoreDeprecations 추가

다음 순서:
1. npm install
2. npm run build
3. GitHub 업로드
4. Vercel 환경변수 입력 후 배포
