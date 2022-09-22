# 프로젝트 설명

markdown으로 독후감을 작성할 수 있습니다. markdown으로 작성된 독후감은 `build.js` 파일을 통해서 json 파일로 변환됩니다.

프론트엔드는 vanilla js를 활용하여 SPA 방식으로 구현하였고 json 파일로부터 독후감 데이터를 받아옵니다.

# 독후감 작성하는 법

1. `public/books` 폴더에 책 이름으로 폴더를 생성합니다.
2. 독후감에 대한 정보를 아래 형식으로 삽입합니다. `coverImage` 속성은 필수로 입력해주어야 합니다.
   ```
   ---
   coverImage: imagePath
   ---
   ```
   이미지를 로컬에 저장할 경우 `public` 폴더 하에 위치해야 합니다.
3. 독후감 내용은 위 영역 아래 자유롭게 작성하시면 됩니다.
4. 독후감 내용은 `public/data/book-data.json` 파일로 변환됩니다.
