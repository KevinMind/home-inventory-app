const Upload = require('./controller/upload.controller')
const multipart = require('connect-multiparty')
const multipartMiddleware = multipart()
const bodyParser = require('body-parser')

// PREPARE MODULE
var express = require('express');
module.exports = (function() {
  'use strict';
  var router = express.Router();
  router.use(bodyParser.urlencoded({ extended: false }));

  // HOME PAGE
  router.get('/', function(req, res) {
      var name = "Kevin";
      res.render('pages/index.html', {"name": name});
  });
  // VIEW ALL ITEMS
  router.get('/items', function(req, res) {
    // db.collection('items').remove({})
    db.collection('items').find().toArray(function(err, results) {
      if(err) {
        res.write("error 500");
      } else {
        res.render('pages/items-view.html', {"items": results})
      }
    });
  });

  // VIEW SINGLE ITEM
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

  // VIEW NEW ITEM
  router.get('/new-item', function(req, res) {
      res.render('pages/items-add.html');
  });

  // DELETE ITEM
  router.get('/delete/:slug', function (req, res) {
    console.log("Delete request received.")
    db.collection('items').findOne({uuid : req.params.slug}, function(err, document) {
      if(err) {
        console.log(err)
      } else {
        res.render('pages/deleted.html', {"item": document})
        // db.collection('items').remove({uuid:req.params.slug})
      }
    });
  });

  // CREATE ITEM
  router.post('/new-item', multipartMiddleware, Upload.newItem)

  return router;
})();
