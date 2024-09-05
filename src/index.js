const app = require("./app");
const config = require("./config/config");
const connectDatabase = require("./database/connection");

const globalErrorhandler = require("./middlewares/globalErrorhandler");

const appRouter = require("./routes/index");
const AppError = require("./utils/error");

const PORT = config.port;

process.on("uncaughtException", (err) => {
  console.log(err);
  process.exit(1);
});

app.use("/api", appRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

//database and port connection

var server;
connectDatabase()
  .then(() => {
    server = app.listen(PORT);
    return server;
  })
  .then(() => {
    console.log(`Server is running on PORT ${PORT}`);
  })
  .catch((err) => {
    console.log(err);
  });

//CHECK LATER
// process.on("unhandledRejection", (err) => {
//   console.log(err);
//   server.close(() => {
//     process.exit(1);
//   });
// });

//error handler middleware
app.use(globalErrorhandler);
