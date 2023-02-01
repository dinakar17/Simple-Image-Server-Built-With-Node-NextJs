import fs from "fs";
import sharp from "sharp";
import { fileURLToPath } from "url";
import { dirname } from "path";
import multer from "multer";
import catchAsync from "../utils/catchAsync.js";
import dotenv from "dotenv";

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));
let filePath = `C:/Users/Dinakar/Documents/GitHub/Image-Server-Tutorial/Backend-NodeJS-Express/controllers`;

if (process.env.NODE_ENV === "production") {
  filePath = `${__dirname}/../uploads`;
}

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

let upload = multer({ storage: storage });

export const uploadImageToFolder = catchAsync(async (req, res, next) => {
  upload.single("image-file")(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    } else if (err) {
      return res.status(500).json(err);
    }
    next();
  });
});

export const getImages = catchAsync(async (req, res, next) => {
  const images = fs.readdirSync(`${filePath}/../uploads`);
  // Sort images by date modified
  images.sort(function (a, b) {
        return fs.statSync(`${filePath}/../uploads/${b}`).mtime.getTime() - fs.statSync(`${filePath}/../uploads/${a}`).mtime.getTime();});

  res.status(200).json({
    status: "success",
    results: images.length,
    data: {
      images,
    },
  });
});

export const getImage = catchAsync(async (req, res, next) => {
  const { w, q } = req.query;

  const { filename } = req.params;
  let filePath = `C:/Users/Dinakar/Documents/GitHub/Image-Server-Tutorial/Backend-NodeJS-Express/controllers/../uploads/${filename}`;
  if(process.env.NODE_ENV === 'production') {
     filePath = `${__dirname}/../uploads/${filename}`;
  } 
  const file = fs.readFileSync(filePath);
  const image = sharp(file);
  if (w || q) {
    // fit: cover scales the image to cover the provided dimensions, cropping any parts of the image that do not fit.
    image.resize({ width: Number(w) });
    image.jpeg({ quality: Number(q) });
  }
  image
    .toBuffer()
    .then((data) => {
      res.set("Content-Type", "image/jpeg");
      res.send(data);
    })
    .catch((err) => {
      return next(new AppError(`Error: ${err}`, 500));
    });
});

export const createImage = catchAsync(async (req, res, next) => {
  var response = {
    result: [
      {
        url: req.file.path,
        name: req.file.originalname,
        size: req.file.size,
      },
    ],
  };
  res.status(201).json({
    status: "success",
    data: {
      response,
    },
  });
});

export const deleteImage = catchAsync(async (req, res, next) => {
  // http://localhost:3000/delete-file?filePath=uploads/1.jpg
  try {
    var filePath = req.params.filename;

    console.log("filePath: ", filePath);

    filePath = `C:/Users/Dinakar/Documents/GitHub/Image-Server-Tutorial/Backend-NodeJS-Express/controllers/../uploads/${filePath}`;
    // Delete file from uploads folder. For example if filePath is 'uploads/abc.jpg' then file 'abc.jpg' will be deleted from uploads folder.
    fs.unlink(filePath, function (err) {
      if (err) {
        return next(new AppError("File not found", 404));
      }
      console.log("File deleted!");
      return res.send("File deleted successfully.");
    });
  } catch (error) {
    return next(new AppError("Error deleting file", 500));
  }
});
