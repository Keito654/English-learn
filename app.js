var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var helmet = require("helmet");
var session = require("express-session");
var bcrypt = require("bcrypt");
const flash = require('connect-flash');

var indexRouter = require("./routes/index");
var addRouter = require("./routes/add");
var wordRouter = require("./routes/word");
var loginRouter = require("./routes/login");
var logoutRouter = require("./routes/logout");
var newUserRouter = require("./routes/newUser");
var favoriteRouter = require("./routes/favorite");
var favWordRouter = require("./routes/favWord");

var Word = require("./models/word");
var User = require("./models/user");
var Favorite = require("./models/favorite");
const passport = require("passport");
const favicon = require("express-favicon");
const compression = require("compression");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

(async () => {
  Word.hasOne(Favorite, { foreignKey: "wordId" });
  User.hasOne(Favorite, { foreignKey: "userId" });
  await Word.sync();
  await User.sync();
  Favorite.belongsTo(Word, { foreignKey: "wordId" });
  Favorite.belongsTo(User, { foreignKey: "userId" });
  Favorite.sync();
})();

var app = express();
app.use(helmet());
app.use(flash());
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      "media-src": ["'self'", "https://res.cloudinary.com"],
      "script-src": ["'self'", "'unsafe-eval'"]
    },
  })
);

app.use(
  compression({
    threshold: 0,
    level: 9,
    memLevel: 9,
  })
);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false, limit: "50mb" }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(favicon(__dirname + "/public/images/favicon.png"));

app.use(passport.initialize());
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
  })
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, doen) => {
  doen(null, user);
});

app.use(passport.session());
var LocalStrategy = require("passport-local").Strategy;
passport.use(
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
      passReqToCallback: true,
      session: false,
    },
    function (req, username, password, done) {
      process.nextTick(async () => {
        const user = await User.findOne({
          where: { userId: username },
        });
        let isCorrectPassword;
        if (user === null) {
          return done(null, false, {
            message: "ユーザーIDが正しくありません。",
          });
        } else {
          const passAndHash = password + process.env.PASSWORD_HASH;
          isCorrectPassword = await bcrypt.compare(passAndHash, user.password);
        }
        if (isCorrectPassword) {
          return done(null, username);
        } else {
          return done(null, false, {
            message: "IDまたはパスワードが正しくありません。",
          });
        }
      });
    }
  )
);

app.use("/", indexRouter);
app.use("/add", addRouter);
app.use("/word", wordRouter);
app.use("/login", loginRouter);
app.use("/logout", logoutRouter);
app.use("/newUser", newUserRouter);
app.use("/favorite", favoriteRouter);
app.use("/favWord", favWordRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
