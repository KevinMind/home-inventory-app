// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var roomSchema = mongoose.Schema({
  uuid: String,
  name: String,
  image: String,
  thumbnail: String
});


// methods ======================
itemSchema.methods.genUuid = function () {
  return uuid();
}

// create the model for users and expose it to our app
module.exports = mongoose.model('Item', itemSchema);
