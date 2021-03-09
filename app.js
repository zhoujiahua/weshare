const DBconnect = require("./comm/DBconnect");
const express = require("express");
const path = require("path");
const app = express();

// Used module alias
require("module-alias/register");

// Used libaray
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Set static catalog
app.use(express.static(__dirname + "/public"));
app.use("/uploads", express.static(__dirname + "/uploads"));

// Used middleware initialize
app.use(require("./middleware/initialize"));

// Used middleware reference
require("./middleware/reference")(app);

// Used Art Template
app.set('view cache', false);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', require('express-art-template'));
app.set('view options', {
  debug: process.env.NODE_ENV !== 'production'
});

// 使用routes
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

// catch 404
app.use((req, res, next) => {
  let err = new Error("Not Found");
  err.status = 404;
  next(err);
})

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render("main/error/error", {
    message: err.message,
    error: {
      status: err.status,
      desc: "不好意思你的页面被狗叼走了！"
    }
  });
})

// Connect  Server
const port = process.env.PORT || 5000;
app.listen(port, async () => {
  await DBconnect();
  console.log('Start server:http://localhost:' + port)
});