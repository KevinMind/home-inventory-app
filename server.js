var express = require( 'express' );
var nunjucks = require( 'nunjucks' );
var request = require('request');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}

var app = express();
var TEMPLATES_PATH = './views'


const Upload = require('./controller/upload.controller')
const multipart = require('connect-multiparty')
const multipartMiddleware = multipart()


// Define templates path.
nunjucks.configure(TEMPLATES_PATH, {
    autoescape: true,
    express: app
});

// Define static route.
app.use(express.static('static'))

// HOME PAGE
app.get('/', function(req, res) {
    var name = "Kevin";
    res.render('pages/index.html', {"name": name});
});

// VIEW ITEMS
app.get('/items', function(req, res) {
  // db.collection('items').remove({})
  db.collection('items').find().toArray(function(err, results) {
    if(err) {
      res.write("error 500");
    } else {
      res.render('pages/items-view.html', {"items": results})
    }
  });
});

// ADD AN ITEM
app.get('/items/new-item', function(req, res) {
    res.render('pages/items-add.html');
});

// UPDATE AN ITEM


// DELETE ITEM

app.delete('/item', function (req, res) {
  console.log(req);
  res.send('Got a DELETE request at /item: ');
})

app.post('/items/new-item', multipartMiddleware, Upload.upload)

const PORT = process.env.PORT || 8080;

// Connect to DB and start app
const MongoClient = require('mongodb').MongoClient
MongoClient.connect(process.env.MONGODB_URI, (err, database) => {
  if(err) return console.log(err)
  db = database
})

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
