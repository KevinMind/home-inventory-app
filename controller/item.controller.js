const Item = require('../app/models/item');
const User = require('../app/models/user')
const async = require('async')


// Create Item
exports.createItem = (callback) => {
  console.log(userId)
  let user = User.findById(userId, function(err, user) {
    if(err) {
      console.log(err)
    } else {

      var newItem = new Item();
      newItem.name = payload.name;
      newItem.uuid=  newItem.genUuid();
      newItem.amazonified=  payload.amazonified;
      newItem.quantity= payload.quantity;
      newItem.photo= payload.photo;
      newItem.length= payload.length;
      newItem.width= payload.width;
      newItem.height= payload.height;
      newItem.age= payload.age;
      newItem.store= payload.store;
      newItem.brand= payload.brand;
      newItem.model= payload.model;
      newItem.serial= payload.serial;
      newItem.cost= payload.cost;
      // user.items= []
      user.items.push(newItem);
      user.save((err) => {
        if(err) throw err
      })

      // user.items.upadate()

      newItem.save(function(err) {
          if (err)
              throw err;
          return callback(null, newItem);
      });
    }
  })

}

// Update Item

const updateItem = (callback) => {
  Item.update({uuid: data.uuid}, {
    $set: {
      'name': data.name,
      'quantity': data.quantity,
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
    },(err, result) =>{
      if(err) {
        console.log(err)
      } else {
        callback(null, data)
      }
    })
  }


exports.updateItem = (req, res, next) => {
  data = req.body
    async.series([
      updateItem,
      ], (err, result) => {
        if(err) return res.send(err)
        else res.redirect("/items")
      }
    )
}

// Delete Item

exports.deleteItem = (req, res, next) => {
  var id = req.params.slug
  console.log(id)
  Item.findOne({_id : id}, function(err, document) {
    if(err) {
      console.log(err)
    } else {
      console.log(document._id)
      Item.remove({ _id: document._id}, function(err, result) {
        if(err) {
          console.log(err)
        } else {
          User.findById(req.user, function(err, user) {
            if(err) {
              console.log(err)
            } else {
              console.log(user.items)
              res.render('pages/deleted.html', {"item": result})
            }
          })
        }
      })
    }
  });
}


// Amazonify Item
