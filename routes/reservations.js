var moment = require('moment')
var datetime = require('date-and-time');
var express = require('express')
var app = express()
var isAuthenticated = function (req, res, next) {
	if (req.isAuthenticated())
	  return next();
	res.redirect('/login');
  };

app.get('/',isAuthenticated, function(req, res, next) {
	req.getConnection(function(error, conn) {
		conn.query("select code, number,id, name, date_format(indate, '%m월 %d일 %h %p') as indate, date_format(outdate, '%m월 %d일 %h %p') as outdate, checkIn, checkOut from reservation natural join customer order by indate",function(err, rows, fields) {
			if (err) {
				req.flash('error', err)
				res.render('reservations/list', {
					title: 'reservations',
					data: ''
				})
			} else {
				res.render('reservations/list', {
					title: 'reservations',
					data: rows
				})
			}
		})
	})
})


app.get('/add', isAuthenticated,function(req, res, next){

	req.getConnection(function(error, conn) {
		conn.query('select * from room order by number',function(err, numbers, fields) {
			if (err) throw err;
			conn.query('select * from customer ',function(err, customers, fields) {
				if (err) throw err;
				var now = new Date();
				res.render('reservations/add', {
					title: 'New Reservation',
					numbers: numbers,
					customers: customers,
					indate: datetime.format(now, 'YYYY-MM-DDTHH:mm:ss'),
					outdate: datetime.format(datetime.addDays(now, 1), 'YYYY-MM-DDTHH:mm:ss')
				})
			})
		})
	})
})

app.get('/check',isAuthenticated, function(req, res, next){

	req.getConnection(function(error, conn) {
		conn.query('select * from room order by number',function(err, numbers, fields) {
			if (err) throw err;
			conn.query('select * from customer ',function(err, customers, fields) {
				if (err) throw err;
				var now = new Date();
				res.render('reservations/check', {
					title: 'New Reservation',
					indate: datetime.format(now, 'YYYY-MM-DDTHH:mm:ss'),
					outdate: datetime.format(datetime.addDays(now, 1), 'YYYY-MM-DDTHH:mm:ss')
				})
			})
		})
	})
})

app.post('/check',isAuthenticated, function(req, res, next) {
	// req.assert('number', 'Room number is required').notEmpty()
	// req.assert('type', 'Room type is required').notEmpty()


    var errors = false;

    if( !errors ) {

		var indate = moment(req.body.indate).format('YYYY-MM-DD HH:mm:ss');
		var outdate = moment(req.body.outdate).format('YYYY-MM-DD HH:mm:ss');
		var sql = "select number from room where number not in (select number from reservation where indate <= '" + outdate + "' and outdate >= '" + indate +"') order by number";
		console.log("post check")
		console.log(indate)
		console.log(outdate)

		req.getConnection(function(error, conn) {
			conn.query(sql, function(err, numbers) {
				if (err) throw err;
					conn.query('select * from customer ',function(err, customers, fields) {
						if (err) throw err;
						res.render('reservations/add', {
							title: 'New Reservation',
							numbers: numbers,
							customers: customers,
							indate: req.body.indate,
							outdate: req.body.outdate
						})
					})
			})
		})
	} else {   //Display errors to user
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
		res.redirect('/reservations')
    }
})



app.post('/add',isAuthenticated, function(req, res, next){
	req.assert('number', 'Room number is required').notEmpty()
	// req.assert('type', 'Room type is required').notEmpty()


    var errors = req.validationErrors()

    if( !errors ) {


		var sql = "insert into reservation set ?";
		var params = {
			id:req.body.customer,
			number: req.body.number,
			indate: moment(req.body.indate).format('YYYY-MM-DD HH:mm:ss'),
			outdate: moment(req.body.outdate).format('YYYY-MM-DD HH:mm:ss'),
			checkIn: req.body.checkIn ? true: false,
			checkOut: req.body.checkOut ? true : false
		};

		console.log("post add")
		console.log(req.body.indate)
		console.log(req.body.outdate)

		req.getConnection(function(error, conn) {
			conn.query(sql, params, function(err, result) {
				var now = new Date();
				if (err) {
					req.flash('error', err)
					console.log(err);
					conn.query('select * from room order by number',function(err, numbers, fields) {
						if (err) throw err;
						conn.query('select * from customer ',function(err, customers, fields) {
							if (err) throw err;
							res.render('reservations/add', {
								title: 'New Reservation',
								numbers: numbers,
								customers: customers,
								indate: datetime.format(now, 'YYYY-MM-DDTHH:mm:ss'),
								outdate: datetime.format(datetime.addDays(now, 1), 'YYYY-MM-DDTHH:mm:ss')
							})
						})
					})

				} else {

					req.flash('success', 'Data added successfully!')

					// conn.query('select * from room order by number',function(err, numbers, fields) {
					// 	if (err) throw err;
					// 	conn.query('select * from customer ',function(err, customers, fields) {
					// 		if (err) throw err;
					// 		res.render('reservations/add', {
					// 			title: 'New Reservation',
					// 			numbers: numbers,
					// 			customers: customers,
					// 			indate: datetime.format(now, 'YYYY-MM-DDTHH:mm:ss'),
					// 			outdate: datetime.format(datetime.addDays(now, 1), 'YYYY-MM-DDTHH:mm:ss')
					// 		})
					// 	})
					// })
					res.redirect("/reservations")
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
		res.redirect('/reservations')
    }
})


app.get('/edit/(:code)',isAuthenticated, function(req, res, next){
	req.getConnection(function(error, conn) {
		conn.query('SELECT * FROM reservation WHERE code = ' + req.params.code, function(err, rows, fields) {
			if(err) throw err;

			if (rows.length <= 0) {
				req.flash('error', 'Reservation not found with code = ' + req.params.code)
				res.redirect('/reservations')
			}
			else {
				conn.query('select * from room_type ',function(err, roomtypes, fields) {
					if (err) throw err;

					conn.query('select * from room order by number',function(err, numbers, fields) {
						if (err) throw err;
						conn.query('select * from customer ',function(err, customers, fields) {
							if (err) throw err;
							res.render('reservations/edit', {
								title: 'Edit Reservation',
								code: rows[0].code,
								numbers: numbers,
								customers: customers,
								indate: moment(rows[0].indate).format('YYYY-MM-DDTHH:mm:ss'),
								outdate: moment(rows[0].outdate).format('YYYY-MM-DDTHH:mm:ss'),
								numbered: rows[0].number,
								ided: rows[0].id,
								checkIned: rows[0].checkIn,
								checkOuted: rows[0].checkOut
							})
						})
					})
				})
			}
		})
	})
})


app.put('/edit/(:code)',isAuthenticated, function(req, res, next) {
	req.assert('number', 'Room number is required').notEmpty()
	// req.assert('type', 'Room type is required').notEmpty()

    var errors = req.validationErrors()

    if( !errors ) {
		var sql = "update reservation set ? where code = ";
		var params = {
			id:req.body.customer,
			number: req.body.number,
			indate: moment(req.body.indate).format('YYYY-MM-DD HH:mm:ss'),
			outdate: moment(req.body.outdate).format('YYYY-MM-DD HH:mm:ss'),
			checkIn: req.body.checkIn ? true: false,
			checkOut: req.body.checkOut ? true : false
		};

		req.getConnection(function(error, conn) {
			conn.query(sql + req.params.code, params, function(err, result) {
				//if(err) throw err
				if (err) {
					req.flash('error', err)

					res.redirect('/reservations')
				} else {

					req.flash('success', 'Data updated successfully!')

					conn.query('select * from room order by number',function(err, numbers, fields) {
						if (err) throw err;
						conn.query('select * from customer ',function(err, customers, fields) {
							if (err) throw err;
							res.render('reservations/edit', {
								title: 'Edit Reservation',
								code: req.body.code,
								numbers: numbers,
								customers: customers,
								indate: moment(req.body.indate).format('YYYY-MM-DDTHH:mm:ss'),
								outdate: moment(req.body.outdate).format('YYYY-MM-DDTHH:mm:ss'),
								numbered: req.body.number,
								ided: req.body.id,
								checkIned: req.body.checkIn,
								checkOuted: req.body.checkOut
							})
						})
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
		res.redirect('/rooms')
    }
})


app.delete('/delete/(:code)',isAuthenticated, function(req, res, next) {
	var reserve = { code: req.params.code }

	req.getConnection(function(error, conn) {
		conn.query('DELETE FROM reservation WHERE code = ' + req.params.code, function(err, result) {
			//if(err) throw err
			if (err) {
				req.flash('error', err)
				// redirect to users list page
				res.redirect('/reservations')
			} else {
				req.flash('success', 'Reservation deleted successfully! code = ' + req.params.code)
				// redirect to users list page
				res.redirect('/reservations')
			}
		})
	})
})

module.exports = app
