import bcrypt from "bcryptjs";
import catchAsync from "../utils/catchAsync.js";
import dotenv from "dotenv";

dotenv.config();

export const verifyAPIKey = catchAsync(async (req, res, next) => {
    let api_key;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      api_key = req.headers.authorization.split(" ")[1];
    }
    console.log(api_key)
  
    if (!api_key) {
      return next(new AppError("Not authorized to access this route", 401));
    }
    try {
      const isMatch = await bcrypt.compare(
        api_key,
        process.env.SECRET_API_ENCRYPTION_KEY
      );

      console.log(isMatch)
      if (!isMatch) {
        return next(new AppError("Denied access since API key is invalid", 401));
      }
      next();
    } catch (error) {
      return next(new AppError("Not authorized to access this route", 401));
    }
});

// // create an api key using bcrypt
// const createAPIKey = async () => {
// const CLIENT_API_KEY = bcrypt.hash('randomString', 12);
//   const api_key =  await bcrypt.hash(CLIENT_API_KEY, 12);
//   console.log(api_key)
// }

// createAPIKey();

// bcrypt.compare('$2a$12$iI8b2reAc7VLAg.vZFsht.iZyM02rgO0vZ93oHES6tDim8C1Fg.gG', process.env.SECRET_API_ENCRYPTION_KEY, (err, res) => {
//   console.log(res)
// })







