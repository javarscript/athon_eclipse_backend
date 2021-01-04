var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const cloudinary = require('cloudinary')
var cors = require('cors');
var config = require('./config');
const formData = require('express-form-data')

mongoose.connect(config.mongo.mongoUrl);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
    console.log("Connected correctly to server");
});
cloudinary.config({ 
  cloud_name: config.cloudinary.cloud_name, 
  api_key: config.cloudinary.api_key, 
  api_secret: config.cloudinary.api_secret
})
  
var index = require('./routes/index');
var users = require('./routes/users');
var check = require('./routes/check');
var stories = require('./routes/stories');
var posts = require('./routes/posts');


// var dishRouter = require('./routes/dishRouter');
// var promoRouter = require('./routes/promoRouter');
// var leaderRouter = require('./routes/leaderRouter');

var app = express();
app.use(formData.parse())
app.use(cors())
app.set('port', 3000);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// passport config
app.use(passport.initialize());
app.use(passport.session())


app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/check', check);
app.use('/stories', stories);
app.use('/posts', posts);



// app.use('/dishes',dishRouter);
// app.use('/promotions',promoRouter);
// app.use('/leadership',leaderRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: {}
  });
});

module.exports = app;