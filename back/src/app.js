const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../", "config.env") });
require("./db/mongoose");
const express = require("express");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
//--------------------------------------------
const productRouter = require("./routers/product");
const adminRouter = require("./routers/admin");
const bannerRouter = require("./routers/banner");
const blogRouter = require("./routers/blog");
const navRouter = require("./routers/nav");
const userRouter = require("./routers/user");
const commentRouter = require("./routers/comments");
const userDataRouter = require("./routers/userData");
const userControlRouter = require("./routers/users");
const inquiryRouter = require("./routers/inquiry");
const internalCommentRouter = require("./routers/internalProductComment");

const app = express();
const port = process.env.PORT || 5000;

app.use((req, res, next) => {
  res.append("Access-Control-Allow-Origin", ["*"]);
  res.append("Access-Control-Allow-Methods", "GET,PATCH,POST,DELETE");
  res.append("Access-Control-Allow-Headers", ["*"]);
  next();
});

app.use(helmet());

// const limiter = rateLimit({
//   max: 100,
//   windowMs: 60 * 60 * 1000,
//   message: "Too many requests",
// });

// app.use("/api", limiter);

app.use(express.json());
app.use(mongoSanitize());
app.use(xss());
// Reminder: set whiteList {whiteList: ['something']}
app.use(hpp({ whitelist: ["name", "volume"] }));

app.use(productRouter);
app.use(adminRouter);
app.use(bannerRouter);
app.use(blogRouter);
app.use(navRouter);
app.use(userRouter);
app.use(commentRouter);
app.use(userDataRouter);
app.use(userControlRouter);
app.use(inquiryRouter);
app.use(internalCommentRouter);

app.listen(port, () => {
  console.log("Server running at " + port);
});
