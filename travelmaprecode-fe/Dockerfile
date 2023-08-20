FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install
COPY . .
RUN npm run build

################################################
FROM nginx:1.25-alpine

COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# 위 스테이지에서 생성한 빌드 결과를 nginx의 샘플 앱이 사용하던 폴더로 이동
COPY --from=build /app /usr/share/nginx/html

EXPOSE 80

# nginx 실행
ENTRYPOINT ["nginx", "-g", "daemon off;"]