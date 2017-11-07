var Item = require('../app/models/item');

// Create Item
exports.createItem = (callback) => {
  var newItem = new Item();
  newItem.name = payload.name,
  newItem.uuid=  payload.uuid,
  newItem.amazonified=  payload.amazonified,
  newItem.quantity= payload.quantity,
  newItem.photo= payload.photo,
  newItem.length= payload.length,
  newItem.width= payload.width,
  newItem.height= payload.height,
  newItem.age= payload.age,
  newItem.store= payload.store,
  newItem.brand= payload.brand,
  newItem.model= payload.model,
  newItem.serial= payload.serial,
  newItem.cost= payload.cost

  newItem.save(function(err) {
      if (err)
          throw err;
      return callback(null, newItem);
  });
}
