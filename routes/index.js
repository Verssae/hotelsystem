var express = require('express')
var app = express()


app.get('/', function(req, res) {
	// render to views/index.ejs template file
	// console.log(req.isAuthenticated())
	try {
		if(req.session.passport.user.tag == "customer") {
			res.render('index_user', {title: "Hotel System"})
		} else {
			res.render('index', {title: 'Hotel System'})
		}
	} catch(e) {
		console.log("not login yet");
		res.redirect("/login")
	}
	
	
})

// app.get('/login', function(req, res) {
// 	// render to views/index.ejs template file
	
// 	res.render('login/main', {title: 'Hotel System'})
// })

/** 
 * We assign app object to module.exports
 * 
 * module.exports exposes the app object as a module
 * 
 * module.exports should be used to return the object 
 * when this file is required in another module like app.js
 */ 
module.exports = app;
