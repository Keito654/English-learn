import createError from "http-errors";
import express, { Request, Response, NextFunction } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import helmet from "helmet";
import session from "express-session";
import bcrypt from "bcrypt";
import flash from "connect-flash";
import favicon from "serve-favicon";

import { router as indexRouter } from "./routes/index";
import { router as addRouter } from "./routes/add";
import { router as wordRouter } from "./routes/word";
import { router as loginRouter } from "./routes/login";
import { router as logoutRouter } from "./routes/logout";
import { router as newUserRouter } from "./routes/newUser";
import { router as favoriteRouter } from "./routes/favorite";
import { router as favWordRouter } from "./routes/favWord";

import { Word } from "./models/word";
import { User } from "./models/user";
import { Favorite } from "./models/favorite";
import passport from "passport";
//import favicon from "express-favicon";
import compression from "compression";

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

const app = express();
app.use(helmet());
app.use(flash());
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      "media-src": ["'self'", "https://res.cloudinary.com"],
      "script-src": ["'self'", "'unsafe-eval'"],
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
app.set("views", "/workspace/views");
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false, limit: "50mb" }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "../public")));
const options = {
  maxAge: 200 * 60 * 60 * 24 * 1000,
};
app.use(favicon(path.join(__dirname, "../public/images/favicon.png"), options));

app.use(passport.initialize());
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET as string,
  })
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user: any, doen) => {
  doen(null, user);
});

app.use(passport.session());
const LocalStrategy = require("passport-local").Strategy;
passport.use(
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
      passReqToCallback: true,
      session: false,
    },
    function (req: any, username: any, password: any, done: any) {
      process.nextTick(async () => {
        const user: any = await User.findOne({
          where: { userId: username },
        });
        let isCorrectPassword;
        if (user === null) {
          return done(null, false, {
            message: "IDまたはパスワードが正しくありません。",
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
app.use(function (err: any, req: Request, res: Response, next: NextFunction) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
