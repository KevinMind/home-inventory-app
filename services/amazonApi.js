if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}
var amazon = require('amazon-product-api');
var parseString = require('xml2js').parseString;

// create our amazon product api client
var client = amazon.createClient({
  awsId: process.env.APAPI_ACCESS_KEY,
  awsSecret: process.env.APAPI_SECRET_KEY,
  awsTag: process.env.APAPI_TAG
});

// require item and item controller
const itemController = require('../controller/item.controller')
const Item = require('../app/models/item')

// lookup amazon info
exports.itemSearch = (req, res, next) => {
  client.itemSearch({
    Keywords: req.body.keywords,
    responseGroup: 'ItemAttributes,Offers,Images'
  }).then(function(results) {
      console.log("new ReSULT\n\n\n")
      console.log("result type: ", typeof result)
      console.log(result)
      // results = results[0]
      // console.log(results)
      let attributes = results.ItemAttributes[0]
      console.log(JSON.stringify(results))
      // find and update the item
      let id = req.body._id
      console.log(req.body._id)

      if (attributes.ItemDimensions) {
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

      amazonItemData = {
        image: results.MediumImage[0].URL,
        asin: results.ASIN[0],
        url: results.DetailPageURL[0],
        brand: attributes.Brand[0],
        height: dimensions[0].Height[0]._,
        width: dimensions[0].Length[0]._,
        length: dimensions[0].Length[0]._,
        manufacturer: attributes.Manufacturer[0],
        model: attributes.Model[0],
        upc: attributes.UPC[0],
        cost: (results.OfferSummary[0].LowestNewPrice[0].Amount[0] / 100)
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
          } else {
            console.log("item: ", item);
            res.redirect("/items?id=" + req.body._id)
          }
        });
  }).catch(function(err) {
    console.log(JSON.stringify(err))
    res.redirect("/items?id=" + req.body._id)
  });
};


exports.amazonToItem = (req, res) => {
  let id = req.params.slug
  let uItem = Item.findOne({
    _id: id
  }, function(err, item) {
    if (err) {
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
        if (err) console.log(err)
        else res.redirect("/items?id=" + id)
      })
    }

  })

};
