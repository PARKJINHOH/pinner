#!/bin/bash

# 색상 설정
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # 색상 없음

# 이미지 이름 설정
BACKEND_IMAGE_NAME="adg0609/travel-be"
FRONTEND_IMAGE_NAME="adg0609/travel-fe"

# 플랫폼 선택하기
echo -e "${YELLOW}플랫폼을 선택하세요:${NC}"
options=("amd64" "arm64")
select opt in "${options[@]}"
do
    case $opt in
        "amd64")
            PLATFORM="amd64"
            break
            ;;
        "arm64")
            PLATFORM="arm64"
            break
            ;;
        *) echo "유효하지 않은 옵션입니다. 1 또는 2를 선택하세요.";;
    esac
done

# 백엔드 빌드
echo -e "${YELLOW}백엔드 빌드 중...${NC}"
cd travelmaprecode-be

echo -e "${YELLOW}실행 중: docker build --platform=$PLATFORM -t $BACKEND_IMAGE_NAME .${NC}"
if ! docker build --platform=$PLATFORM -t $BACKEND_IMAGE_NAME .; then
    echo -e "${RED}❌ 백엔드 Docker 빌드 실패.${NC}"
    exit 1
fi
clear
cd ..

# 프론트엔드 빌드
echo -e "${YELLOW}프론트엔드 빌드 중...${NC}"
cd travelmaprecode-fe

echo -e "${YELLOW}실행 중: docker build --platform=$PLATFORM -t $FRONTEND_IMAGE_NAME .${NC}"
if ! docker build --platform=$PLATFORM -t $FRONTEND_IMAGE_NAME .; then
    echo -e "${RED}❌ 프론트엔드 Docker 빌드 실패.${NC}"
    exit 1
fi
clear
cd ..

# 성공 메시지
echo -e "${GREEN}✅ 빌드가 성공적으로 완료되었습니다.${NC}\n"
echo -e ""

# 퍼블리시 여부 묻기
echo -e "${YELLOW}이미지를 퍼블리시 하시겠습니까? (y/N)${NC}"
read -r response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    echo -e "${YELLOW}백엔드 퍼블리시 중...${NC}"
    if ! docker push $BACKEND_IMAGE_NAME; then
        echo -e "${RED}❌ 백엔드 Docker push 실패.${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ 백엔드 퍼블리시가 성공적으로 완료되었습니다.${NC}"

    echo -e "${YELLOW}프론트엔드 퍼블리시 중...${NC}"
    if ! docker push $FRONTEND_IMAGE_NAME; then
        echo -e "${RED}❌ 프론트엔드 Docker push 실패.${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ 프론트와 백엔드 퍼블리시가 모두 성공적으로 완료되었습니다.${NC}"
else
    echo -e "로컬에서 실행하려면 아래 명령어를 사용하세요:\n"
    echo -e "    $ export GOOGLE_API_KEY=MY_SECRET_KEY"
    echo -e "    $ docker compose up"
fi
echo -e ""
