if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}
var amazon = require('amazon-product-api');
var parseString = require('xml2js').parseString;
const util = require('util')


// create our amazon product api client
var client = amazon.createClient({
  awsId: process.env.APAPI_ACCESS_KEY,
  awsSecret: process.env.APAPI_SECRET_KEY,
  awsTag: process.env.APAPI_TAG
});

// require item and item controller
const itemController = require('../controller/item.controller')
const Item = require('../app/models/item')

const keys = [
  {name: "title", value: "result.ItemAttributes[0].Title"},
  {name: "category", value: "result.ItemAttributes[0].ProductTypeName"},
  {name: "image", value: "result.LargeImage[0].URL"},
  {name: "asin", value: "result.ASIN[0]"},
  {name: "url", value: "result.DetailPageURL[0]"},
  {name: "brand", value: "result.ItemAttributes[0].Brand[0]"},
  {name: "itemDimWidthValue", value: "result.ItemAttributes[0].ItemDimensions[0].Width[0]._"},
  {name: "itemDimWidthUnit", value: "result.ItemAttributes[0].ItemDimensions[0].Weight[0].$.Units"},
  {name: "itemDimLengthValue", value: "result.ItemAttributes[0].ItemDimensions[0].Length[0]._"},
  {name: "itemDimLengthUnit", value: "result.ItemAttributes[0].ItemDimensions[0].Length[0].$.Units"},
  {name: "itemDimHeightValue", value: "result.ItemAttributes[0].ItemDimensions[0].Height[0]._"},
  {name: "itemDimHeightUnit", value: "result.ItemAttributes[0].ItemDimensions[0].Height[0].$.Units"},
  {name: "itemDimWeightValue", value: "result.ItemAttributes[0].ItemDimensions[0].Weight[0]._"},
  {name: "itemDimWeightUnit", value: "result.ItemAttributes[0].ItemDimensions[0].Weight[0].$.Units"},
  {name: "manufacturer", value: "result.ItemAttributes[0].Manufacturer[0]"},
  {name: "model", value: "result.ItemAttributes[0].Model[0]"},
  {name: "upc", value: "result.ItemAttributes[0].UPC[0]"},
  {name: "cost", value: "(result.OfferSummary[0].LowestNewPrice[0].Amount[0] / 100)"}
]

// lookup amazon info
exports.itemSearch = (req, res, next) => {
  client.itemSearch({
    Keywords: req.body.keywords,
    responseGroup: 'ItemAttributes,Offers,Images'
  }).then(function(results) {
    let id = req.body._id
    var items = []
    // loop through results and clean up missing values;
    results.forEach(function(result) {
      let item = {}
      // console.log("RESULT: ------------------->")
      keys.forEach((key) => {

        try {
          // console.log(key.name, ": ", eval(key.value))
          item[key.name] = eval(key.value)
        }
        catch(e) {
          // console.log(key.name, ": ", "NOT FOUND")
          item[key.name] = null
          // console.log("EROR: ------------------->")
          // console.log(e)
        }
      })
      item['itemId'] = id
      // add formatted item to items list
      items.push(item)
    })
    Item.findByIdAndUpdate(id, {
        $set: {
          "amazonified": true,
          "amazonData": items
        }
      },
      // return updated item
      {
        new: true
      },
      // afterwards
      function(err, item) {
        if (err) {
          console.log(err);
        } else {
          // console.log("item: ", item);
          res.redirect("/items?id=" + req.body._id)
        }
      });
  }).catch(function(err) {
    console.log("error: ", err)
    res.redirect("/items?id=" + req.body._id)
  });
};


exports.amazonToItem = (req, res) => {
  let asin = req.param('asin')
  let id = req.param('id')
  console.log("ASIN: ", asin)
  let uItem = Item.findOne({
    _id: id
  }, function(err, item) {
    if (err) {
      console.log(err)
    } else {
      item.amazonData.forEach((amazonItem) => {
        if(amazonItem.asin == asin) {
          item.brand = amazonItem.brand;
          item.length = amazonItem.length;
          item.width = amazonItem.width;
          item.height = amazonItem.height;
          item.model = amazonItem.model;
          item.cost = amazonItem.cost;
        }
      })

      // clear amazon fields
      item.amazonified = false;
      item.amazonData = []
      item.save((err, result) => {
        if (err) console.log(err)
        else res.redirect("/items?id=" + id)
      })
    }

  })

};

exports.notMyItem = (req, res) => {
  let id = req.param('id')
  Item.findOne({
    _id: id
  }, (err, item) => {
    if(err) {
      console.log(err)
    } else {
      item.amazonified = false
      item.amazonData = []
      item.save((err, result) => {
        if (err) console.log(err)
        else res.redirect("/items?id=" + id)
      })
    }
  })
};
