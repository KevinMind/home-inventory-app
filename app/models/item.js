// app/models/user.js
// load the things we need
const mongoose = require('mongoose')
const bcrypt   = require('bcrypt-nodejs')
const uuid = require('uuid/v4')

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
  cost: Number,
  amazonData: {
    asin: String,
    url: String,
    brand: String,
    height: Number,
    width: Number,
    length: Number,
    manufacturer: String,
    model: String,
    upc: String,
    cost: Number
  }
});

// methods ======================
itemSchema.methods.genUuid = function () {
  return uuid().toString();
}

var amazon = require('amazon-product-api');
var parseString = require('xml2js').parseString;
var client = amazon.createClient({
  awsId: process.env.APAPI_ACCESS_KEY,
  awsSecret: process.env.APAPI_SECRET_KEY,
  awsTag: process.env.APAPI_TAG
});

itemSchema.methods.amazonify = function() {
  client.itemSearch({
    Keywords: req.body.keywords,
    responseGroup: 'ItemAttributes,Offers,Images'
  }).then(function(results) {
    results = results[0];
    attributes = results.ItemAttributes[0];
    this.amazonified =  true;
    this.amazonData.asin = results.ASIN[0];
    this.amazonData.url = results.DetailPageURL[0];
    this.amazonData.brand = attributes.Brand[0];
    this.amazonData.height = attributes.ItemDimensions[0].Height[0]._;
    this.amazonData.length = attributes.ItemDimensions[0].Length[0]._;
    this.amazonData.width = attributes.ItemDimensions[0].Width[0]._;
    this.amazonData.manufacturer = attributes.Manufacturer[0];
    this.amazonData.model = attributes.Model[0];
    this.amazonData.upc = attributes.UPC[0];
    this.amazonData.cost = (results.OfferSummary[0].LowestNewPrice[0].Amount[0]/100);
  }).catch(function(err) {
      console.log(JSON.stringify(err))
  });
}

// create the model for users and expose it to our app
module.exports = mongoose.model('Item', itemSchema);
