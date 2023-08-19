FROM node:alpine AS build

RUN mkdir /app
WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

################################################
FROM nginx:alpine

WORKDIR /app

# nginx의 기본 설정을 삭제하고 앱에서 설정한 파일을 복사
RUN rm -rf /etc/nginx/conf.d
COPY conf /etc/nginx

# 위 스테이지에서 생성한 빌드 결과를 nginx의 샘플 앱이 사용하던 폴더로 이동
COPY --from=build /app /usr/share/nginx/html

EXPOSE 80

# nginx 실행
ENTRYPOINT ["nginx", "-g", "daemon off;"]