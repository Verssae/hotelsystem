var express = require('express')
var app = express()

var mysql = require('mysql')

var flash = require('express-flash')
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport') //passport module add
var LocalStrategy = require('passport-local').Strategy;



var myConnection  = require('express-myconnection')
/**
 * Store database credentials in a separate config.js file
 * Load the file/module and its values
 */
var config = require('./config')
var dbOptions = {
	host:	  config.database.host,
	user: 	  config.database.user,
	password: config.database.password,
	port: 	  config.database.port,
	database: config.database.db,
	dateStrings: 'date',
	timezone: 'utc'
}
/**
 * 3 strategies can be used
 * single: Creates single database connection which is never closed.
 * pool: Creates pool of connections. Connection is auto release when response ends.
 * request: Creates new connection per new request. Connection is auto close when response ends.
 */
app.use(myConnection(mysql, dbOptions, 'pool'))

/**
 * setting up the templating view engine
 */
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views');
/**
 * import routes/index.js
 * import routes/users.js
 */
var index = require('./routes/index')
var customers = require('./routes/customers')
var rooms = require('./routes/rooms')
var reservations = require('./routes/reservations')
var staffs = require('./routes/staffs')
var housekeeping = require('./routes/housekeeping')
var assign = require('./routes/assign')

/**
 * Express Validator Middleware for Form Validation
 */
var expressValidator = require('express-validator')
app.use(expressValidator())


/**
 * body-parser module is used to read HTTP POST data
 * it's an express middleware that reads form's input
 * and store it as javascript object
 */
var bodyParser = require('body-parser')
/**
 * bodyParser.urlencoded() parses the text as URL encoded data
 * (which is how browsers tend to send form data from regular forms set to POST)
 * and exposes the resulting object (containing the keys and values) on req.body.
 */


// app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())


/**
 * This module let us use HTTP verbs such as PUT or DELETE
 * in places where they are not supported
 */
var methodOverride = require('method-override')

/**
 * using custom logic to override method
 *
 * there are other ways of overriding as well
 * like using header & using query value
 */
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method
    delete req.body._method
    return method
  }
}))

/**
 * This module shows flash messages
 * generally used to show success or error messages
 *
 * Flash messages are stored in session
 * So, we also have to install and use
 * cookie-parser & session modules
 */


app.use(cookieParser('keyboard cat'))
app.use(session({
	secret: '!@#$',
    resave: false,
    saveUninitialized: false
}));


app.use(flash())

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  /* db 에서 id를 이용하여 user를 얻어서 done을 호출합니다 */
  done(null, user);
//   connection.query("SELECT * FROM customer WHERE id=?", [id], function(err, rows) {
//     var user = rows[0];
//     done(err, user);
//   });
});

passport.use(new LocalStrategy({
  usernameField: 'id',
  passwordField: 'password',
  passReqToCallback: true
}, function(req,username, password, done) {
	
	if (req.body.customer) {
		req.getConnection(function(error, conn) {
			conn.query('SELECT * FROM customer WHERE id =?', [username], function(err, rows) {
				
				
				if (err) {
					return done(err);
				}
				var user = rows[0];
				
				if (!user) {
					return done(null, false, { message: 'ID를 확인해 주세요' });
				}
				if (user.password !== password) {
					return done(null, false, { message: '비밀번호를 확인해 주세요' });
				}
				user.tag = "customer"
				return done(null, user);
			  });
		});
	} else {
		req.getConnection(function(error, conn) {
			conn.query('SELECT * FROM staff WHERE id =?', [username], function(err, rows) {
				
				if (err) {
					return done(err);
				}
				var user = rows[0];
				
				if (!user) {
					return done(null, false, { message: 'ID를 확인해 주세요' });
				}
				if (user.password !== password) {
					return done(null, false, { message: '비밀번호를 확인해 주세요' });
				}
				user.tag = "staff"
				return done(null, user);
			  });
		});
	}
	
}));

/* controllers */
// app.get('/', function(req, res, next) {
//   res.send('hello world');
// });

app.route('/login')
.get(function(req, res, next) {
//   console.log(req.flash('error'));
  if (req.user) {
    res.redirect("/");
  } else {

		res.render('login/login');
    
  }
}).post(passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}));

app.get('/logout', function (req, res) {
	req.logout();
	res.redirect('/login');
})

// app.get('/login', function (req, res) {
// 	res.render('login/main');
// })


app.use('/', index)
app.use('/customers', customers)
app.use('/rooms',rooms)
app.use('/reservations',reservations)
app.use('/staffs',staffs)
app.use('/assign',assign)


app.use(express.static('public'));
app.use('/housekeeping', housekeeping)

app.listen(3000, function(){
	console.log('Server running at port 3000: http://127.0.0.1:3000')
})
