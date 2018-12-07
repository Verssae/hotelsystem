var express = require('express')
var app = express()
var isAuthenticated = function (req, res, next) {
	if (req.isAuthenticated())
	  return next();
	res.redirect('/login');
  };
// SHOW LIST OF USERS
app.get('/',isAuthenticated, function(req, res, next) {
	req.getConnection(function(error, conn) {
		conn.query('SELECT * FROM staff ORDER BY id DESC',function(err, rows, fields) {
			//if(err) throw err
			if (err) {
				req.flash('error', err)
				res.render('staffs/list', {
					title: 'Staff List',
					staffs: ''
				})
			} else {
				// render to views/user/list.ejs template file
				res.render('staffs/list', {
					title: 'Staff List',
					staffs: rows
				})
			}
		})
	})
})

// SHOW ADD USER FORM
app.get('/add',isAuthenticated, function(req, res, next){
	// render to views/user/add.ejs
	res.render('staffs/add', {
		title: 'Add New Staff',
		id: 'id',
		password: 'password',
		name: '',
		gender: '',
		birth: ''
	})
})

// ADD NEW USER POST ACTION
app.post('/add',isAuthenticated, function(req, res, next){
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
		var staff = {
			id: req.body.id,
			password: req.body.password,
			name: req.body.name,
			gender: req.body.gender,
			birth: req.body.birth
		}

		req.getConnection(function(error, conn) {
			conn.query('INSERT INTO staff SET ?', staff, function(err, result) {
				//if(err) throw err
				if (err) {
					req.flash('error', err)

					// render to views/user/add.ejs
					res.render('staffs/add', {
						title: 'Add New Staff',
						id: staff.id,
						password: staff.password,
						name: staff.name,
						gender: staff.gender,
						birth: staff.birth
					})
				} else {
					req.flash('success', 'Data added successfully!')

					// render to views/user/add.ejs
					res.render('staffs/add', {
						title: 'Add New Staff',
						id: '',
						password: '',
						name: '',
						gender: '',
						birth: ''

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
        res.redirect("/staffs");
    }
})

// SHOW EDIT USER FORM
app.get('/edit/(:id)', isAuthenticated,function(req, res, next){
	req.getConnection(function(error, conn) {
		conn.query("SELECT * FROM staff WHERE id = '" + req.params.id+"'", function(err, rows, fields) {
			if(err) throw err

			// if user not found
			if (rows.length <= 0) {
				req.flash('error', 'Staff not found with id = ' + req.params.id)
				res.redirect('/staffs')
			}
			else { // if user found
				// render to views/user/edit.ejs template file
				res.render('staffs/edit', {
					title: 'Edit staff',
					//data: rows[0],
					id: rows[0].id,
					password: rows[0].password,
					name: rows[0].name,
					gender: rows[0].gender,
					birth: rows[0].birth
				})
			}
		})
	})
})

// EDIT USER POST ACTION
app.put('/edit/(:id)', isAuthenticated,function(req, res, next) {
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
		var staff = {
			id: req.body.id,
			password: req.body.password,
			name: req.body.name,
			gender: req.body.gender,
			birth: req.body.birth
		}

		req.getConnection(function(error, conn) {
			conn.query("UPDATE staff SET ? WHERE id = '" + req.params.id+"'", staff, function(err, result) {
				//if(err) throw err
				if (err) {
					req.flash('error', err)

					// render to views/user/add.ejs
					res.redirect("/staffs")
				} else {
					req.flash('success', 'Data updated successfully!')

					// render to views/user/add.ejs
					res.render('staffs/edit', {
						title: 'Edit staff',
						id: req.params.id,
						password: req.body.password,
						name: req.body.name,
						gender: req.body.gender,
						birth: req.body.birth
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
        res.redirect("/staffs")
    }
})

// DELETE USER
app.delete('/delete/(:id)',isAuthenticated, function(req, res, next) {
	var staff = { id: req.params.id }

	req.getConnection(function(error, conn) {
		conn.query('DELETE FROM staff WHERE id = ' + req.params.id, staff, function(err, result) {
			//if(err) throw err
			if (err) {
				req.flash('error', err)
				// redirect to users list page
				res.redirect('/staffs')
			} else {
				req.flash('success', 'staff deleted successfully! id = ' + req.params.id)
				// redirect to users list page
				res.redirect('/staffs')
			}
		})
	})
})

module.exports = app
