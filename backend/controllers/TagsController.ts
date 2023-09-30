import { Request, Response } from "express";
import { TagsModel } from "../models/TagsModel.js";
import path from "path";

// Helpers
import getToken from "../helpers/get-token.js";
import getUserByToken from "../helpers/get-user-by-token.js";
import { isValidObjectId } from "mongoose";

class TagsController {
	static async create(req: Request, res: Response) {
		const { tagName, definition } = req.body;

		// Upload de imagem
		let image = "";

		if (req.file) {
			const key =
				Date.now() +
				Math.floor(Math.random() * 1000) +
				path.extname(req.file.originalname);
			// Agora, você pode usar a variável "key" para ambos os armazenamentos
			image = key;
		}

		// Validações
		if (!tagName) {
			res.status(422).json({ message: "O nome da tag é obrigatório!" });
			return;
		}

		const tagExist = await TagsModel.findOne({ tagName: tagName });

		if (tagExist) {
			res.status(422).json({ message: "Tag já cadastradas!" });
			return;
		}

		if (!definition) {
			res.status(422).json({
				message: "A definição da tag é obrigatória!",
			});
			return;
		}

		// Pegar o Administrador responsável pelo cadastro da Tag
		const token: any = getToken(req);
		const user = await getUserByToken(token);

		if (!user) {
			res.status(401).json({ message: "Usuário não encontrado!" });
			return;
		}

		if (!image) {
			res.status(422).json({ message: "A imagem é obrigatória!" });
			return;
		}

		const tag = new TagsModel({
			tagName: tagName,
			definition: definition,
			image,
		});

		try {
			const newTag = await tag.save();

			res.status(200).json({
				message: "Tag cadastrada com sucesso",
				newTag,
			});
		} catch (err) {
			res.status(500).json({ message: err });
		}
	}

	static async getAllTags(req: Request, res: Response) {
		const tags = await TagsModel.find().sort({ tagName: 1 });

		res.status(200).json({ tags });
	}

	static async getTagById(req: Request, res: Response) {
		const { id } = req.params;

		if (!isValidObjectId(id)) {
			res.status(422).json({ message: "ID inválido!" });
			return;
		}

		// Verificar se a Tag existe
		const tag = await TagsModel.findOne({ _id: id });

		if (!tag) {
			res.status(404).json({ message: "Tag não encontrada" });
		}

		res.status(200).json({ tag });
	}
}

export default TagsController;
