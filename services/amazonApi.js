if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}
var amazon = require('amazon-product-api');
var parseString = require('xml2js').parseString;
var client = amazon.createClient({
  awsId: process.env.APAPI_ACCESS_KEY,
  awsSecret: process.env.APAPI_SECRET_KEY,
  awsTag: process.env.APAPI_TAG
});
const itemController = require('../controller/item.controller')
const Item = require('../app/models/item')

// lookup amazon info

exports.itemSearch = (req, res, next) => {
  console.log("req.body = ", req.body)
  client.itemSearch({
    Keywords: req.body.keywords,
    responseGroup: 'ItemAttributes,Offers,Images'
  }).then(function(results) {
    results = results[0]
    // console.log(results)
    let attributes = results.ItemAttributes[0]
    console.log(JSON.stringify(results))
    // find and update the item
    let id = req.body._id
    console.log(req.body._id)

    if(attributes.ItemDimensions) {
      console.log("item")
      console.log(dimensions)
      var dimensions = attributes.ItemDimensions;
    } else if (attributes.PackageDimensions) {
      console.log("package")
      var dimensions = attributes.PackageDimensions;
      console.log(dimensions)
    } else {
      console.log("neither")
    }

    Item.findByIdAndUpdate(id, {
        $set: {
          "amazonified": true,
          "amazonData": {
            "asin": results.ASIN[0],
            "url": results.DetailPageURL[0],
            "brand": attributes.Brand[0],
            "height": dimensions[0].Height[0]._,
            "width": dimensions[0].Length[0]._,
            "length": dimensions[0].Length[0]._,
            "manufacturer": attributes.Manufacturer[0],
            "model": attributes.Model[0],
            "upc": attributes.UPC[0],
            "cost": (results.OfferSummary[0].LowestNewPrice[0].Amount[0] / 100)
          }
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
        }
        else {
          console.log("item: ", item);
          res.redirect("/items?id=" + req.body._id)
        }
      });
  }).catch(function(err) {
    console.log(err)
    console.log(JSON.stringify(err))
    res.redirect("/items?id=" + req.body._id)
  });
};


exports.amazonToItem = (req, res) => {
  let id = req.params.slug
  let uItem = Item.findOne({_id: id}, function(err, item) {
    if(err) {
      console.log(err)
    } else {
      console.log
      item.brand = item.amazonData.brand;
      item.length = item.amazonData.length;
      item.width = item.amazonData.width;
      item.height = item.amazonData.height;
      item.model = item.amazonData.model;
      item.cost = item.amazonData.cost;

      // clear amazon fields
      item.amazonified = false;
      item.amazonData = {

      }
      item.save((err, result) => {
        if(err) console.log(err)
        else res.redirect("/items?id=" + id)
      })
  }

  })

  // db.collection('items').findOne({
  //   uuid: req.params.slug
  // }, function(err, document) {
  //   if (err) {
  //     console.log(err)
  //     res.redirect('/items?id=' + req.params.slug)
  //   } else {
  //     db.collection('items').update({
  //       uuid: req.params.slug
  //     }, {
  //       $set: {
  //         "amazonified": true,
  //         "asin": document.a_asin,
  //         "brand": document.a_brand,
  //         "height": document.a_height,
  //         "width": document.a_width,
  //         "length": document.a_length,
  //         "manufacturer": document.a_manufacturer,
  //         "model": document.a_model,
  //         "upc": document.a_upc,
  //         "cost": document.a_cost,
  //         "amazonified": false,
  //         "a_asin": null,
  //         "a_url": null,
  //         "a_brand": null,
  //         "a_height": null,
  //         "a_width": null,
  //         "a_length": null,
  //         "a_manufacturer": null,
  //         "a_model": null,
  //         "a_upc": null,
  //         "a_cost": null
  //       }
  //     }).then(function() {
  //       res.redirect('/items?id=' + req.params.slug)
  //     })
  //   }
  // });

};
