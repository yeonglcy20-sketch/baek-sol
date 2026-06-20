# 백솔 업보리스트

Google 스프레드시트와 자동 연동되는 GitHub Pages용 업보리스트입니다.

## 사용 방법

1. 이 폴더의 `index.html`, `style.css`, `script.js`를 GitHub 저장소에 업로드합니다.
2. GitHub 저장소 Settings → Pages에서 배포합니다.
3. 스프레드시트 공유 설정은 `링크가 있는 모든 사용자 - 보기 가능`이어야 합니다.

## 수정할 곳

`script.js` 상단에서 시트 이름을 바꿀 수 있습니다.

```js
const SHEET_NAME = '시트1';
```

현재 연결된 스프레드시트 ID:

```js
const SHEET_ID = '1WCGrXJy5OCazo9q6cM0CXeKN7wgs1_P9aG3K8SVMHeI';
```

## 표시 방식

- A열: 닉네임
- 1행: 업보 항목명
- 숫자가 0이거나 빈칸인 항목은 표시하지 않습니다.
