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

4. 사용한 sql문 설명

   * 로그인 (app.js)

     ```javascript
     'SELECT * FROM customer WHERE id =?' 
     'SELECT * FROM staff WHERE id =?'
     ```

     고객으로 로그인할 경우, 직원으로 로그인할 경우 각각 id를 받아오고 password랑 비교함

   * 회원 가입 (index.js)

     ```javascript
     'INSERT INTO customer SET ?', user
     ```

     User 정보를 customer 테이블에 생성

   * 예약 (reservation.js)

     ```javascript
     "select code, number,id, name, date_format(indate, '%m월 %d일') as indate, date_format(outdate, '%m월 %d일 ') as outdate, checkIn, checkOut, reservedate from reservation natural join customer order by indate";
     ```

     예약 목록과 고객 정보를 natural join으로 합쳐서 얻어온다. Date 타입인 indate, outdate는 mysql에서 지원하는 date_format()함수로 알맞게 변환한다.

     ```javascript
     "select number from room where number not in (select number from reservation where indate <= '" + outdate + "' and outdate >= '" + indate +"') order by number";
     ```

     예약하고자 하는 날짜 (indate ~ outdate)에 예약되어 있는 방이 아닌 방의 번호를 오름차순으로 얻어온다.

   * 방 정보(rooms.js)

     ```javascript
     "SELECT * FROM room ORDER BY floor desc, number"
     ```

     높은 층, 낮은 호수 순서로 room 데이터를 얻어온다.

     ```javascript
     var now = new Date();
     var indate = moment(now).format('YYYY-MM-DD');
     var outdate = indate;
     "select * from reservation natural join customer where indate <= '" +outdate+ "' and outdate >= '" + indate +"' " 
     ```

     오늘 예약된 방과 그 예약한 고객의 정보를 함께 가져온다.

     ```mysql
     mysql> desc task;
     +--------+-------------+------+-----+---------+-------+
     | Field  | Type        | Null | Key | Default | Extra |
     +--------+-------------+------+-----+---------+-------+
     | number | int(10)     | NO   | PRI | NULL    |       |
     | id     | varchar(20) | NO   | MUL | NULL    |       |
     +--------+-------------+------+-----+---------+-------+
     mysql> desc staff;
     +----------+-------------+------+-----+---------+-------+
     | Field    | Type        | Null | Key | Default | Extra |
     +----------+-------------+------+-----+---------+-------+
     | id       | varchar(20) | NO   | PRI | NULL    |       |
     | password | varchar(60) | YES  |     | NULL    |       |
     | name     | varchar(10) | NO   |     | NULL    |       |
     | gender   | varchar(10) | YES  |     | NULL    |       |
     | birth    | date        | YES  |     | NULL    |       |
     +----------+-------------+------+-----+---------+-------+
     ```

     ```javascript
     "select * from staff right join task on staff.id = task.id"
     ```

     Staff와 Task를 오른쪽 외부 조인 하여 배정된 방 번호와 직원 정보를 함께 가져온다.

5. 프론트엔드 구조

   * ejs 파일 구조

     ```ejs
     <%- include layouts/header.ejs %>	
     <!-- main -->
     <%- include layouts/footer.ejs %>
     ```

     header.ejs 와 footer.ejs로 공통적으로 불러오는 head 및 nav 부분과 css 및 js 파일 불러오는 코드의 재사용성을 높였다.

     ```
     /public/assets/css
     /public/assets/js
     ```

     css, js 폴더 위치

