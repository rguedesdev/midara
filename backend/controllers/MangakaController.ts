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

  // FUNCIONA, MAS NÃO PRECISO DE ACENTUAÇÃO PRA ESSA TAG -- MAS POSSO PRECISAR DOS CARACTERES ESPECIAIS --
  // static async getMangakaBySlug(req: Request, res: Response) {
  //     try {
  //       const { slug } = req.params;
  //       console.log("Slug recebido:", slug);

  //       if (!slug || typeof slug !== "string") {
  //         return res.status(400).json({ message: "Slug inválida!" });
  //       }

  //       // 1️⃣ Normaliza slug (minusculas, troca hífens por espaços)
  //       const normalizedSlug = slug.trim().toLowerCase().replace(/-/g, " ");
  //       console.log("Slug normalizado para busca:", normalizedSlug);

  //       // 2️⃣ Mapeamento de caracteres acentuados
  //       const accentMap: Record<string, string> = {
  //         a: "aàáâãäåā",
  //         e: "eèéêëē",
  //         i: "iìíîïī",
  //         o: "oòóôõöō",
  //         u: "uùúûüū",
  //         c: "cç",
  //         n: "nñ",
  //         y: "yÿý",
  //         s: "sśš",
  //       };

  //       // 3️⃣ Divide o slug em palavras e monta regex que aceita espaços e hífens
  //       const words = normalizedSlug.split(/\s+/).filter(Boolean);

  //       const expandedWords = words.map((word) =>
  //         word
  //           .split("")
  //           .map((char) => {
  //             const lower = char.toLowerCase();
  //             if (accentMap[lower]) {
  //               return `[${accentMap[lower]}]`;
  //             }
  //             if (/[.*+?^${}()|[\]\\]/.test(char)) {
  //               return `\\${char}`;
  //             }
  //             return char;
  //           })
  //           .join("")
  //       );

  //       const pattern = expandedWords.join("[ -]");
  //       const regex = new RegExp(`^${pattern}$`, "i");

  //       console.log("Regex gerado:", regex);

  //       // 4️⃣ Busca no banco
  //       const mangaka = await MangakaModel.findOne({
  //         mangakaName: { $regex: regex },
  //       });

  //       if (!mangaka) {
  //         return res.status(404).json({ message: "Mangaka não encontrado!" });
  //       }

  //       // 5️⃣ Retorna resultado
  //       return res.status(200).json({ mangaka });
  //     } catch (err) {
  //       console.error("Erro getMangakaBySlug:", err);
  //       return res.status(500).json({ message: "Erro interno" });
  //     }
  //   }

  static async getMangakaBySlug(req: Request, res: Response) {
    try {
      const { slug } = req.params;
      console.log("Slug recebido:", slug);

      if (!slug || typeof slug !== "string") {
        res.status(400).json({ message: "Slug inválida!" });
        return;
      }

      // 1️⃣ Converter slug para lowercase e substituir hífens por espaços temporariamente
      const normalizedSlug = slug.trim().toLowerCase().replace(/-/g, " ");
      console.log("Slug normalizado para busca:", normalizedSlug);

      // 2️⃣ Regex que permite que espaços do slug batam com espaços ou hífens reais do nome
      const mangaka = await MangakaModel.findOne({
        mangakaName: {
          $regex: new RegExp(
            normalizedSlug
              .split(" ")
              .map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
              .join("[ -]"),
            "i"
          ),
        },
      });

      if (!mangaka) {
        res.status(404).json({ message: "Mangaka não encontrado!" });
        return;
      }

      return res.status(200).json({ mangaka });
    } catch (err) {
      console.error("Erro getMangakaBySlug:", err);
      return res.status(500).json({ message: "Erro interno" });
    }
  }
}

export default MangakaController;
