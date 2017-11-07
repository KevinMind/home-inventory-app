// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
var nunjucks = require( 'nunjucks' );
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}

mongoose.connect( process.env.MONGODB_URI, { useMongoClient: true}, function(err, db) {
  if(err) {
    console.log(err)
  } else {
    console.log("connected to ", db.host)
  }

});

app.use(express.static('static'))


// configuration ===============================================================
// var options = {
//   useMongoClient: true,
//   autoIndex: false, // Don't build indexes
//   reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
//   reconnectInterval: 500, // Reconnect every 500ms
//   poolSize: 10, // Maintain up to 10 socket connections
//   // If not connected, return errors immediately rather than waiting for reconnect
//   bufferMaxEntries: 0
// };

var options = {
  useMongoClient: true,
  autoIndex: false, // Don't build indexes
  reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
  reconnectInterval: 500, // Reconnect every 500ms
  poolSize: 10, // Maintain up to 10 socket connections
  // If not connected, return errors immediately rather than waiting for reconnect
  bufferMaxEntries: 0
};

// mongoose.connect( process.env.MONGODB_URI, { useMongoClient: true } );
//Get the default connection
// var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
//db.on('error', console.error.bind(console, 'MongoDB connection error:'));

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

var TEMPLATES_PATH = './views'
// Define templates path.
nunjucks.configure(TEMPLATES_PATH, {
    autoescape: true,
    express: app,
    watch: true,
    noCache : true
});

// required for passport
app.use(session({ secret: 'kevinisawesomekevinisawesumsawus' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);
console.log('Arg... the ship be set sail at port: ' + port);
