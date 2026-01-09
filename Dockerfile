# Node.js 22 베이스 이미지 사용
FROM node:22-alpine

# 작업 디렉토리 설정
WORKDIR /app

# package.json과 package-lock.json 복사
COPY package*.json ./

# 의존성 설치
RUN npm ci --only=production

# 애플리케이션 소스 복사
COPY . .

# 포트 노출 (CloudType이 자동으로 설정하지만 명시)
EXPOSE 5000

# 환경 변수 설정 (CloudType에서 주입됨)
ENV NODE_ENV=production

# 애플리케이션 실행
CMD ["node", "server.js"]
