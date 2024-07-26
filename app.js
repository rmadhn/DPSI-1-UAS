require("dotenv").config();
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var debug = require("debug")("backend-projek:server");
var http = require("http");

var sequelize = require("./models/index");
var usersRouter = require("./routes/users");
var authRouter = require("./routes/auth");
var categoryRouter = require("./routes/category");
var archiveRouter = require("./routes/archive");

var app = express();

// Setup view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Middleware untuk menangani error
app.use(function (err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({ message: "Token tidak valid" });
  } else {
    res.status(500).json({ message: "Kesalahan Server Internal" });
  }
});

app.use("/uploads", express.static("uploads"));

app.use("/users", usersRouter);
app.use("/auth", authRouter);
app.use("/category", categoryRouter);
app.use("/archive", archiveRouter);

sequelize.sequelize
  .sync()
  .then(() => {
    console.log("Koneksi ke database berhasil.");
  })
  .catch((error) => {
    console.error("Tidak dapat terhubung ke database:", error);
  });

// Tangani 404 dan teruskan ke penanganan error
app.use(function (req, res, next) {
  next(createError(404));
});

// Penanganan error
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.render("error");
});

/**
 * Dapatkan port dari environment dan simpan di Express.
 */
var port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

/**
 * Buat server HTTP.
 */
var server = http.createServer(app);

/**
 * Dengarkan pada port yang ditentukan, pada semua interface jaringan.
 */
server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

/**
 * Normalisasi port ke nomor, string, atau false.
 */
function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // pipa bernama
    return val;
  }

  if (port >= 0) {
    // nomor port
    return port;
  }

  return false;
}

/**
 * Pendengar event untuk event "error" server HTTP.
 */
function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  switch (error.code) {
    case "EACCES":
      console.error(bind + " membutuhkan hak akses yang lebih tinggi");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " sudah digunakan");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Pendengar event untuk event "listening" server HTTP.
 */
function onListening() {
  var addr = server.address();
  var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug("Mendengarkan di " + bind);
}

module.exports = app;
