var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var mongoose=require('mongoose');
var bodyParser = require('body-parser');
var multer=require('multer');

var indexRouter = require('./routes/route.index');
var clientsRouter = require('./routes/route.client');

// MongoDB Connect
var dburl="mongodb+srv://mbcse:mohit@mbmongo-yydws.mongodb.net/KMP?retryWrites=true&w=majority";
mongoose.connect(dburl, {useNewUrlParser: true});
const db = mongoose.connection;
db.once('open', function() {
  console.log("MongoDb Connected");
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.json({ type: 'application/*+json' }));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret: "KMP_Session098"}));
app.use('/', indexRouter);
app.use('/client', clientsRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(5000,()=>{
  console.log("Server Started at http://127.0.0.1:5000/");
});
