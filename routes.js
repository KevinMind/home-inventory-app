'use strict';
const Upload = require('../controller/upload.controller')
const multipart = require('connect-multiparty')
const multipartMiddleware = multipart()
const bodyParser = require('body-parser')
const passport = require('passport')
const amazon = require('../services/amazonApi')


// PREPARE MODULE
var express = require('express');
module.exports = (function() {
  var router = express.Router();
  router.use(bodyParser.urlencoded({ extended: false }));

  router.get('/login',
    passport.authenticate('local'),
    function(req, res) {
      // If this function gets called, authentication was successful.
      // `req.user` contains the authenticated user.
      res.redirect('/users/' + req.user.username);
    });


  // HOME PAGE
  router.get('/', function(req, res) {
      var name = "Kevin";
      res.render('pages/index.html', {"name": name});
  });

  // VIEW ALL ITEMS
  router.get('/items', function(req, res) {
    db.collection('items').find().toArray(function(err, results) {
        if (err) {
          console.log(err)
        } else {
          res.render('pages/items-view.html', {"items": results, "active": "035d993e-5045-4e43-8281-18de9b81ee60"})
        }
    });
  });

  // View DASHBOARD
  router.get('/dashboard', function(req, res) {
    db.collection('items').find().toArray(function(err, results) {
      if(err) {
        res.write("error 500");
      } else {
        var costs = []
        results.forEach(function(result) {
          costs.unshift(result.cost)

        });
        var total = costs.reduce((sum, value) => sum + value, 1);
        res.render('pages/dashboard.html', {"items": results, "total": total })
      }
    });
  });

  // EDIT SINGLE ITEM
  router.get('/items/:slug', function(req, res) {
    db.collection('items').findOne({uuid : req.params.slug}, function(err, document) {
      if(err) {
        console.log(err)
      } else {
        res.render("pages/item-edit.html", {"item": document});
      }
    });
  });

  // UPDATE SINGLE ITEM
  router.post('/items/:slug', function(req, res) {
    var data = req.body;
    console.log(data)
    console.log("data: ", data);
    db.collection('items').update({uuid: req.params.slug}, {
      $set: {
        'name': req.body.name,
        'quantity': req.body.quantity,
        'room': data.room,
        'length': data.length,
        'width': data.width,
        'height': data.height,
        'age': data.age,
        'store': data.store,
        'brand': data.brand,
        'model': data.model,
        'serial': data.serial,
        'cost': data.cost
        }
      })
    res.redirect('/items')
  });

  // VIEW NEW ITEM FORM
  router.get('/new-item', function(req, res) {
      db.collection('rooms').find().toArray(function(err, results) {
        if(err) {
          console.log(err)
        } else {
          console.log(results)

          res.render('pages/items-add.html', {"rooms": results});
        }
      })

  });

  // DELETE ITEM
  router.get('/delete/:slug', function (req, res) {
    console.log("Delete request received.")
    db.collection('items').findOne({uuid : req.params.slug}, function(err, document) {
      if(err) {
        console.log(err)
      } else {
        res.render('pages/deleted.html', {"item": document})
        db.collection('items').remove({uuid:req.params.slug})
      }
    });
  });

  // CREATE ITEM
  router.post('/new-item', multipartMiddleware, Upload.newItem)

  router.get('/login', function(req, res) {
    res.render('pages/login.html')
  })
  router.post('/login',
  passport.authenticate('local',
    { successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true })
  );

  // AMAZONIFY
  // router.post('/amazon', amazon.itemSearch);
  // ADD NEW ROOM
  router.post('/new-room', Upload.addRoom);
  // AMAZON TO ITEM UPDATE
  router.get('/amazon/:slug', amazon.amazonToItem);

  // DELETE ROOM

  return router;
})();
