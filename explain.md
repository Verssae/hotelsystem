# 프로그램 구조

1. 개발 환경 요소

   ```json
   * 백엔드
   node.js : v10.13.0
   mysql :   Ver 14.14 Distrib 5.7.24
   사용한 패키지:
   "dependencies": {
       "body-parser": "^1.18.3",
       "cookie-parser": "^1.4.3",
       "date-and-time": "^0.6.3",
       "ejs": "^2.5.6",
       "express": "^4.16.4",
       "express-flash": "0.0.2",
       "express-myconnection": "^1.0.4",
       "express-mysql-session": "^2.0.1",
       "express-session": "^1.15.6",
       "express-validator": "^5.3.0",
       "method-override": "^3.0.0",
       "moment": "^2.22.2",
       "mysql": "^2.16.0",
       "passport": "0.4.0",
       "passport-local": "1.0.0",
       "pg-calendar": "^1.4.30"
   }
   실행환경: macos10.14 (x86_64)
   * 프론트엔드
   - ejs, css, js, bootstrap
   ```

2. 디렉토리 구조

   ```
   ├── LICENSE
   ├── app.js
   ├── config.js
   ├── explain.md
   ├── node_modules/
   ├── package-lock.json
   ├── package.json
   ├── public
   │   ├── assets
   │   │   ├── css
   │   │   ├── fonts
   │   │   ├── js
   │   │   └── sass
   │   ├── fonts
   │   ├── images
   │   └── img
   ├── routes
   │   ├── customers.js
   │   ├── housekeeping.js
   │   ├── index.js
   │   ├── reservations.js
   │   ├── rooms.js
   │   └── staffs.js
   └── views
       ├── customers
       │   ├── add.ejs
       │   ├── add_user.ejs
       │   ├── edit.ejs
       │   ├── edit_user.ejs
       │   └── list.ejs
       ├── housekeeping
       │   ├── add.ejs
       │   ├── edit.ejs
       │   └── list.ejs
       ├── index.ejs
       ├── index_user.ejs
       ├── layouts
       │   ├── footer.ejs
       │   └── header.ejs
       ├── layouts_user
       │   ├── footer.ejs
       │   └── header.ejs
       ├── login
       │   ├── customer.ejs
       │   ├── login.ejs
       │   └── main.ejs
       ├── reservations
       │   ├── add.ejs
       │   ├── add_user.ejs
       │   ├── check.ejs
       │   ├── check_user.ejs
       │   ├── edit.ejs
       │   ├── edit_user.ejs
       │   ├── list.ejs
       │   └── list_user.ejs
       ├── rooms
       │   ├── add.ejs
       │   ├── assign.ejs
       │   ├── edit.ejs
       │   └── list.ejs
       └── staffs
           ├── add.ejs
           ├── edit.ejs
           └── list.ejs
   
   
   ```

3.  구현 설명

   ```
   app.js : 
   - config.js로 부터 mysql 사용자 정보를 가져와 node.js와 연결시킨다.
   - routes 폴더의 router js파일 및 패키지들을 임포트한다.
   - session 및 passport를 이용해 로그인을 구현함
   - 3000 포트로 서버 실행
   
   routes:
   - 라우터 js 파일
   - get, post, put, delete 메소드를 express js 를 이용하여 구현함
   - views 폴더에 있는 ejs파일들을 알맞게 render함.
   - session에 저장된 값을 활용하여 로그인한 사용자가 직원인지 고객인지에 따라 다르게 구현하였음
   
   views:
   - 서버로부터 주고 받는 데이터를 쉽게 활용하기 위해 ejs 템플릿 엔진을 사용하여 .html 대신 .ejs파일임.
   
   ```
