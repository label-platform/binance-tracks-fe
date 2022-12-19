# Tracks UI

## Build
---
### .env 파일 세팅
[링크](https://www.notion.so/clessonofficial/env-668bc045a8da4320a45c266983087b58)
### build command

#### real os
```bash
    # development
    npm install
    npm run dev
```


#### docker
```bash

# create image (이미지 없을 때 이미지 먼저 생성 => Dockerfile.dev 이미지 명 확인)
$ docker build -t [DOCKER-IMAGE-NAME]:[DOCKER-IMAGE-TAG] -f Dockerfile.builder .

# local
$ docker-compose --env-file .env.local -f docker-compose.local.yml up --build -d

# development
$ docker-compose --env-file .env.local -f docker-compose.dev.yml up --build -d

# production

```
