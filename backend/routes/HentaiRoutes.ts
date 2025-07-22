import HentaiController from "../controllers/HentaiController.js";
import { Router } from "express";
const router = Router();
import express from "express";

const app = express();

// Middleware
import verifyToken from "../helpers/verify-token.js";
import { imageUpload } from "../helpers/image-upload.js";

// Rotas
router.post(
  "/create",
  verifyToken,
  imageUpload.array("images"),
  HentaiController.create
);

router.get("/", HentaiController.getAll);
router.get("/:id", HentaiController.getHentaiById);
router.delete("/:id", verifyToken, HentaiController.removeHentaiById);
router.patch(
  "/edit/:id",
  verifyToken,
  imageUpload.array("images"),
  HentaiController.updateHentai
);
router.patch(
  "/chcreate/:id",
  verifyToken,
  imageUpload.array("images"),
  HentaiController.createChapters
);

export default router;
