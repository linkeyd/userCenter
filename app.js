var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var routes = require('./routes/index');
var ValidatorController = require('./controller/validatorController');
var validatorController = new ValidatorController();
var app = express();




// view engine setup
//修改使用html模板
app.set('views', path.join(__dirname, 'views'));
app.engine(".html",require("ejs").__express);
app.set('view engine', 'html');

// var sessionStore = new session.MemoryStore({reapInterval:15*6000});
// session config
app.use(session({
  //store:sessionStore,
    secret: 'rhythmCubeName',
    cookie: {maxAge: 60000 * 60,domain:"usercenter.exdstudio.net"},
    resave: true,
    saveUninitialized: true
}));

// 过滤器判断登陆ID是否过期
app.use('/userCenter/*.*',validatorController.isLogin);



// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public/WebUserCenter')));
app.use(express.static(path.join(__dirname, 'public/WebUserCenter/public')));



app.use('/', routes);



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
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
