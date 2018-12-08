var express = require('express')
var app = express()
var isAuthenticated = function (req, res, next) {
	if (req.isAuthenticated())
	  return next();
	res.redirect('/login');
  };


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
		res.redirect("/main")
	}
	
	
})

app.get('/main', function(req, res) {
	res.render('login/main')
})

app.get('/signin', function(req, res) {
	res.render('customers/add_user', {
		title: 'Add New Customer',
		id: '',
		password: '',
		name: '',
		car: '',
		nation: '',
		phone: '',
		email: ''		
	})
})

app.post('/signin', function(req, res, next){	
	req.assert('name', 'Name is required').notEmpty()           //Validate name
    // req.assert('email', 'A valid email is required').isEmail()  //Validate email

    var errors = req.validationErrors()
    
    if( !errors ) {   //No errors were found.  Passed Validation!
		
		/********************************************
		 * Express-validator module
		 
		req.body.comment = 'a <span>comment</span>';
		req.body.username = '   a user    ';

		req.sanitize('comment').escape(); // returns 'a &lt;span&gt;comment&lt;/span&gt;'
		req.sanitize('username').trim(); // returns 'a user'
		********************************************/
		var user = {
			id: req.body.id,
			password: req.body.password,
			name: req.body.name,
			car: req.body.car ? true:false,
			nation: req.body.nation,
			phone: req.body.phone,
			email: req.body.email
		}
		
		req.getConnection(function(error, conn) {
			conn.query('INSERT INTO customer SET ?', user, function(err, result) {
				//if(err) throw err
				if (err) {
					req.flash('error', err)
					
					// render to views/user/add.ejs
					res.render('customers/add_user', {
						title: 'Add New Customer',
						id: user.id,
						password: user.password,
						name: user.name,
						car: user.car,
						nation: user.nation,
						phone: user.phone,
						email: user.email					
					})
				} else {				
					req.flash('success', 'Data added successfully!')
					
					// render to views/user/add.ejs
					res.render('customers/add_user', {
						title: 'Add New Customer',
						id: '',
						password: '',
						name: '',
						
						nation: '',
						phone: '',
						email: ''					
					})
				}
			})
		})
	}
	else {   //Display errors to user
		var error_msg = ''
		errors.forEach(function(error) {
			error_msg += error.msg + '<br>'
		})				
		req.flash('error', error_msg)		
		
		/**
		 * Using req.body.name 
		 * because req.param('name') is deprecated
		 */ 
        res.render('customers/add_user', {
			title: 'Add New Customer',
			id: user.id,
			password: user.password,
			name: user.name,
			
			nation: user.nation,
			phone: user.phone,
			email: user.email					
		})
    }
})



app.get('/login/edit',isAuthenticated, function(req, res, next){
	var id = req.session.passport.user.id;
	req.getConnection(function(error, conn) {
		conn.query("SELECT * FROM customer WHERE id = ?", [id], function(err, rows, fields) {
			if(err) throw err
			
			// if user not found
			if (rows.length <= 0) {
				req.flash('error', 'User not found with id = ' + id)
				res.redirect('/customers')
			}
			else { // if user found
				// render to views/user/edit.ejs template file
				res.render('customers/edit_user', {
					title: 'Edit customer', 
					//data: rows[0],
					id: rows[0].id,
					password: rows[0].password,
					name: rows[0].name,
					car: rows[0].car,
					nation: rows[0].nation,
					phone: rows[0].phone,
					email: rows[0].email					
				})
			}			
		})
	})
})

// EDIT USER POST ACTION
app.put('/login/edit/(:id)', function(req, res, next) {
	req.assert('name', 'Name is required').notEmpty()           //Validate name
	
    // req.assert('email', 'A valid email is required').isEmail()  //Validate email

    var errors = req.validationErrors()
    
    if( !errors ) {   //No errors were found.  Passed Validation!
		
		/********************************************
		 * Express-validator module
		 
		req.body.comment = 'a <span>comment</span>';
		req.body.username = '   a user    ';

		req.sanitize('comment').escape(); // returns 'a &lt;span&gt;comment&lt;/span&gt;'
		req.sanitize('username').trim(); // returns 'a user'
		********************************************/
		var user = {
			id: req.sanitize('id').escape().trim(),
			password: req.sanitize('password').escape().trim(),
			name: req.sanitize('name').escape().trim(),
			car: req.body.car ? true: false,
			nation: req.sanitize('nation').escape().trim(),
			phone: req.sanitize('phone').escape().trim(),
			email: req.sanitize('email').escape().trim()
		}
		
		req.getConnection(function(error, conn) {
			conn.query("UPDATE CUSTOMER SET ? WHERE id = '" + req.params.id +"'", user, function(err, result) {
				//if(err) throw err
				if (err) {
					req.flash('error', err)
					
					// render to views/user/add.ejs
					res.render('customers/edit_user', {
						title: 'EDIT Customer',
						id: user.id,
						password: user.password,
						name: user.name,
						car: user.car,
						nation: user.nation,
						phone: user.phone,
						email: user.email
					})
				} else {
					req.flash('success', 'Data updated successfully!')
					
					// render to views/user/add.ejs
					res.redirect('/')
				}
			})
		})
	}
	else {   //Display errors to user
		var error_msg = ''
		errors.forEach(function(error) {
			error_msg += error.msg + '<br>'
		})
		req.flash('error', error_msg)
		
		/**
		 * Using req.body.name 
		 * because req.param('name') is deprecated
		 */ 
        res.render('/')
    }
})

// DELETE USER
app.delete('/login/delete/(:id)',isAuthenticated, function(req, res, next) {
	
	
	req.getConnection(function(error, conn) {
		conn.query('DELETE FROM customer WHERE id = ?',  req.params.id, function(err, result) {
			//if(err) throw err
			if (err) {
				req.flash('error', err)
				// redirect to users list page
				res.redirect('/')
			} else {
				req.flash('success', 'User deleted successfully! id = ' + req.params.id)
				// redirect to users list page
				res.redirect('/')
			}
		})
	})
})


module.exports = app;
