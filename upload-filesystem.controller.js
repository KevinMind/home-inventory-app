var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })
var crypto = require('crypto');
var mime = require('mime');


// var storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, './views/'); // Absolute path. Folder must exist, will not be created for you.
//   },
//   // filename: function (req, file, cb) {
//   //   cb(null, file.fieldname + '-' + Date.now());
//   // }
//   filename: function (req, file, getName) {
//     crypto.pseudoRandomBytes(16, function (err, raw) {
//       getName(null, raw.toString('hex') + Date.now() + '.' + mime.extension(file.mimetype));
//
//     });
//   }
// });
//
// var upload = multer({ storage: storage });


// app.post('/items/new-item', upload.array('photos', 5), function (req, res, next) {
//   console.log(req.files);
//   if(req.files !==  undefined){
//   // once uploaded save the user data along with uploaded photo path to the database.
//     photos = []
//     req.files.map(function(file){
//       photo = {
//         "mimetype": file.mimetype,
//         "filename": file.filename,
//         "path": file.path,
//         "size": file.size
//       }
//       // name of file is file.fieldname might be relevant for pushing to mongodb
//       photos.push(photo);
//     });
//     data = req.body
//     payload = {
//       'name': data.name,
//       'quantity': data.quantity,
//       'room': data.room,
//       'photos': photos,
//       'length': data.length,
//       'width': data.width,
//       'height': data.height,
//       'store': data.store,
//       'brand': data.brand,
//       'model': data.model,
//       'serial': data.serial,
//       'cost': data.cost
//     }
//   db.collection('items').save(payload, (err, result) => {
//       if (err) return console.log(err)
//       console.log('saved to database')
//     res.redirect('/items');
//   });
//   } else {
//     res.json({
//       'message':'Unable to Upload file'
//     });
//   }
//   // req.body contains the text fields
// });
