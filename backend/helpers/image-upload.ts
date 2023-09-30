// import {NextFunction} from 'express'
import multer from "multer";
import path from "path";
import multerS3 from "multer-s3";
import aws from "@aws-sdk/client-s3";

interface FileWithKey extends Express.Multer.File {
	key: string;
}

// Destino do Store Image
const storageTypes = {
	local: multer.diskStorage({
		// Disk Storage Local - para Armazenar imagens localmente, em ambiente de desenvolvimento
		destination: (req, file, cb) => {
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
		s3: new aws.S3(),
		bucket: "uploadkon",
		contentType: multerS3.AUTO_CONTENT_TYPE,
		acl: "public-read",
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
	storage: storageTypes["local"],
	limits: {
		fileSize: 2 * 1024 * 1024,
	},
	fileFilter: (req, file, cb) => {
		if (!file.originalname.match(/\.(png|jpg)$/)) {
			return cb(
				new Error("Por favor envie somente imagens em jpg ou png!")
			);
		}
		cb(null, true);
	},
});

export { imageUpload };
