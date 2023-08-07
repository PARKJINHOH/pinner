# Regex 사용
### RegisterModal.jsx
* 닉네임
    ```
    /[\s]/
    ```
    * /[\s]/ : 공백이 포함되어있는지 확인

    ```
    /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/
    ```
    * /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/ : 특수문자가 포함되어 있는지 확인

    ```
    /^[a-zA-Z가-힣0-9]+$/
    ```
    * 한글, 영어 대소문자, 숫자인지 확인
* 이메일
    ``` 
    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
    ```
    * ^: 문자열의 시작
    * [A-Z0-9._%+-]+: 이메일 주소의 로컬 파트(local part), 대문자, 숫자, 점(.), 언더스코어(_), 퍼센트 기호(%), 플러스 기호(+), 하이픈(-)으로 이루어진 1개 이상의 문자열이여야 한다.
    * @: 이메일 주소의 구분자
    * [A-Z0-9.-]+: 이메일 주소의 도메인 파트(domain part), 대문자, 숫자, 점(.), 하이픈(-)으로 이루어진 1개 이상의 문자열이어야 한다.
    * \.: 도메인 파트의 점(.)을 나타냅니다. 이스케이프 문자()가 사용됨.
    * [A-Z]{2,}: 도메인 파트의 최상위 도메인(TLD), 대문자 알파벳으로 이루어진 2개 이상의 문자열이어야 한다.
    * $: 문자열의 끝
    * i: 대소문자를 구분하지 않도록 설정
* 비밀번호
  ```
  /\d+/
  ```
    * 숫자가 있는지 확인

  ```
  /(?=.*[a-z])(?=.*[A-Z])/
  ```
    * 소문자 혹은 대문자가 있는지 확인 (AND)

  ```
  /[!@#$%^&*()_+~`\-={}[\]:\";'<>,.?\\/]+/
  ```
    * 특수문자가 있는지 확인

  ```
  /.{8,}/
  ```
    * 최소 8글자 이상인지 확인