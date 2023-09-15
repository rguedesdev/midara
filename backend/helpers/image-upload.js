import { error } from "console";
import multer from "multer";
import path from "path";

// Destino do Store Image
const imageStore = multer.diskStorage({
	destination: function (req, file, cb) {
		// Folder se inicia como string vazia
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

	filename: function (req, file, cb) {
		cb(
			null,
			Date.now() +
				String(Math.random() * 1000) +
				path.extname(file.originalname)
		);
	},
});

const imageUpload = multer({
	storage: imageStore,
	fileFilter: function (req, file, cb) {
		if (!file.originalname.match(/\.(png|jpg)$/)) {
			return cd(
				new Error('"Por favor envie somente imagens em jpg ou png!')
			);
		}
		cb(null, true);
	},
});

export { imageUpload };
