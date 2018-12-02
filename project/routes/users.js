var express = require('express')
var app = express()

// SHOW LIST OF USERS
app.get('/', function(req, res, next) {
	req.getConnection(function(error, conn) {
		conn.query('SELECT * FROM customer ORDER BY id DESC',function(err, rows, fields) {
			//if(err) throw err
			if (err) {
				req.flash('error', err)
				res.render('user/list', {
					title: 'Customer List',
					data: ''
				})
			} else {
				// render to views/user/list.ejs template file
				res.render('user/list', {
					title: 'Customer List',
					data: rows
				})
			}
		})
	})
})

// SHOW ADD USER FORM
app.get('/add', function(req, res, next){
	// render to views/user/add.ejs
	res.render('user/add', {
		title: 'Add New Customer',
		name: '',
		car: '',
		nation: '',
		phone: '',
		email: ''
	})
})

// ADD NEW USER POST ACTION
app.post('/add', function(req, res, next){
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
			name: req.sanitize('name').escape().trim(),
			car: req.sanitize('car').escape().trim(),
			nation: req.sanitize('nation').escape().trim(),
			phone: req.sanitize('phone').escape().trim(),
			email: req.sanitize('email').escape().trim()
		}

		req.getConnection(function(error, conn) {
			conn.query('INSERT INTO customer SET ?', user, function(err, result) {
				//if(err) throw err
				if (err) {
					req.flash('error', err)

					// render to views/user/add.ejs
					res.render('user/add', {
						title: 'Add New Customer',
						name: user.name,
						car: user.car,
						nation: user.nation,
						phone: user.phone,
						email: user.email
					})
				} else {
					req.flash('success', 'Data added successfully!')

					// render to views/user/add.ejs
					res.render('user/add', {
						title: 'Add New Customer',
						name: '',
						car: '',
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
        res.render('user/add', {
            title: 'Add New Customer',
			name: user.name,
			car: user.car,
			nation: user.nation,
			phone: user.phone,
			email: user.email
        })
    }
})

// SHOW EDIT USER FORM
app.get('/edit/(:id)', function(req, res, next){
	req.getConnection(function(error, conn) {
		conn.query('SELECT * FROM customer WHERE id = ' + req.params.id, function(err, rows, fields) {
			if(err) throw err

			// if user not found
			if (rows.length <= 0) {
				req.flash('error', 'User not found with id = ' + req.params.id)
				res.redirect('/users')
			}
			else { // if user found
				// render to views/user/edit.ejs template file
				res.render('user/edit', {
					title: 'Edit User',
					//data: rows[0],
					id: rows[0].id,
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
app.put('/edit/(:id)', function(req, res, next) {
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
			name: req.sanitize('name').escape().trim(),
			car: req.sanitize('car').escape().trim(),
			nation: req.sanitize('nation').escape().trim(),
			phone: req.sanitize('phone').escape().trim(),
			email: req.sanitize('email').escape().trim()
		}

		req.getConnection(function(error, conn) {
			conn.query('UPDATE CUSTOMER SET ? WHERE id = ' + req.params.id, user, function(err, result) {
				//if(err) throw err
				if (err) {
					req.flash('error', err)

					// render to views/user/add.ejs
					res.render('user/edit', {
						title: 'EDIT Customer',
						name: user.name,
						car: user.car,
						nation: user.nation,
						phone: user.phone,
						email: user.email
					})
				} else {
					req.flash('success', 'Data updated successfully!')

					// render to views/user/add.ejs
					res.render('user/edit', {
						title: 'Edit Customer',
						id: req.params.id,
						name: req.body.name,
						car: req.body.car,
						nation: req.body.nation,
						phone: req.body.phone,
						email: req.body.email
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
        res.render('user/edit', {
            title: 'Edit Customer',
			id: req.params.id,
			name: req.body.name,
			car: req.body.car,
			nation: req.body.nation,
			phone: req.body.phone,
			email: req.body.email
        })
    }
})

// DELETE USER
app.delete('/delete/(:id)', function(req, res, next) {
	var user = { id: req.params.id }

	req.getConnection(function(error, conn) {
		conn.query('DELETE FROM customer WHERE id = ' + req.params.id, user, function(err, result) {
			//if(err) throw err
			if (err) {
				req.flash('error', err)
				// redirect to users list page
				res.redirect('/users')
			} else {
				req.flash('success', 'User deleted successfully! id = ' + req.params.id)
				// redirect to users list page
				res.redirect('/users')
			}
		})
	})
})

module.exports = app
