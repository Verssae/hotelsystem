var moment = require('moment')
var express = require('express')
var app = express()

app.get('/', function(req, res, next) {
	req.getConnection(function(error, conn) {
		conn.query("select code, number,id, name, date_format(indate, '%M %D %h %p') as indate, date_format(outdate, '%M %D %h %p') as outdate, checkIn, checkOut from reservation natural join customer",function(err, rows, fields) {
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


app.get('/add', function(req, res, next){

	req.getConnection(function(error, conn) {
		conn.query('select * from room order by number',function(err, numbers, fields) {
			if (err) throw err;
			conn.query('select * from customer ',function(err, customers, fields) {
				if (err) throw err;
				res.render('reservations/add', {
					title: 'New Reservation',
					numbers: numbers,
					customers: customers,
					indate: '2018-11-01T06:30',
					outdate: '2017-11-03T06:30'
				})
			})
		})
	})
})



app.post('/add', function(req, res, next){
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

		req.getConnection(function(error, conn) {
			conn.query(sql, params, function(err, result) {

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
								indate: '2018-11-01T06:30',
								outdate: '2017-11-03T06:30'
							})
						})
					})

				} else {

					req.flash('success', 'Data added successfully!')

					conn.query('select * from room order by number',function(err, numbers, fields) {
						if (err) throw err;
						conn.query('select * from customer ',function(err, customers, fields) {
							if (err) throw err;
							res.render('reservations/add', {
								title: 'New Reservation',
								numbers: numbers,
								customers: customers,
								indate: '2018-11-01T06:30',
								outdate: '2017-11-03T06:30'
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

        // res.render('rooms/add', {
		// 	title: 'Add New Room',
		// 	number: room.number,
		// 	type: room.type
		// })
		res.redirect('/reservations')
    }
})


app.get('/edit/(:code)', function(req, res, next){
	req.getConnection(function(error, conn) {
		conn.query('SELECT * FROM reservation WHERE code = ' + req.params.code, function(err, rows, fields) {
			if(err) throw err

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


app.put('/edit/(:code)', function(req, res, next) {
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


app.delete('/delete/(:code)', function(req, res, next) {
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
