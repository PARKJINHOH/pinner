# pinner
pinner는 여행을 기록하고 추억을 남길 수 있는 웹사이트입니다. <br/>
다녀온 여행지를 pin으로 표시하고, 여행을 남기는 사람이 되어 당신만의 특별한 여행 이야기를 만들어보세요!
> https://pinner.dev

<br/>
 
![pinner](https://github.com/user-attachments/assets/92d20520-b942-46f7-8991-6076ebd0276d)
* Spring Boot와 React를 사용한 여행기록 웹사이트입니다.

<br/>
<br/>

## 사용 Skill
### Backend
<img src="https://img.shields.io/badge/JAVA-17-007396?logo=openjdk"/>&nbsp;
<img src="https://img.shields.io/badge/SpringBoot-2.7.16-6DB33F?logo=springboot"/>&nbsp;
<img src="https://img.shields.io/badge/SpringSecurity-6DB33F?logo=springsecurity"/>&nbsp;
<img src="https://img.shields.io/badge/SpringDataJpa, QueryDSL-6DB33F"/>&nbsp;
<img src="https://img.shields.io/badge/JWT-000000"/>&nbsp;
<img src="https://img.shields.io/badge/Gradle-02303A?logo=gradle"/>&nbsp;

### Frontend
<img src="https://img.shields.io/badge/React-18.2-61DAFB?logo=react"/>&nbsp;
<img src="https://img.shields.io/badge/Node.js-18-339933?logo=nodedotjs"/>&nbsp;
<img src="https://img.shields.io/badge/Recoil-white?logo=recoil"/>&nbsp;
<img src="https://img.shields.io/badge/Nginx-009639?logo=nginx"/>&nbsp;
<img src="https://img.shields.io/badge/Tailwind CSS-white?logo=tailwindcss"/>&nbsp;
<img src="https://img.shields.io/badge/react--google--maps-white?logo=googlemaps"/>&nbsp;

### Server
<img src="https://img.shields.io/badge/Oracle Cloud-F80000?logo=oracle"/>&nbsp;
<img src="https://img.shields.io/badge/Ubuntu-22.04.3-E95420?logo=ubuntu"/>&nbsp;
<img src="https://img.shields.io/badge/Nginx Proxy Manager-009639?logo=nginxproxymanager"/>&nbsp;
<img src="https://img.shields.io/badge/Docker-white?logo=Docker"/>&nbsp;
<img src="https://img.shields.io/badge/Docker Compose-2496ED"/>&nbsp;

### DNS
<img src="https://img.shields.io/badge/Cloudflare-white?logo=cloudflare"/>&nbsp;

### DataBase
<img src="https://img.shields.io/badge/H2 Databases(local)-007396"/>&nbsp;
<img src="https://img.shields.io/badge/mariadb(dev, prod)-003545?logo=mariadb"/>&nbsp;

### Monitoring
<img src="https://img.shields.io/badge/Prometheus-white?logo=prometheus"/>&nbsp;
<img src="https://img.shields.io/badge/Grafana-white?logo=grafana"/>&nbsp;

### CI/CD
<img src="https://img.shields.io/badge/Github Actions-white?logo=githubactions"/>&nbsp;

### 시스템 구성도
![pinner](https://github.com/user-attachments/assets/354d3ea0-f517-4d52-be86-ea59f6ef84ee)

## Collaborator
<img src="https://avatars.githubusercontent.com/u/58283564?v=4" title="ngryman" width="80" height="80" style="max-width: 100%;">


<br/>
<br/>

## 목차
- [홈페이지 설명](#홈페이지-설명)
- [화면설명](#화면설명)
- [프로젝트 개선](#프로젝트-개선)
<br/>
<br/>

## 홈페이지 설명
회원가입 후 여정과 여정에 대한 날짜별 여행을 기록할 수 있는 웹사이트입니다.
사진을 업로드 하면 마지막 사진의 정보를 가지고와 위도,경도 정보를 추출하여 지도에 마커로 표시하며 사진촬영 시간으로 정보를 기록합니다.

### 용어 설명
여행: 전체적인 여행을 의미합니다. (예: 2023년 2월 베트남 여행, 2024년 5월 일본 여행)<br/> 
여정: 여행 내에서 날짜별로 계획된 일정입니다. (예: 2월 23일, 2월 24일, 2월 25일)

### 홈페이지 기능
* 회원가입, 로그인, 소셜미디어 로그인(Naver, Google)
* 여정 날짜별 여행기록 사진 EXIF 정보(위도, 경도, 촬영시간) 추출후 기록으로 사용
    * EXIF정보로 Google Map에 Marker 표시(직접 등록도 가능)
    * EXIF정보로 시작 날짜, 종료 날짜, 여정 기간 계산(수동도 가능)
* 여행 클릭시 위치 이동
* 장소별, 이미지별 갯수 통계
* 회원끼리 공유기능
* 사진 뷰어 기능
* 해시태그 기능

### 서버, DNS, 모니터링 구성
* Oracle Cloud를 이용한 서버 구성
* Cloudflare를 이용한 DNS 설정
* Nginx Proxy Manager를 이용한 Reverse Proxy 설정(dev, prod)
* Docker, Docker Compose를 이용한 배포
* Github Actions를 이용한 CI/CD
    * develop, master branch에 merge시 Docker Image Build, Push
* Prometheus, Grafana를 이용한 모니터링

<br/>
<br/>

## 화면설명
### 회원가입 및 로그인
> ![pinnerLogin](https://github.com/user-attachments/assets/8634c0ed-4c40-4e12-b371-a5825976d60d)

### 여정 등록
> ![pinnerCRUD](https://github.com/user-attachments/assets/48093036-317a-4292-94a3-99654f214285)

### 여정별 Google Map Marker 표시
> ![스크린샷 2024-10-06 162055](https://github.com/user-attachments/assets/91f26897-9520-4f38-97e2-ec5fe37b6dfa)<br/>
> ![스크린샷 2024-10-06 160838](https://github.com/user-attachments/assets/f4bb3785-11e3-4755-857b-59037cf15ab3)<br/>
> ![스크린샷 2024-10-06 160848](https://github.com/user-attachments/assets/8b032734-e946-43cd-8d80-207ded6a1124)<br/>

### Server Monitoring
> ![image](https://github.com/user-attachments/assets/648f0dd9-cb79-4078-8513-52aa171cf28a)