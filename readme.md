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

- 실행

```
npm install
node app.js 
```

