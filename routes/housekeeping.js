var express = require('express')
var app = express()

app.get('/', function(req, res, next) {
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


app.get('/add', function(req, res, next){

	req.getConnection(function(error, conn) {
		res.render('housekeeping/add', {
			title: 'New Housekeeping',
			clean: req.body.cleaned,
			amenity: req.body.amenity,
			linen: req.body.linen,
			ordertake: req.body.ordertake
		})
	})
})

app.post('/add', function(req, res, next){
	req.assert('number', 'Room number is required').notEmpty()
	// req.assert('type', 'Room type is required').notEmpty()


    var errors = req.validationErrors()

    if( !errors ) {
		var housekeep = {
			clean: req.body.cleaned,
			amenity: req.sanitize('amenity').escape().trim(),
			linen: req.sanitize('linen').escape().trim(),
			ordertake: req.sanitize('ordertake').escape().trim()
		};
		// console.log(req.sanitize('hour').escape().trim());
		// console.log(req)
		req.getConnection(function(error, conn) {
			conn.query('INSERT INTO housekeeping SET ?', housekeep, function(err, result) {
				if (err) {
					req.flash('error', err)
					console.log(err);
					res.render('housekeeping/add', {
						title: 'New Housekeeping',
						clean: req.body.cleaned,
						amenity: req.body.amenity,
						linen: req.body.linen,
						ordertake: req.body.ordertake
					})
				} else {
					req.flash('success', 'Data added successfully!')

					res.render('housekeeping/add', {
						title: 'New Housekeeping',
						clean: req.body.cleaned,
						amenity: req.body.amenity,
						linen: req.body.linen,
						ordertake: req.body.ordertake
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

        // res.render('rooms/add', {
		// 	title: 'Add New Room',
		// 	number: room.number,
		// 	type: room.type
		// })
		res.redirect('/housekeeping')
    }
})


app.get('/edit/(:number)', function(req, res, next){
	req.getConnection(function(error, conn) {
		conn.query('SELECT * FROM housekeeping WHERE number = ' + req.params.number, function(err, rows, fields) {
			if(err) throw err

			if (rows.length <= 0) {
				req.flash('error', 'housekeeping not found with number = ' + req.params.number)
				res.redirect('/housekeeping')
			}
			else {
				res.render('housekeeping/edit', {
					title: 'Edit Housekeeping',
					number: rows[0].number,
					clean: req.body.cleaned,
					amenity: req.body.amenity,
					linen: req.body.linen,
					ordertake: req.body.ordertake
				})
			}
		})
	})
})


app.put('/edit/(:number)', function(req, res, next) {
	req.assert('number', 'Room number is required').notEmpty()
	// req.assert('type', 'Room type is required').notEmpty()

    var errors = req.validationErrors()

    if( !errors ) {
			var housekeep = {
				clean: req.sanitize('clean').escape().trim(),
				amenity: req.sanitize('amenity').escape().trim(),
				linen: req.sanitize('linen').escape().trim(),
				ordertake: req.sanitize('ordertake').escape().trim()
			};

		req.getConnection(function(error, conn) {
			conn.query('UPDATE housekeeping SET ? WHERE number = ' + req.params.number, housekeep, function(err, result) {
				//if(err) throw err
				if (err) {
					req.flash('error', err)

					res.render('housekeeping/edit', {
						title: 'Edit Housekeeping',
						clean: housekeep.clean,
						amenity: housekeep.amenity,
						linen: housekeep.linen,
						ordertake: housekeep.ordertake
					})
				} else {
					req.flash('success', 'Data updated successfully!')

					res.render('housekeeping/edit', {
						title: 'Edit Housekeeping',
						number: rows[0].number,
						clean: req.body.cleaned,
						amenity: req.body.amenity,
						linen: req.body.linen,
						ordertake: req.body.ordertake
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

        // res.render('rooms/edit', {
		// 	title: 'Edit Room',
		// 	number: req.params.number, //or req.body.number
		// 	type: req.body.type
		// })
		res.render('housekeeping/edit', {
			title: 'Edit Housekeeping',
			number: rows[0].number,
			clean: req.body.cleaned,
			amenity: req.body.amenity,
			linen: req.body.linen,
			ordertake: req.body.ordertake
		})
  }
})


app.delete('/delete/(:number)', function(req, res, next) {
	var housekeeping = { number: req.params.number }

	req.getConnection(function(error, conn) {
		conn.query('DELETE FROM housekeeping WHERE number = ' + req.params.number, housekeep, function(err, result) {
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
