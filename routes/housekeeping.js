var express = require('express')
var app = express()
var isAuthenticated = function (req, res, next) {
	if (req.isAuthenticated())
	  return next();
	res.redirect('/login');
  };

app.get('/',isAuthenticated, function(req, res, next) {
	req.getConnection(function(error, conn) {
		conn.query('SELECT * FROM housekeeping ORDER BY number',function(err, rows, fields) {
			if (err) {
				req.flash('error', err)
				res.render('housekeeping/list', {
					title: 'housekeeping',
					data: ''
				})
			} else {
				res.render('housekeeping/list', {
					title: 'housekeeping',
					data: rows
				})
			}
		})
	})
})


app.get('/add',isAuthenticated, function(req, res, next){

	req.getConnection(function(error, conn) {
		conn.query('select * from room order by number',function(err, numbers, fields) {
			if (err) throw err;
			res.render('housekeeping/add', {
				title: 'New Housekeeping',
				numbers: numbers,
				clean: req.body.clean,
				amenity: req.body.amenity,
				linen: req.body.linen,
				order_take: req.body.order_take
			})
		})
	})
})

app.post('/add',isAuthenticated, function(req, res, next){
	req.assert('number', 'Room number is required').notEmpty()
	// req.assert('type', 'Room type is required').notEmpty()


    var errors = req.validationErrors()

    if( !errors ) {
		var housekeep = {
			number: req.body.number,
			clean: req.body.clean,
			amenity: req.body.amenity,
			linen: req.body.linen,
			order_take: req.body.order_take
		}
		// console.log(req.sanitize('hour').escape().trim());
		// console.log(req)
		req.getConnection(function(error, conn) {
			conn.query('INSERT INTO housekeeping SET ?', housekeep, function(err, result) {
				if (err) {
					req.flash('error', err)
					console.log(err);
					conn.query('select * from room order by number',function(err, numbers, fields) {
						if (err) throw err;
						res.render('housekeeping/add', {
							title: 'New Housekeeping',
							numbers: numbers,
							clean: housekeep.clean,
							amenity: housekeep.amenity,
							linen: housekeep.linen,
							order_take: housekeep.order_take
						})
					})
				} else {
					req.flash('success', 'Data added successfully!')

					res.redirect("/housekeeping")
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

        // res.render('rooms/add', {
		// 	title: 'Add New Room',
		// 	number: room.number,
		// 	type: room.type
		// })
		res.redirect('/housekeeping')
    }
})


app.get('/edit/(:number)',isAuthenticated, function(req, res, next){
	req.getConnection(function(error, conn) {
		conn.query('SELECT * FROM housekeeping WHERE number = ' + req.params.number, function(err, rows, fields) {
			if(err) throw err;

			if (rows.length <= 0) {
				req.flash('error', 'housekeeping not found with number = ' + req.params.number)
				res.redirect('/housekeeping')
			}
			else {
				conn.query('select * from room order by number',function(err, numbers, fields) {
					if (err) throw err;
					res.render('housekeeping/edit', {
						title: 'Edit Housekeeping',
						numbers: numbers,
						clean: rows[0].clean,
						amenity: rows[0].amenity,
						linen: rows[0].linen,
						order_take: rows[0].order_take
					})
				})
			}
		})
	})
})


app.put('/edit/(:number)', isAuthenticated,function(req, res, next) {
	req.assert('number', 'Room number is required').notEmpty()
	// req.assert('type', 'Room type is required').notEmpty()

    var errors = req.validationErrors()

    if( !errors ) {
			var housekeep = {
				number: req.body.number,
				clean: req.body.clean,
				amenity: req.body.amenity,
				linen: req.body.linen,
				order_take: req.body.order_take
			}

		req.getConnection(function(error, conn) {
			conn.query('UPDATE housekeeping SET ? WHERE number = ' + housekeep.number, housekeep, function(err, result) {
				//if(err) throw err
				if (err) {
					req.flash('error', err)

					res.redirect("/housekeeping")
				} else {
					req.flash('success', 'Data updated successfully!')
					/*
					conn.query('select * from room order by number',function(err, numbers, fields) {
						if (err) throw err;
						res.render('housekeeping/edit', {
							title: 'Edit Housekeeping',
							numbers: numbers,
							clean: req.body.clean,
							amenity: req.body.amenity,
							linen: req.body.linen,
							order_take: req.body.order_take
						})
					})
					*/
					res.redirect("/housekeeping")
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

        // res.render('rooms/edit', {
		// 	title: 'Edit Room',
		// 	number: req.params.number, //or req.body.number
		// 	type: req.body.type
		// })
		res.redirect("/housekeeping")
  }
})


app.delete('/delete/(:number)',isAuthenticated, function(req, res, next) {
	var housekeeping = { number: req.params.number }

	req.getConnection(function(error, conn) {
		conn.query('DELETE FROM housekeeping WHERE number = ' + req.params.number, function(err, result) {
			//if(err) throw err
			if (err) {
				req.flash('error', err)
				// redirect to users list page
				res.redirect('/housekeeping')
			} else {
				req.flash('success', 'Housekeeping deleted successfully! number = ' + req.params.number)
				// redirect to users list page
				res.redirect('/housekeeping')
			}
		})
	})
})

module.exports = app
