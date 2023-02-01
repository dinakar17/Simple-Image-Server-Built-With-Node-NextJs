import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import AppError from "./utils/appError.js";
import imageRouter from "./routes/imageRoutes.js";
import globalErrorHandler from "./controllers/globalErrorHandler.js";

// app is an instance of express. In simple words, app is an express web server.
const app = express();

// bodyParser is a middleware that parses the body of the request and adds it to the request object.
// Without this middleware, the body of the request will be undefined.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors());

app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Welcome to the Image Upload API",
  });
});

app.use("/api", imageRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Cant find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

export default app;