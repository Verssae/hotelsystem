var express = require('express')
var app = express()
var datetime = require('date-and-time')
var moment = require('moment')
var isAuthenticated = function (req, res, next) {
	if (req.isAuthenticated())
	  return next();
	res.redirect('/login');
  };

app.get('/',isAuthenticated, function(req, res, next) {
	req.getConnection(function(error, conn) {
		conn.query('SELECT * FROM room natural left outer join housekeeping ORDER BY floor desc, number ',function(err, rows, fields) {
			if (err) {
				req.flash('error', err)
				res.render('rooms/list', {
					title: 'Room List', 
					data: ''
				})
			} else {
				var now = new Date();
				var indate = moment(now).format('YYYY-MM-DD HH:mm:ss');
				var outdate = indate;
				var sql = "select * from reservation where indate <= '" +indate+ "' and outdate >= '" + indate +"' ";
				
				conn.query(sql, function(err, reserved) {
					if (err) {
						req.flash('error', err)
						console.log(err)
						res.redirect('/')
						
					} else {
						res.render('rooms/list', {
							title: 'Room List', 
							data: rows,
							reserved: reserved,
							// date: datetime.format(now, 'YYYY-MM-DDTHH:mm:ss')
						})
					}

				})
			}
		})
	})
	

	
})


app.get('/add',isAuthenticated, function(req, res, next){	
	
	req.getConnection(function(error, conn) {
		conn.query('select * from room_type ',function(err, rows, fields) {
			if (err) throw err;
			res.render('rooms/add', {
				title: 'Add New Room',
				number: '',
				floor: '',
				data: rows
			})
		})
	})
	
})


app.post('/add',isAuthenticated, function(req, res, next){	
	req.assert('number', 'Room number is required').notEmpty()
	// req.assert('type', 'Room type is required').notEmpty()     
	   
    
    var errors = req.validationErrors()
    
    if( !errors ) {
		var room = {
			number: req.sanitize('number').escape().trim(),
			type: req.sanitize('type1').escape().trim(),
			floor: req.sanitize('floor').escape().trim()
		}
		// console.log(req.sanitize('hour').escape().trim());
		// console.log(req)
		console.log(room)
		req.getConnection(function(error, conn) {
			conn.query('INSERT INTO room SET ?', room, function(err, result) {
				if (err) {
					req.flash('error', err)

					res.redirect('/rooms')
				} else {				
					req.flash('success', 'Data added successfully!')

					conn.query('select * from room_type ',function(err, rows, fields) {
						if (err) throw err;
						res.render('rooms/add', {
							title: 'Add New Room',
							number: '',
							floor: '',
							data: rows
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
		res.redirect('/rooms')
    }
})


app.get('/edit/(:number)',isAuthenticated, function(req, res, next){
	req.getConnection(function(error, conn) {
		conn.query('SELECT * FROM room WHERE number = ' + req.params.number, function(err, rows, fields) {
			if(err) throw err
			
			if (rows.length <= 0) {
				req.flash('error', 'Room not found with number = ' + req.params.number)
				res.redirect('/rooms')
			}
			else { 
				conn.query('select * from room_type ',function(err, roomtypes, fields) {
					if (err) throw err;
					res.render('rooms/edit', {
						title: 'Edit User',
						number: rows[0].number,
						typed: rows[0].type,
						floor: rows[0].floor,
						data: roomtypes
					})
				})
			}			
		})
	})
})


app.put('/edit/(:number)',isAuthenticated, function(req, res, next) {
	req.assert('number', 'Room number is required').notEmpty()
	// req.assert('type', 'Room type is required').notEmpty()  

    var errors = req.validationErrors()
    
    if( !errors ) {
		var room = {
			number: req.sanitize('number').escape().trim(),
			floor: req.sanitize('floor').escape().trim()
		}
		var housekeeping = {
			clean: req.body.clean ? true: false,
			linen: req.body.linen ? true: false,
			amenity: req.body.amenity ? true: false,
			order_take: req.body.order_take
		}
		
		req.getConnection(function(error, conn) {
			conn.query('UPDATE room SET ? WHERE number = ' + req.params.number, room, function(err, result) {
				//if(err) throw err
				if (err) {
					req.flash('error', err)
					
					res.redirect('/rooms')
				} else {

					conn.query('UPDATE housekeeping SET ? WHERE number = ' + req.params.number, housekeeping, function(err, result) {
						//if(err) throw err
						if (err) {
							req.flash('error', err)
							res.redirect('/rooms')
						} else {
							req.flash('success', 'Data updated successfully!')
							res.redirect('/rooms')
						}
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


app.delete('/delete/(:number)',isAuthenticated, function(req, res, next) {
	var room = { number: req.params.number }
	
	req.getConnection(function(error, conn) {
		conn.query('DELETE FROM room WHERE number = ' + req.params.number, room, function(err, result) {
			//if(err) throw err
			if (err) {
				req.flash('error', err)
				// redirect to users list page
				res.redirect('/rooms')
			} else {
				req.flash('success', 'Room deleted successfully! number = ' + req.params.number)
				// redirect to users list page
				res.redirect('/rooms')
			}
		})
	})
})



module.exports = app
