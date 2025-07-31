"use client";

import { useState, useEffect } from "react";
import api from "@/utils/api";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import styles from "./style.module.css";
import { useRouter } from "next/navigation";

// React Icons
import { RiPenNibFill, RiBook2Fill } from "react-icons/ri";
import { FaTwitter } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

// Hooks
import useFlashMessage from "@/hooks/useFlashMessage";

// Components
import { Spinner } from "@/components/Spinner";

function MangakaDetails() {
  const { id } = useParams();
  const [mangaka, setMangaka] = useState({});
  const [hentais, setHentais] = useState({});
  const { setFlashMessage } = useFlashMessage();
  const [token] = useState(localStorage.getItem("token") || "");
  const [isLoading, setIsLoading] = useState(true); // Add a loading state

  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }

    api.get(`/mangakas/${id}`).then((response) => {
      setMangaka(response.data.mangaka);
    });

    api.get(`/hentais`).then((response) => {
      setHentais(response.data.hentais);
      setIsLoading(false);
    });
  }, [id, token]);

  if (
    isLoading ||
    !Object.keys(mangaka).length ||
    !Object.keys(hentais).length
  ) {
    return (
      <section className="min-h-screen flex flex-col justify-center items-center mt-4 mb-16">
        <h1>
          <Spinner />
        </h1>
      </section>
    );
  }

  return (
    <section className="min-h-screen">
      {mangaka.mangakaName && (
        <main className="grid grid-cols-10 gap-4 bg-pink-700">
          <div className="col-start-2 col-span-8 flex flex-col">
            <div className="flex flex-row mt-4">
              <Image
                className="w-64 h-96 rounded-lg mb-4 shadow-lg pointer-events-none select-none"
                src={`https://midara-midias.s3.us-east-1.amazonaws.com/${mangaka.image}`}
                alt={mangaka.mangakaName}
                width={50}
                height={50}
                unoptimized
              />
              <div className="flex flex-col ml-8 mr-8">
                <h1 className="text-center text-white text-2xl mt-4 mb-2">
                  {mangaka.mangakaName}
                </h1>

                <hr className="w-full h-px bg-gray-200 border-0" />

                <p className="mt-2 mb-3 text-white">
                  <strong>Informações:</strong> {mangaka.information}
                </p>
              </div>
            </div>

            <Link
              target="_BLANK"
              className="flex flex-row items-center justify-center bg-black transition-all ease-in duration-200 hover:bg-slate-900 text-white p-2 rounded shadow-lg px-14 w-64 mb-4 gap-4"
              href={mangaka.twitter}
            >
              <FaXTwitter size={20} />
              <span>Twitter | X</span>
            </Link>
          </div>
        </main>
      )}
      <article className="grid grid-cols-10 mt-6 mb-10">
        <div className="col-start-2 col-span-8 py-4 rounded-lg bg-pink-700 shadow-lg">
          <h1 className="text-center text-white text-2xl">
            Mangas e Doujinshis de {mangaka.mangakaName}
          </h1>
        </div>

        <div className="col-start-2 col-span-8 flex flex-wrap justify-center mt-6 mb-6 gap-8">
          {Object.values(hentais).map((hentai) => {
            if (hentai.mangaka.includes(mangaka.mangakaName)) {
              return (
                <div className="flex flex-col" key={hentai.id}>
                  <div className="mb-2">
                    <Image
                      className="w-64 h-96 rounded-lg mb-2 shadow-lg pointer-events-none select-none"
                      src={`https://midara-midias.s3.us-east-1.amazonaws.com/${hentai.images[0]}`}
                      alt={hentai.title}
                      width={50}
                      height={50}
                      unoptimized
                    />
                    <h3 className="flex flex-row items-center gap-4">
                      <RiBook2Fill size={20} />
                      <p className="titleOverflow">{hentai.title}</p>
                    </h3>
                  </div>
                  <Link
                    className="bg-blue-800 hover:bg-blue-600 transition-all ease-in duration-200 text-white p-2 rounded px-14 w-64 shadow-lg"
                    href={
                      hentai.format == "Manga"
                        ? `/mangas/${hentai._id}`
                        : `/doujinshis/${hentai._id}`
                    }
                  >
                    Página do Hentai
                  </Link>
                </div>
              );
            }
            return null;
          })}
        </div>
      </article>
    </section>
  );
}

export default MangakaDetails;
