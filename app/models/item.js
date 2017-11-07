// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var itemSchema = mongoose.Schema({
  name: String,
  uuid: String,
  amazonified: Boolean,
  quantity: Number,
  photo: String,
  length: Number,
  width: Number,
  height: Number,
  age: Number,
  store: String,
  brand: String,
  model: String,
  serial: String,
  cost: Number
});

// methods ======================

// create the model for users and expose it to our app
module.exports = mongoose.model('Item', itemSchema);
