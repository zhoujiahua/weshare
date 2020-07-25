const createError = require('http-errors');
const express = require('express');
const session = require("express-session");
const cookieParser = require('cookie-parser');
const keys = require("./config/keys");
const logger = require('morgan');
const cors = require('cors');
const path = require('path');
const app = express();

/**
 * Init libaray
 * */
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());

/**
 * Set static public catlog
 * */
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Set session
 * */
app.use(session({
  secret: keys.sessionOrKey,
  resave: false,
  saveUninitialized: true,
  cookie: {
    // secure: true,
    maxAge: 1000 * 60 * 30, // 设置 session 的有效时间，单位毫秒
  }
}))

/**
 * File directory permission control
 * */
app.use("/uploads", (req, res, next) => {
  if (!req.session.userid) {
    return res.redirect("/users/login");
  }
  next();
}, express.static(__dirname + "/uploads"));

/**
 * Art template
 * */
app.set('view cache', false);
app.set('views', './views');
app.set('view engine', 'html');
app.engine('html', require('express-art-template'));
app.set('view options', {
  debug: process.env.NODE_ENV !== 'production'
});

/**
 * Routes page
 * */
app.use("/", require("./routes/index/index"))
app.use("/main", require("./routes/main/pages"));
app.use("/users", require("./routes/main/users"));

app.use("/admin/pages", require("./routes/admin/pages"));
app.use("/admin/users", require("./routes/admin/users"));

app.use("/api/base/comm", require("./routes/api/base/comm"));
app.use("/api/base/reload", require("./routes/api/base/reload"));
app.use("/api/main/users", require("./routes/api/main/users"));
app.use("/api/main/doc", require("./routes/api/main/doc"));

app.use("/api/admin/pages", require("./routes/api/admin/pages"));
app.use("/api/admin/users", require("./routes/api/admin/users"));
app.use("/api/admin/comm", require("./routes/api/admin/comm"));

app.use("/upload", require('./routes/upload/upload'));

/**
 * catch 404 and forward to error handler
 * */
app.use((req, res, next) => {
  next(createError(404));
});

/**
 * Error handler
 * */
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;