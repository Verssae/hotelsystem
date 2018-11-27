# 설치법
- config.js 에서 자기 mysql 설정 하기 (이름, 비번, 디비이름 등)

```javascript
var config = {
	database: {
		host:	  'localhost', 	// database host
		user: 	  'root', 		// your database username
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

- 실행

```
npm install
node app.js 
```

