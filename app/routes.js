// MiddleWare
const multipart = require('connect-multiparty')
const multipartMiddleware = multipart()

// Models
const Item = require('./models/item')
const User = require('./models/user')
const Room = require('./models/room')

// Controllers
const amazon = require('../services/amazonApi')
const itemController = require('../controller/item.controller')
const Upload = require('../controller/upload.controller')

module.exports = function(app, passport) {

	// route middleware to ensure user is logged in
	function isLoggedIn(req, res, next) {
		if (req.isAuthenticated())
			return next();
		console.log(req.user)
		res.redirect('/login');
	}

// normal routes ===============================================================

	app.get("/admin/users", function(req, res) {
		User.find({}, function(err, users) {
			if(err) {
				console.log(err)
			} else {
				res.send(users)
			}
		})
	})

	app.get("/admin/users/delete", function(req, res) {
		User.remove({}, function(err, result){
			if(err) {
				console.log(err)
			} else {
				console.log("DELETED EVERYONE")
				res.redirect('/admin/users')
			}
		})
	})

	// ITEMS
	app.get('/admin/items', (req, res) => {
		Item.find({}, (err, items) => {
			if(err) console.log(err)
			else res.send(items)
		})
	})

	app.get('/admin/items/delete', (req, res) => {
		Item.remove({}, (err, result) => {
			if(err) console.log(err)
			else res.redirect('/admin/items')
		})
	})

	// ROOMS
	app.get('/admin/rooms', (req, res) => {
		Room.find({}, (err, rooms) => {
			if(err) console.log(err)
			else res.send(rooms)
		})
	})

	app.get('/admin/rooms/delete', (req, res) => {
		Room.remove({}, (err, result) => {
			if(err) console.log(err)
			else res.redirect('/admin/rooms')
		})
	})



	// show the home page (will also have our login links)
	app.get('/', function(req, res) {
		res.render('pages/index.html');
	});

	// PROFILE SECTION =========================
	app.get('/profile', isLoggedIn, function(req, res) {
		console.log(req)
		User.findOne(req.user, (err, user) => {
			if(err) {
				console.log(err)
			} else {
				console.log("found user: ", user)
				res.render('pages/profile.html', { "user" : user});
			}
		})
	});

	// LOGOUT ==============================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

	// locally --------------------------------
		// LOGIN ===============================
		// show the login form
		app.get('/login', function(req, res) {
			res.render('pages/login.html', { message: req.flash('loginMessage') });
		});

		// process the login form
		app.post('/login', passport.authenticate('local-login', {
			successRedirect : '/profile', // redirect to the secure profile section
			failureRedirect : '/login', // redirect back to the signup page if there is an error
			failureFlash : true // allow flash messages
		}));

		// SIGNUP =================================
		// show the signup form
		app.get('/signup', function(req, res) {
			res.render('pages/signup.html', { message: req.flash('loginMessage') });
		});

		// process the signup form
		app.post('/signup', passport.authenticate('local-signup', {
			successRedirect : '/profile', // redirect to the secure profile section
			failureRedirect : '/signup', // redirect back to the signup page if there is an error
			failureFlash : true // allow flash messages
		}));

	// facebook -------------------------------

		// send to facebook to do the authentication
		app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

		// handle the callback after facebook has authenticated the user
		app.get('/auth/facebook/callback',
			passport.authenticate('facebook', {
				successRedirect : '/profile',
				failureRedirect : '/'
			}));

	// twitter --------------------------------

		// send to twitter to do the authentication
		app.get('/auth/twitter', passport.authenticate('twitter', { scope : 'email' }));

		// handle the callback after twitter has authenticated the user
		app.get('/auth/twitter/callback',
			passport.authenticate('twitter', {
				successRedirect : '/profile',
				failureRedirect : '/'
			}));


	// google ---------------------------------

		// send to google to do the authentication
		app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

		// the callback after google has authenticated the user
		app.get('/auth/google/callback',
			passport.authenticate('google', {
				successRedirect : '/profile',
				failureRedirect : '/'
			}));

// =============================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// =============================================================================

	// locally --------------------------------
		app.get('/connect/local', function(req, res) {
			res.render('pages/connect-local.html', { message: req.flash('loginMessage') });
		});
		app.post('/connect/local', passport.authenticate('local-signup', {
			successRedirect : '/profile', // redirect to the secure profile section
			failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
			failureFlash : true // allow flash messages
		}));

	// facebook -------------------------------

		// send to facebook to do the authentication
		app.get('/connect/facebook', passport.authorize('facebook', { scope : 'email' }));

		// handle the callback after facebook has authorized the user
		app.get('/connect/facebook/callback',
			passport.authorize('facebook', {
				successRedirect : '/profile',
				failureRedirect : '/'
			}));

	// twitter --------------------------------

		// send to twitter to do the authentication
		app.get('/connect/twitter', passport.authorize('twitter', { scope : 'email' }));

		// handle the callback after twitter has authorized the user
		app.get('/connect/twitter/callback',
			passport.authorize('twitter', {
				successRedirect : '/profile',
				failureRedirect : '/'
			}));


	// google ---------------------------------

		// send to google to do the authentication
		app.get('/connect/google', passport.authorize('google', { scope : ['profile', 'email'] }));

		// the callback after google has authorized the user
		app.get('/connect/google/callback',
			passport.authorize('google', {
				successRedirect : '/profile',
				failureRedirect : '/'
			}));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

	// local -----------------------------------
	app.get('/unlink/local', function(req, res) {
		var user            = req.user;
		user.local.email    = undefined;
		user.local.password = undefined;
		user.save(function(err) {
			res.redirect('/profile');
		});
	});

	// facebook -------------------------------
	app.get('/unlink/facebook', function(req, res) {
		var user            = req.user;
		user.facebook.token = undefined;
		user.save(function(err) {
			res.redirect('/profile');
		});
	});

	// twitter --------------------------------
	app.get('/unlink/twitter', function(req, res) {
		var user           = req.user;
		user.twitter.token = undefined;
		user.save(function(err) {
			res.redirect('/profile');
		});
	});

	// google ---------------------------------
	app.get('/unlink/google', function(req, res) {
		var user          = req.user;
		user.google.token = undefined;
		user.save(function(err) {
			res.redirect('/profile');
		});
	});

// =============================================================================
// APP ROUTES ==================================================================
// =============================================================================

  // VIEW ALL ITEMS
  app.get('/items', isLoggedIn, function(req, res) {
		var id = req.user._id
		Item.find({
			user: id
		}, (err, items) => {
			if(err){
				console.log(err)
			}
			else {
				Room.find({user: id}, (err, rooms) => {
					if(err) {
						console.log(err)
					} else {
						res.render('pages/items-view.html', {"items": items, "rooms": rooms})
					}
				})
		}
		});
  });

  // View DASHBOARD
  app.get('/dashboard', isLoggedIn, function(req, res) {
		if(req.user) {
			user = req.user
		}
    res.render('pages/dashboard.html', {"user": user})
  });

  // EDIT SINGLE ITEM
  app.get('/items/:slug', function(req, res) {
		var id = req.user._id
		Room.find({user: id}, (err, rooms) => {
			console.log(rooms)
			if(err) {
				return err
			} else {
				Item.findOne({_id : req.params.slug}, function(err, item) {
					if(err) {
						console.log(err)
					} else {
						res.render("pages/item-edit.html", {"item": item, "rooms": rooms});
					}
				});
			}
		})

  });

  // UPDATE SINGLE ITEM
  app.post('/items/:slug', multipartMiddleware, itemController.updateItem);

  // VIEW NEW ITEM FORM
  app.get('/new-item', isLoggedIn, function(req, res) {
		User.findById(req.user, (err, user) => {
			if(err) {
				return err
			} else {
				// var user = user
				Room.find({user: user._id}, (err, rooms) => {
					if(err) {
						console.log(err)
					} else {
						res.render('pages/items-add.html', {"rooms": rooms, "user": user})
					}
				})
			}
		})
  });

  // DELETE ITEM
  app.get('/delete/:slug', multipartMiddleware, itemController.deleteItem);

  // CREATE ITEM
  app.post('/new-item', multipartMiddleware, Upload.newItem)

  // AMAZONIFY
  app.post('/amazon', amazon.itemSearch);
  // ADD NEW ROOM
  app.post('/new-room', itemController.addRoom);
  // AMAZON TO ITEM UPDATE
  app.get('/amazon/', amazon.amazonToItem);
	app.get('/amazon/delete', amazon.notMyItem);

  // DELETE ROOM




// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	// =========================================================================
	// END ROUTES ================================================================
	// =========================================================================
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
};
