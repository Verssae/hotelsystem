# 설치법(수정됨:12/11)
- 최상위 디렉토리에 config.js 생성하기

```javascript
var config = {
	database: {
		host:	  'localhost', 	// database host
		user: 	  'username', 		// your database username
		password: 'password', 		// your database password
		port: 	  3306, 		// default MySQL port
		db: 	  'hotel' 		// your database name
	},
	server: {
		host: '127.0.0.1',
		port: '3000'
	}
}

module.exports = config
```

* mysql에 테이블 생성 (mysql 5.7 버전) (수정됨)

```mysql

create table customer (
	id varchar(20) not null ,
	password varchar(20) not null,
	name varchar(20) not null,
	car boolean,
	nation varchar(20),
	phone varchar(20) not null,
	email varchar(30),
	primary key (id)
);

create table room_type (
	type varchar(10) not null primary key,
	price int(10)
);


create table room (
    number int(10) not null primary key,
    type varchar(10),
	floor int(10) not null,
	clean boolean,
    linen boolean,
    amenity boolean,
    order_take varchar(255),
    foreign key (type) references room_type (type)
);


create table reservation (
    code int(10) not null auto_increment,
    id varchar(20) not null,
    number int(10) not null,
	reservedate datetime not null,
    indate date not null,
	outdate date not null,
	checkIn boolean,
	checkOut boolean,
    primary key (code),
    foreign key (id) references customer (id),
    foreign key (number) references room (number)
);

create table staff (
    id varchar(20) not null ,
	password varchar(20) not null,
    name varchar(10) not null,
    gender varchar(10),
    birth date,
    primary key (id)
);

create table task (
    number int(10),
    id varchar(20),
    foreign key (number) references room (number),
    foreign key (id) references staff (id),
    primary key (number)
);

# 최초 직원 입력
insert into staff (id, password, name, gender, birth) values ('id', 'password', 'name','2018-12-11');

# 가격은 기억 안나서 대충 씀 룸 타입 입력
insert into room_type (type, price) values ('executive', 260), ('standard', 160), ('sweet', 100);

# 직원으로 로그인 후 /rooms/add 한 후 나오는 버튼 클릭하면 방이 모두 들어감
```

* 권한 설정(root 사용자에게)

```mysql
$ sudo mysql
mysql> grant all privileges on *.* to 'root'@'%' identified by 'root의 패스워드'
mysql> 
```

* 실행

```
npm install
node app.js
```

