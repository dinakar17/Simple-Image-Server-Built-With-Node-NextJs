import express from "express";
import { verifyAPIKey } from "../controllers/authController.js";
import {
  createImage,
  deleteImage,
  getImage,
  getImages,
  uploadImageToFolder,
} from "../controllers/imageController.js";

const router = express.Router();

// Get all images
router.route("/getImages").get(getImages);

// CRUD operations on image
router
  .route("/:filename")
  .get(getImage)
  .delete(verifyAPIKey, deleteImage);

router.route("/upload").post(verifyAPIKey, uploadImageToFolder, createImage);

export default router;
