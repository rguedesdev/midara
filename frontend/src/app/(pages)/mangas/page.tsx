"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

import api from "@/utils/api";

// Components
import { Spinner } from "@/components/Spinner";

// Icons
import { RiPenNibFill, RiBook2Fill } from "react-icons/ri";

function Mangas() {
  const [hentais, setHentais] = useState([]);

  // Função inline para gerar slug
  const makeSlug = (title: string) =>
    title
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // remove acentos
      .replace(/\s+/g, "-"); // espaços → hífen, mantém hífens originais

  useEffect(() => {
    api.get("/hentais").then((response) => {
      setHentais(response.data.hentais);
    });
  }, []);

  if (!hentais || hentais.length === 0) {
    return (
      <section className="min-h-screen flex flex-col justify-center items-center mt-4 mb-16">
        <h1>
          <Spinner />
        </h1>
      </section>
    );
  }

  return (
    <section className="min-h-screen flex flex-col items-center mt-8 mb-16">
      <article className="grid grid-cols-10">
        <div className="col-start-2 col-span-8 py-4 rounded-lg bg-pink-700 shadow-lg">
          <h1 className="text-center text-white text-2xl">Mangás Hentai</h1>
        </div>
        <div className="col-start-2 col-span-8 flex flex-row justify-center mt-6 mb-6 gap-8 overflow-visible">
          <div className="breakLine flex flex-row justify-center gap-4 static">
            {hentais.map(
              (hentai) =>
                hentai.format === "Manga" && (
                  <div className="flex flex-col">
                    <div className="mb-2">
                      <Image
                        className="w-64 h-96 rounded-lg mb-2 shadow-lg select-none pointer-events-none"
                        src={`https://midara-midias.s3.us-east-1.amazonaws.com/${hentai.images[0]}`}
                        alt={hentai.title}
                        width={50}
                        height={50}
                        unoptimized
                      />
                      <h3 className="mb-2 flex flex-row items-center gap-4">
                        <RiBook2Fill size={20} />
                        <p className="titleOverflow">{hentai.title}</p>
                      </h3>
                      <h2 className="flex flex-row items-center gap-4 text-ellipsis overflow-hidden">
                        <RiPenNibFill size={20} />
                        {hentai.mangaka}
                      </h2>
                    </div>
                    <Link
                      className="bg-blue-800 hover:bg-blue-600 transition-all ease-in duration-200 text-white p-2 rounded px-14 shadow-lg"
                      href={`/mangas/${makeSlug(hentai.title)}`}
                    >
                      Página do Hentai
                    </Link>
                  </div>
                )
            )}
            {hentais.length === 0 && <p>Não há Mangás em catálogo</p>}
          </div>
        </div>
      </article>
    </section>
  );
}

export default Mangas;
