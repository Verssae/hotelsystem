var express = require('express')
var app = express()

app.get('/', function(req, res, next) {
	req.getConnection(function(error, conn) {
		conn.query('SELECT * FROM room natural join room_type ORDER BY number',function(err, rows, fields) {
			if (err) {
				req.flash('error', err)
				res.render('rooms/list', {
					title: 'Room List', 
					data: ''
				})
			} else {
				res.render('rooms/list', {
					title: 'Room List', 
					data: rows
				})
			}
		})
	})
})


app.get('/add', function(req, res, next){	
	
	req.getConnection(function(error, conn) {
		conn.query('select * from room_type ',function(err, rows, fields) {
			if (err) throw err;
			res.render('rooms/add', {
				title: 'Add New Room',
				number: '',
				data: rows
			})
		})
	})

	
})

app.post('/add', function(req, res, next){	
	req.assert('number', 'Room number is required').notEmpty()
	// req.assert('type', 'Room type is required').notEmpty()     
	   
    
    var errors = req.validationErrors()
    
    if( !errors ) {
		var room = {
			number: req.sanitize('number').escape().trim(),
			type: req.sanitize('type1').escape().trim(),
		}
		// console.log(req.sanitize('hour').escape().trim());
		// console.log(req)
		console.log(room)
		req.getConnection(function(error, conn) {
			conn.query('INSERT INTO room SET ?', room, function(err, result) {
				if (err) {
					req.flash('error', err)

					res.render('rooms/add', {
						title: 'Add New Room',
						number: room.number,
						data: {
							type: room.type
						}		
					})
				} else {				
					req.flash('success', 'Data added successfully!')

					conn.query('select * from room_type ',function(err, rows, fields) {
						if (err) throw err;
						res.render('rooms/add', {
							title: 'Add New Room',
							number: '',
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


app.get('/edit/(:number)', function(req, res, next){
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
						data: roomtypes
					})
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
		var room = {
			number: req.sanitize('number').escape().trim(),
			type: req.sanitize('type').escape().trim()
		}
		
		req.getConnection(function(error, conn) {
			conn.query('UPDATE room SET ? WHERE number = ' + req.params.number, room, function(err, result) {
				//if(err) throw err
				if (err) {
					req.flash('error', err)
					
					res.redirect('/rooms')
				} else {

					req.flash('success', 'Data updated successfully!')
										
					conn.query('select * from room_type ',function(err, roomtypes, fields) {
						if (err) throw err;
						res.redirect('/rooms')
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


app.delete('/delete/(:number)', function(req, res, next) {
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
