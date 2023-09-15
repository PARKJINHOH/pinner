# 색상 설정
$RED = [System.ConsoleColor]::Red
$GREEN = [System.ConsoleColor]::Green
$YELLOW = [System.ConsoleColor]::Yellow
$NC = [System.ConsoleColor]::White

# 이미지 이름 설정
$BACKEND_IMAGE_NAME = "adg0609/travel-be"
$FRONTEND_IMAGE_NAME = "adg0609/travel-fe"

# 플랫폼 선택하기
Write-Host -ForegroundColor $YELLOW "플랫폼을 선택하세요:"
$options = @("amd64", "arm64")
$PLATFORM = ""

do {
    $selectedOption = Read-Host -Prompt "1. amd64`n2. arm64`n선택(1/2): "
    switch ($selectedOption) {
        "1" { $PLATFORM = "amd64"; break }
        "2" { $PLATFORM = "arm64"; break }
        default { Write-Host "유효하지 않은 옵션입니다. 1 또는 2를 선택하세요." }
    }
} while (!$PLATFORM)

# 백엔드 빌드
Write-Host -ForegroundColor $YELLOW "백엔드 빌드 중..."
Set-Location travelmaprecode-be

Write-Host -ForegroundColor $YELLOW "실행 중: docker build --platform=$PLATFORM -t $BACKEND_IMAGE_NAME ."
if (-not (docker build --platform=$PLATFORM -t $BACKEND_IMAGE_NAME .)) {
    Write-Host -ForegroundColor $RED "❌ 백엔드 Docker 빌드 실패."
    exit 1
}
Clear-Host
Set-Location ..

# 프론트엔드 빌드
Write-Host -ForegroundColor $YELLOW "프론트엔드 빌드 중..."
Set-Location travelmaprecode-fe

Write-Host -ForegroundColor $YELLOW "실행 중: docker build --platform=$PLATFORM -t $FRONTEND_IMAGE_NAME ."
if (-not (docker build --platform=$PLATFORM -t $FRONTEND_IMAGE_NAME .)) {
    Write-Host -ForegroundColor $RED "❌ 프론트엔드 Docker 빌드 실패."
    exit 1
}
Clear-Host
Set-Location ..

# 성공 메시지
Write-Host -ForegroundColor $GREEN "✅ 빌드가 성공적으로 완료되었습니다.`n"

# 퍼블리시 여부 묻기
Write-Host -ForegroundColor $YELLOW "이미지를 퍼블리시 하시겠습니까? (y/N)"
$response = Read-Host

if ($response -match "^(y|Y|yes|Yes|YES)$") {
    Write-Host -ForegroundColor $YELLOW "백엔드 퍼블리시 중..."
    if (-not (docker push $BACKEND_IMAGE_NAME)) {
        Write-Host -ForegroundColor $RED "❌ 백엔드 Docker push 실패."
        exit 1
    }
    Write-Host -ForegroundColor $GREEN "✅ 백엔드 퍼블리시가 성공적으로 완료되었습니다."

    Write-Host -ForegroundColor $YELLOW "프론트엔드 퍼블리시 중..."
    if (-not (docker push $FRONTEND_IMAGE_NAME)) {
        Write-Host -ForegroundColor $RED "❌ 프론트엔드 Docker push 실패."
        exit 1
    }
    Write-Host -ForegroundColor $GREEN "✅ 프론트와 백엔드 퍼블리시가 모두 성공적으로 완료되었습니다."
} else {
    Write-Host "로컬에서 실행하려면 아래 명령어를 사용하세요:`n"
    Write-Host " > `$env:GOOGLE_API_KEY = 'MY_SECRET_KEY'"
    Write-Host " > docker compose up"
}
Write-Host ""
