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
		conn.query('SELECT * FROM room ORDER BY floor desc, number ',function(err, rows, fields) {
			if (err) {
				req.flash('error', err)
				res.render('rooms/list', {
					title: 'Room List', 
					data: ''
				})
			} else {
				var now = new Date();
				var indate = moment(now).format('YYYY-MM-DD');
				var outdate = indate;
				var sql = "select * from reservation natural join customer where indate <= '" +outdate+ "' and outdate >= '" + indate +"' ";
				
				conn.query(sql, function(err, reserved) {
					if (err) {
						req.flash('error', err)
						console.log(err)
						res.redirect('/')
						
					} else {
						var sql = "select * from staff right join task on staff.id = task.id"
						conn.query(sql, function(err, tasks) {
							if (err) {
								res.redirect('/')
							} else {
								var sql = "select * from staff"
						        conn.query(sql, function(err, staffs) {
                                    if (err) {
                                        res.redirect('/')
                                    } else {
                                        res.render('rooms/list', {
                                            title: 'Room List', 
                                            data: rows,
                                            reserved: reserved,
                                            staffs: staffs,
                                            tasks: tasks
                                        })
                                    }
                                })
							}
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
	
	// console.log(room)
	req.getConnection(function(error, conn) {
		var sql = "INSERT INTO ROOM (number, type, floor) values ";
		var i, j, n;
		for (i=2; i<=7; i++) {
			for (j=1; j <= 4; j++) {
				n = i*100+j;
				sql += "("+ n + ", 'standard', " + i + "),"
			}
			for (j=5; j <= 6; j++) {
				n = i*100+j;
				sql += "("+ n + ", 'executive', " + i + "),"
			}
			for (j=7; j <= 8; j++) {
				n = i*100+j;
				if(i==7 && j ==8) {
					sql += "("+ n + ", 'sweet', " + i + ")"
				} else {
					sql += "("+ n + ", 'sweet', " + i + "),"
				}
				
			}
		}
		
		conn.query(sql, function(err, result) {
			if (err) {
				req.flash('error', "이미 방이 추가된 상태입니다")
				console.log(err)

				res.redirect('/rooms')
			} else {				
				req.flash('success', '방 추가 완료')
				res.redirect('/rooms')

				// conn.query('select * from room_type ',function(err, rows, fields) {
				// 	if (err) throw err;
				// 	res.render('rooms/add', {
				// 		title: 'Add New Room',
				// 		number: '',
				// 		floor: '',
				// 		data: rows
				// 	})
				// })
			}
		})
	})

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
					console.log(err);
					
					res.redirect('/rooms')
				} else {

					
					
					var sql = "select id from task where number = " + req.params.number 
					conn.query(sql, function(err, row) {
						//if(err) throw err
						if (err) {
							console.log(err);
							
							
						} else {
							if (row.length <= 0) {
								if (req.body.id == "No Staff") {
									res.redirect('/rooms')
									return
								} else {
									sql = "insert into task (number, id) values (" + req.params.number + ", '" + req.body.id +"')"
								}
								
							} else {
								if (req.body.id == "No Staff") {
									sql = "delete from task where number = " + req.params.number
								} else {
									sql = "update task set id = '" + req.body.id + "' where number = " + req.params.number 
								}
							}

							conn.query(sql, function(err, rows) {
								if (err) {
									console.log(err);
									req.flash('error', err)
									res.redirect('/rooms')
								} else {
									req.flash('success', 'Data updated successfully!')
									res.redirect('/rooms')
								}
							})
							
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
