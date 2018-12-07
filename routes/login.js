// var express = require('express')
// var app = express()

// var passport = require('passport') //passport module add
// var LocalStrategy = require('passport-local').Strategy;



// app.use(passport.initialize());
// app.use(passport.session());

// //login session

// app.post('/staff', passport.authenticate('local', {failureRedirect: '/login/staff', failureFlash: true}), // 인증 실패 시 401 리턴, {} -> 인증 스트레티지
//   function (req, res) {
//     res.redirect('/');
// });

// passport.use(new LocalStrategy({
// 	usernameField: 'username',
// 	passwordField: 'password',
// 	passReqToCallback: true //인증을 수행하는 인증 함수로 HTTP request를 그대로  전달할지 여부를 결정한다
//   }, function (req, username, password, done) {

	
// 	req.getConnection(function(error, conn) {
// 		conn.query("select * from staff where id='"+username +"' and password='"+password+"'", function(err, result) {
// 			//if(err) throw err
// 			if (err) {
// 				req.flash('error', "check your id and pasword")
				
// 				return done(false, null)
				
// 			} else if (result[0]){				
// 				req.flash('success', 'selected')
// 				return done(null, {
// 					'user_id': username,
// 				});
// 			} else {
				
// 				return done(false, null)
// 			}
// 		})
// 	})
	
//   }));

//   passport.serializeUser(function (user, done) {
// 	done(null, user);
// 	console.log(user);
//   });

//   passport.deserializeUser(function (user, done) {
//     done(null, user);
//     console.log("deserialize")
//   });
 
//   app.get('/staff', function (req, res) {
// 	res.render('login/staff',{
// 	  title: 'staff login',
// 	  message: "Login as staff"
	  
//     })
//     console.log(req.isAuthenticated())
//   });
//   app.get('/logout', function (req, res) {
// 	req.logout();
// 	res.redirect('/');
//   });

//   module.exports = app