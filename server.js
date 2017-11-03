var express = require( 'express' );
var nunjucks = require( 'nunjucks' );
var request = require('request');
const router = require('./routes')
const bodyParser = require('body-parser')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}

var app = express();

var TEMPLATES_PATH = './views'
// Define templates path.
nunjucks.configure(TEMPLATES_PATH, {
    autoescape: true,
    express: app,
    watch: true,
    noCache : true
});

// Define static route.
app.use(express.static('static'))
app.use("/", router)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const PORT = process.env.PORT || 8080;


var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy({
  passReqToCallback : true },
  function(username, password, done) {
    db.collection('User').findOne({ username: username }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));




// Connect to DB and start app
const MongoClient = require('mongodb').MongoClient
MongoClient.connect(process.env.MONGODB_URI, (err, database) => {
  if(err) return console.log(err)
  db = database
})

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
