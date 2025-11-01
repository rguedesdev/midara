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
      // S3
      if ("key" in req.file && typeof req.file.key === "string") {
        image = req.file.key;
      }
      // Local
      else if (
        "filename" in req.file &&
        typeof req.file.filename === "string"
      ) {
        image = req.file.filename;
      }
    }

    // Validações
    if (!tagName) {
      res.status(422).json({ message: "O nome da tag é obrigatório!" });
      return;
    }

    const tagExist = await TagsModel.findOne({ tagName });

    if (tagExist) {
      res.status(422).json({ message: "Tag já cadastrada!" });
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
      tagName,
      definition,
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

  static async getTagBySlug(req: Request, res: Response) {
    try {
      const { slug } = req.params;
      console.log("Slug recebido:", slug);

      if (!slug || typeof slug !== "string") {
        return res.status(400).json({ message: "Slug inválida!" });
      }

      // 1️⃣ Normaliza slug: minúsculas, troca hífens por espaços
      const normalizedSlug = slug.trim().toLowerCase().replace(/-/g, " ");
      console.log("Slug normalizado para busca:", normalizedSlug);

      // 2️⃣ Define mapa de acentos (permite que mae case com mãe, coracao com coração, etc.)
      const accentMap: Record<string, string> = {
        a: "aàáâãäåā",
        e: "eèéêëē",
        i: "iìíîïī",
        o: "oòóôõöō",
        u: "uùúûüū",
        c: "cç",
        n: "nñ",
        y: "yÿý",
      };

      // 3️⃣ Monta regex ignorando acentos e aceitando espaço/hífen entre palavras
      const words = normalizedSlug.split(/\s+/).filter(Boolean);

      const expandedWords = words.map((word) =>
        word
          .split("")
          .map((char) => {
            const lower = char.toLowerCase();
            if (accentMap[lower]) {
              return `[${accentMap[lower]}]`;
            }
            // escapa caracteres regex especiais
            if (/[.*+?^${}()|[\]\\]/.test(char)) {
              return `\\${char}`;
            }
            return char;
          })
          .join("")
      );

      const pattern = expandedWords.join("[ -]");
      const regex = new RegExp(`^${pattern}$`, "i");

      console.log("Regex gerado:", regex);

      // 4️⃣ Busca no banco
      const tag = await TagsModel.findOne({
        tagName: { $regex: regex },
      });

      if (!tag) {
        return res.status(404).json({ message: "Tag não encontrada!" });
      }

      // 5️⃣ Retorna resultado
      return res.status(200).json({ tag });
    } catch (err) {
      console.error("Erro getTagBySlug:", err);
      return res.status(500).json({ message: "Erro interno" });
    }
  }
}

export default TagsController;
