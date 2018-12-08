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
				var indate = moment(now).format('YYYY-MM-DD HH:mm:ss');
				var outdate = indate;
				var sql = "select * from reservation where indate <= '" +indate+ "' and outdate >= '" + indate +"' ";
				
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
                                        res.render('rooms/assign', {
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


app.put('/edit/(:number)',isAuthenticated, function(req, res, next) {
	req.assert('number', 'Room number is required').notEmpty()
	// req.assert('type', 'Room type is required').notEmpty()  

    var errors = req.validationErrors()
    
    if( !errors ) {

        var task = {
            number: req.params.number,
            id: req.body.id
        }
		
		req.getConnection(function(error, conn) {
			conn.query('insert into task SET ? ', task, function(err, result) {
				//if(err) throw err
				if (err) {
                    conn.query("update task set ? where number = '"+task.number+"'", task, function(err, rows) {
                        if (err) {
                            req.flash('error', err)
					        res.redirect('/assign')
                        } else {
                            req.flash('success', 'Data updated successfully!')
					        res.redirect('/assign')
                        }
                    })
					
				} else {
					req.flash('success', 'Data updated successfully!')
					res.redirect('/assign')
					
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
		res.redirect('/assign')
    }
})

module.exports = app