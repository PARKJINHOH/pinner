# 이미지를 빌드 할 때는 해당 파일을 이용해서 빌드한다.

# Node
FROM node

# Set working directory
WORKDIR /app

COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json

# Same as npm install
RUN npm ci

COPY . /app

ENV CI=true
ENV PORT=3000

# npm start 스크립트 실행
CMD ["npm", "start"]