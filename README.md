# wanted-pre-onboarding-backend

## 지원자명
임채원

## 애플리케이션 실행 방법 (엔드포인트)
1. 회원가입
   - POST /user/signup
2. 로그인
   - POST /user/signin
3. 글 작성
   - POST /board
4. 글 목록 조회
   - GET /board
5. 글 상세 조회
   - GET /board/{id}
6. 글 수정
   - PATCH /board/{id}
7. 글 삭제
   - DELETE /board/{id}
  

## 데이터베이스 테이블 구조
![table](https://github.com/chae1-1111/wanted-pre-onboarding-backend/assets/83391286/817e56e9-8bc8-4435-8a20-30bf4f5c13a8)


## 구현 영상
https://drive.google.com/file/d/1z2XqXB0tD24kzNpz26OysPHbz_rXFOcD/view?usp=sharing

## 구현 방법 및 이유
- nodejs, express 사용
- mysql2 라이브러리를 이용하여 테이블 조작
- crypto 라이브버리를 이용하여 사용자 패스워드 암호화 수행
- jsonwebtoken 라이브러리를 이용하여 jwt 생성 및 검증 수행

## API 명세
## 1) 회원가입
#### 요청
- URL: `/user/signup`
- Method: `POST`
- Headers:
  - Content-Type: `application/json`
- Body:
  - email: string
  - password: string

#### 응답 예시
- status: 201
- body: 없음

## 2) 로그인
#### 요청
- URL: `/user/signin`
- Method: `POST`
- Headers:
  - Content-Type: `application/json`
- Body:
  - email: string
  - password: string

#### 응답 예시
- status: 200
- body:
```
{
  "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOjEsImVtYWlsIjoiYWJjZEBlZmdoLmNvbSIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoxNTE2MjQ5MDIyfQ.axZVmTh6_rBRXCcwvXdW8RtgaOJiuTOuHPv48OwOtlM"
}
```

## 3) 글 작성
#### 요청
- URL: `/board`
- Method: `POST`
- Headers:
  - Content-Type: `application/json`
  - Authorization: `Bearer access_token`
- Body:
  - title: string
  - description: string

#### 응답 예시
- status: 201
- body: 없음

## 4) 글 목록 조회
#### 요청
- URL: `/board?page={page}`
- Method: `GET`
 
#### 응답 예시
- status: 200
- body:
```
{
 "posts": {
  "result": true,
  "data": [
   {
    "_id": 2,
    "title": "New Post",
    "created_at": "2023-08-16T04:43:56.000Z",
    "email": "abcd@efgh.com"
   },
   {
    "_id": 1,
    "title": "New Post",
    "created_at": "2023-08-16T04:43:53.000Z",
    "email": "abcd@efgh.com"
   },
   ...
  ]
 }
}
```

## 5) 특정 글 조회
#### 요청
- URL: `/board/{_id}`
- Method: `GET`
 
#### 응답 예시
- status: 200
- body:
```
{
 "post": {
  "title": "New Post",
  "description": "글 내용..........",
  "created_at": "2023-08-16T04:43:56.000Z",
  "email": "abcd@efgh.com"
 }
}
```

## 6) 특정 글 수정
#### 요청
- URL: `/board/{_id}`
- Method: `PATCH`
- Headers:
  - Content-Type: `application/json`
  - Authorization: `Bearer access_token`
- Body:
  - title: string
  - description: string

#### 응답 예시
- status: 201
- body: 없음

## 7) 특정 글 삭제
#### 요청
- URL: `/board/{_id}`
- Method: `DELETE`
- Headers:
  - Content-Type: `application/json`
  - Authorization: `Bearer access_token`

#### 응답 예시
- status: 201
- body: 없음

