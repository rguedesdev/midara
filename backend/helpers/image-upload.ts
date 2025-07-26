// import {NextFunction} from 'express'
import { Request } from "express";
import multer from "multer";
import multerS3 from "multer-s3";
import { S3Client } from "@aws-sdk/client-s3";
import path from "path";

const s3Client = new S3Client({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID! || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY! || "",
  },
});

// Destino do Store Image
const storageTypes: { [key: string]: multer.StorageEngine } = {
  local: multer.diskStorage({
    // Disk Storage Local - para Armazenar imagens localmente, em ambiente de desenvolvimento
    destination: (req: Request, file, cb) => {
      let folder = "";

      if (req.baseUrl.includes("users")) {
        folder = "users";
      } else if (req.baseUrl.includes("hentais")) {
        folder = "hentais";
      } else if (req.baseUrl.includes("mangakas")) {
        folder = "mangakas";
      } else if (req.baseUrl.includes("tags")) {
        folder = "tags";
      } else if (req.baseUrl.includes("chapters")) {
        folder = "chapters";
      }

      cb(null, `public/images/${folder}`);
    },
    filename: (req, file, cb) => {
      cb(
        null,
        Date.now() +
          String(Math.floor(Math.random() * 1000)) +
          path.extname(file.originalname)
      );
    },
  }),

  // Disk Storage S3 - para armazenar imagens na AWS S3
  S3: multerS3({
    s3: s3Client,
    bucket: process.env.AWS_BUCKET!,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      // Essa Key é igual o filename do DiskStorage
      cb(
        null,
        Date.now() +
          String(Math.floor(Math.random() * 1000)) +
          path.extname(file.originalname)
      );
    },
  }),
};

const imageUpload = multer({
  storage: storageTypes[process.env.IMAGE_STORAGE_TYPE as string],
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(png|jpg)$/)) {
      return cb(new Error("Por favor envie somente imagens em jpg ou png!"));
    }
    cb(null, true);
  },
});

export { imageUpload };
