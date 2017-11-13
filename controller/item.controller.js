const Item = require('../app/models/item');
const User = require('../app/models/user')
const Room = require('../app/models/room')
const async = require('async')
const uuidv4 = require('uuid/v4');



// Create Item
exports.createItem = (callback) => {
  console.log(userId)
  let user = User.findById(userId, function(err, user) {
    if(err) {
      console.log(err)
    } else {

      var newItem = new Item();
      newItem.name = payload.name;
      newItem.user = user._id;
      newItem.room = payload.room;
      newItem.amazonified =  payload.amazonified;
      newItem.quantity = payload.quantity;
      newItem.photo = payload.photo;
      newItem.length = payload.length;
      newItem.width = payload.width;
      newItem.height = payload.height;
      newItem.age = payload.age;
      newItem.store = payload.store;
      newItem.brand = payload.brand;
      newItem.model = payload.model;
      newItem.serial = payload.serial;
      newItem.cost = payload.cost;
      // user.items= []


      user.items.push(newItem._id);
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
  Item.update({_id: data._id}, {
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
              items = user.items
              items.forEach((item) =>{
                console.log("item: ", item, " id: ", id)
                if(item == id) {
                  let index = items.indexOf(item)
                  console.log("item indexed at position: ", index)
                  items.splice(index, 1)
                  console.log(items)
                  user.items = items
                  user.save((errr, result) => {
                    if(err) {
                      console.log(err)
                    } else {
                      return result
                    }
                  })

                }

              })
              res.render('pages/deleted.html', {"item": result})
            }
          })
        }
      })
    }
  });
}

exports.addRoom = (req, res) => {
  let id = req.user._id
  var room = new Room();

  room.name = req.body.name;
  room.items = []
  room.user = id;

  User.findById(id,(err, user) => {
    if(err) {
      return err
    } else {
      user.rooms.unshift(room._id)
    }
    user.save((err, result ) => {
      if(err) return err
      room.save((err, result) => {
        if(err) return err
        else res.redirect('/new-item')
      })
    })
  })
}


// Amazonify Item
