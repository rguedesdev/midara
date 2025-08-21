"use client";

import { useState, useEffect } from "react";
import api from "@/utils/api";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

// Icons
import { BsBookHalf } from "react-icons/bs";
import { FaHashtag } from "react-icons/fa";

// Hooks
import useFlashMessage from "@/hooks/useFlashMessage";

// Components
import { Spinner } from "@/components/Spinner";
import { Comments } from "@/components/CommentsComponent";

interface IMangaka {
  _id: string;
  mangakaName: string;
}

function MangaDetails() {
  const { id } = useParams();
  const [hentai, setHentai] = useState<any>({});
  const [tags, setTags] = useState<Record<string, any>>({});
  const [mangakas, setMangakas] = useState<Record<string, IMangaka>>({});
  const { setFlashMessage } = useFlashMessage();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const hentaiRes = await api.get(`/hentais/${id}`);
        setHentai(hentaiRes.data.hentai);

        const tagsRes = await api.get("/tags");
        const tagsData = tagsRes.data.tags.reduce((acc, tag) => {
          acc[tag._id] = tag;
          return acc;
        }, {} as Record<string, any>);
        setTags(tagsData);

        const mangakasRes = await api.get("/mangakas");
        const mangakasData = mangakasRes.data.mangakas.reduce(
          (acc, mangaka) => {
            acc[mangaka.mangakaName] = mangaka;
            return acc;
          },
          {} as Record<string, IMangaka>
        );
        setMangakas(mangakasData);

        setIsLoading(false);
      } catch (err) {
        console.error(err);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center mt-4 mb-16">
        <Spinner />
      </div>
    );
  }

  return (
    <section className="min-h-screen">
      {hentai.format == "Manga" && (
        <main className="grid grid-cols-10 gap-4 bg-pink-700">
          <div className="col-start-2 col-span-8 flex flex-col items-center lg:flex-row lg:items-start mt-8">
            {hentai.images.map((image: string, index: number) => (
              <Image
                className="w-64 h-96 rounded-md shadow-lg flex flex-row justify-center mb-8 gap-4 pointer-events-none select-none"
                src={`https://midara-midias.s3.us-east-1.amazonaws.com/${image}`}
                alt={hentai.title}
                key={index}
                width={50}
                height={50}
                unoptimized
              />
            ))}
            <div className="flex flex-col mx-8 -mt-8 mb-4 lg:-mt-0 lg:mb-0">
              <h1 className="text-center text-white text-2xl mt-4 mb-2">
                {hentai.title}
              </h1>

              <hr className="w-full h-px bg-gray-200 border-0" />

              <p className="mt-2 mb-3 text-white">
                <strong>Sinopse:</strong> {hentai.description}
              </p>

              <h2 className="mb-2 text-white">
                <strong>Mangaka:</strong>{" "}
                {hentai.mangaka && (
                  <Link
                    href={
                      mangakas[hentai.mangaka]
                        ? `/mangakas/${mangakas[hentai.mangaka]._id}`
                        : ""
                    }
                    className="bg-blue-700 hover:bg-blue-600 transform duration-200 border border-white px-3 rounded-xl mr-1"
                  >
                    {hentai.mangaka}
                  </Link>
                )}
              </h2>

              <h2 className="mb-2 text-white">
                <strong>Tags:</strong>{" "}
                {hentai.tags.map((tagEl: string, index: number) => {
                  const matchingTag = Object.values(tags).find(
                    (tag) => tag.tagName === tagEl
                  );

                  return (
                    <Link
                      href={matchingTag ? `/tags/${matchingTag._id}` : ""}
                      className="bg-blue-700 hover:bg-blue-600 transform duration-200 border border-white px-3 rounded-xl mr-1"
                      key={index}
                    >
                      {tagEl}
                    </Link>
                  );
                })}
              </h2>

              <h2 className="text-white">
                <strong>Status do Projeto:</strong> {hentai.status}
              </h2>
            </div>
          </div>
        </main>
      )}

      <article className="grid grid-cols-10 mt-6 mb-10 flex-col">
        <div className="col-start-2 col-span-8 py-4 rounded-lg bg-pink-700 text-white shadow-lg">
          <h1 className="text-center text-2xl">Capítulos</h1>
        </div>

        <div className="col-start-2 col-span-8 flex flex-row justify-center mt-6 mb-6 gap-8 breakLine">
          {hentai.chapters &&
            hentai.chapters.map((chapter: any, chapterIndex: number) => (
              <div key={chapterIndex}>
                {chapter.imagesChapter.length > 0 && (
                  <Image
                    className="w-64 h-96 shadow-lg rounded-lg pointer-events-none select-none"
                    src={`https://midara-midias.s3.us-east-1.amazonaws.com/${chapter.imagesChapter[0]}`}
                    alt={chapter.titleChapter}
                    width={50}
                    height={50}
                    unoptimized
                  />
                )}

                <h3 className="flex flex-row items-center mt-2">
                  <FaHashtag className="mr-3" size={20} />{" "}
                  {chapter.titleChapter}
                </h3>
                <Link
                  href={`/chapter/${chapter._id}`}
                  className="flex flex-row items-center justify-center w-64 rounded p-2 mt-2 bg-blue-700 hover:bg-blue-600 transition-all duration-200 text-white shadow-lg"
                >
                  <BsBookHalf className="mr-3" size={20} />
                  Ler Online
                </Link>
              </div>
            ))}
        </div>
      </article>

      {/* Comentários centralizados */}
      <div className="grid grid-cols-10 mb-40">
        <div className="col-start-2 col-span-8 flex justify-center mt-10">
          <div className="w-full max-w-[1200px]">
            <Comments
              url={hentai?.url || `/hentai/${hentai?._id}`}
              identifier={hentai?._id}
              title={hentai?.title ?? "Sem título"}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default MangaDetails;
