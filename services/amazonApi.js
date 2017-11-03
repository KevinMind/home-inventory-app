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

// lookup amazon info

exports.itemSearch = (req, res, next) => {
  // console.log("req.body = ", req.body)
  client.itemSearch({
    Keywords: req.body.keywords,
    responseGroup: 'ItemAttributes,Offers,Images'
  }).then(function(results) {
    results = results[0]
    // console.log(results)
    attributes = results.ItemAttributes[0]
    console.log(JSON.stringify(results))
    db.collection('items').update({uuid: req.body.id}, {
      $set: {
        "amazonified": true,
        "a_asin": results.ASIN[0],
        "a_url": results.DetailPageURL[0],
        "a_brand": attributes.Brand[0],
        "a_height": attributes.ItemDimensions[0].Height[0]._,
        "a_width": attributes.ItemDimensions[0].Length[0]._,
        "a_length": attributes.ItemDimensions[0].Length[0]._,
        "a_manufacturer": attributes.Manufacturer[0],
        "a_model": attributes.Model[0],
        "a_upc": attributes.UPC[0],
        "a_cost": results.OfferSummary[0].LowestNewPrice[0].FormattedPrice[0]
      }
    })
    res.redirect('/items?id=' + req.body.id);
  }).catch(function(err) {
      console.log(JSON.stringify(err))
      res.redirect("/items?id=" + req.body.id)
    });

};

// update amazon info to item and clear amazon info

exports.amazonToItem = (req, res) => {
  db.collection('items').findOne({uuid : req.params.slug}, function(err, document) {
    if(err) {
      console.log(err)
      res.redirect('/items?id=' + req.params.slug)
    } else {
      db.collection('items').update({uuid: req.params.slug}, {
        $set: {
          "amazonified": true,
          "asin": document.a_asin,
          "brand": document.a_brand,
          "height": document.a_height,
          "width": document.a_width,
          "length": document.a_length,
          "manufacturer": document.a_manufacturer,
          "model": document.a_model,
          "upc": document.a_upc,
          "cost": document.a_cost,
          "amazonified": false,
          "a_asin": null,
          "a_url": null,
          "a_brand": null,
          "a_height": null,
          "a_width": null,
          "a_length": null,
          "a_manufacturer": null,
          "a_model": null,
          "a_upc": null,
          "a_cost": null
        }
      }).then(function(){
        res.redirect('/items?id=' + req.params.slug)
      })
    }
  });

};
