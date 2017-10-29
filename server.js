var express = require( 'express' );
var nunjucks = require( 'nunjucks' );

var request = require('request');

var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })
var crypto = require('crypto');
var mime = require('mime');

var app = express();
var TEMPLATES_PATH = './views'


// upload component

const Upload = require('./upload.controller')
const multipart = require('connect-multiparty')
const multipartMiddleware = multipart()

// end


nunjucks.configure(TEMPLATES_PATH, {
    autoescape: true,
    express: app
});

app.use(express.static('static'))
// app.use(bodyParser.urlencoded({extended: true}));
// app.use(bodyParser.json());

// HOME PAGE
app.get('/', function(req, res) {
    var name = "Kevin";
    res.render('pages/index.html', {"name": name});
});

// VIEW ITEMS
app.get('/items', function(req, res) {
  db.collection('items').find().toArray(function(err, results) {
    let photo = results[0].photos[0].path;
    console.log(photo)
    res.render('pages/items-view.html', {"items": results, "photo": photo});
  });
});

// ADD AN ITEM
app.get('/items/new-item', function(req, res) {
    var name = "Kevin";
    res.render('pages/items-add.html', {"name": name});
});


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './views/'); // Absolute path. Folder must exist, will not be created for you.
  },
  // filename: function (req, file, cb) {
  //   cb(null, file.fieldname + '-' + Date.now());
  // }
  filename: function (req, file, getName) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
      getName(null, raw.toString('hex') + Date.now() + '.' + mime.extension(file.mimetype));

    });
  }
});

var upload = multer({ storage: storage });


app.post('/items/new-item', upload.array('photos', 5), function (req, res, next) {
  console.log(req.files);
  if(req.files !==  undefined){
  // once uploaded save the user data along with uploaded photo path to the database.
    photos = []
    req.files.map(function(file){
      photo = {
        "mimetype": file.mimetype,
        "filename": file.filename,
        "path": file.path,
        "size": file.size
      }
      // name of file is file.fieldname might be relevant for pushing to mongodb
      photos.push(photo);
    });
    data = req.body
    payload = {
      'name': data.name,
      'quantity': data.quantity,
      'room': data.room,
      'photos': photos,
      'length': data.length,
      'width': data.width,
      'height': data.height,
      'store': data.store,
      'brand': data.brand,
      'model': data.model,
      'serial': data.serial,
      'cost': data.cost
    }
  db.collection('items').save(payload, (err, result) => {
      if (err) return console.log(err)
      console.log('saved to database')
    res.redirect('/items');
  });
  } else {
    res.json({
      'message':'Unable to Upload file'
    });
  }
  // req.body contains the text fields
});

const MongoClient = require('mongodb').MongoClient

MongoClient.connect('mongodb://kevin:Bettyb00p!@hiapp-shard-00-00-fqbin.mongodb.net:27017,hiapp-shard-00-01-fqbin.mongodb.net:27017,hiapp-shard-00-02-fqbin.mongodb.net:27017/test?ssl=true&replicaSet=HiApp-shard-0&authSource=admin', (err, database) => {
  if(err) return console.log(err)
  db = database
  app.listen( 8080 ) ;
})
