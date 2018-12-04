# 설치법
- 1. 루트 디렉토리에 config.js 생성하기

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

* mysql에 테이블 생성 (mysql 5.7 버전)

```mysql
# 복붙해서 만드세요
create table customer (
	id int(10) not null auto_increment,
	name varchar(20) not null,
	car boolean,
	nation varchar(20),
	phone varchar(20) not null,
	email varchar(30),
	primary key (id)
);

create table room_type (
	type varchar(10) not null primary key,
	bed int(10),
	price int(10)
);


create table room (
    number int(10) not null primary key,
    type varchar(10),
    foreign key (type) references room_type (type)
);


create table reservation (
    code int(10) not null auto_increment,
    id int(10) not null,
    number int(10) not null,
    indate datetime not null,
	outdate datetime not null,
	checkIn boolean,
	checkOut boolean,
    primary key (code),
    foreign key (id) references customer (id),
    foreign key (number) references room (number)
);

create table staff (
    id int(10) not null auto_increment,
    name varchar(10) not null,
    gender varchar(10),
    birth date,
    primary key (id)
);


create table housekeeping (
    number int(10),
    clean booelan,
    linen booelan,
    amenity boolean,
    order_take varchar(255),
    foreign key (number) references room (number),
    primary key (number)
);

create table task (
    number int(10),
    id int(10),
    foreign key (number) references room (number),
    foreign key (id) references staff (id),
    primary key (number, id)
);

i

```

* 권한 설정

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

