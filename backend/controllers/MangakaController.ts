import { Request, Response } from "express";
import { MangakaModel } from "../models/MangakaModel.js";
import { isValidObjectId } from "mongoose";

// Helpers
import getToken from "../helpers/get-token.js";
import getUserByToken from "../helpers/get-user-by-token.js";

class MangakaController {
  static async create(req: Request, res: Response) {
    const { mangakaName, information, twitter } = req.body;

    let image = "";

    // Upload da Imagem
    if (req.file) {
      // Se estiver usando S3
      if ("key" in req.file && typeof req.file.key === "string") {
        image = req.file.key;
      }
      // Se estiver usando armazenamento local
      else if (
        "filename" in req.file &&
        typeof req.file.filename === "string"
      ) {
        image = req.file.filename;
      }
    }

    // Validações
    if (!mangakaName) {
      res.status(422).json({
        message: "O nome do Mangaka é obrigatório!",
      });
      return;
    }

    if (!image) {
      res.status(422).json({ message: "A imagem é obrigatória!" });
      return;
    }

    // Pegar o Administrador responsável pelo cadastro do Mangaka
    const token: any = getToken(req);
    const user = await getUserByToken(token);

    if (!user) {
      res.status(401).json({ message: "Usuário não encontrado!" });
      return;
    }

    // Criar um novo Mangaka
    const mangaka = new MangakaModel({
      mangakaName,
      information,
      twitter,
      image,
    });

    try {
      const newMangaka = await mangaka.save();

      res.status(200).json({
        message: "Mangaka cadastrado com sucesso!",
        newMangaka,
      });
    } catch (err) {
      res.status(500).json({ message: err });
    }
  }

  static async getAllMangakas(req: Request, res: Response) {
    const mangakas = await MangakaModel.find().sort({ mangakaName: 1 });

    res.status(200).json({ mangakas });
  }

  static async getMangakaById(req: Request, res: Response) {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      res.status(422).json({ message: "ID inválido" });
    }

    const mangaka = await MangakaModel.findOne({ _id: id });

    if (!mangaka) {
      res.status(404).json({ message: "Mangaka não encontrado" });
    }

    res.status(200).json({ mangaka });
  }
}

export default MangakaController;
