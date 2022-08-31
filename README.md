<p align="center">
  <a href="http://svc.hambabwa.kr/" target="blank"><img src="https://image.hambabwa.kr/ci.png" width="320" alt="hambabwa" /></a>
</p>
<p align="center">
<img src="https://img.shields.io/badge/Nestjs-E0234E?style=flat-square&logo=Nestjs&logoColor=white" /> 
<img src="https://img.shields.io/badge/Typescript-3178C6?style=flat-square&logo=Typescript&logoColor=white" /> 
<img src="https://img.shields.io/badge/MySQL-4479A1?style=flat-square&logo=MySQL&logoColor=white"/>
<img src="https://img.shields.io/badge/AmazonEC2-FF9900?style=flat-square&logo=AmazonEC2&logoColor=white"/> 
<img src="https://img.shields.io/badge/AmazonS3-569A31?style=flat-square&logo=AmazonS3&logoColor=white"/>
</p>

## Description

[강남함바](http://svc.hambabwa.kr/) 매일 바뀌는 함바집 메뉴. 오늘 내가 좋아하는 메뉴가 나온 곳은 어딜까?</br>
하루하루 메뉴를 알 수 없는 강남 회사원들의 점심고민해결 토이프로젝트.

<p align="center">
    <img src="https://image.hambabwa.kr/splash.png" width="390" alt="hambabwa" />
</p>

## WireFrame
<p align="center">
  <img src="https://image.hambabwa.kr/wireframe.png" width="100%" alt="hambabwa" />
</p>

## BasedOn

- AWS EC2, S3
- Nest.js
- Mysql, TypeORM

## Features
#### - User Side
- 회원가입 (웰컴메일 발송 #redis mq)
- JWT 기반 로그인
- 프로필 사진 등록 / 수정
- 선호메뉴 저장 / 수정
- 리뷰 저장 / 수정
- **오늘의 음식점 추천 -> 선호메뉴 정렬 알고리즘(선호메뉴 / 메뉴 카테고리별 점수 계산)**   
- 메뉴별 칼로리 확인

#### - Backoffice
- 음식점 등록 / 수정 / 삭제
- 메뉴 등록 / 수정 / 삭제 (식약처 영양 DB 기준)
- 메뉴 엑셀 업로드

## Progress
Refactoring 20%

## Stay in touch

- frontend - [hyundang](https://github.com/hyundang)
- backend - [suppKimKr](https://github.com/suppKimKr), [hyeonjeong33](https://github.com/hyeonjeong33)
- website - [강남함바](https://svc.hambabwa.com)
