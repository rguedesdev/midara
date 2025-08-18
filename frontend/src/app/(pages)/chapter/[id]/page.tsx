"use client";

// Imports Principais
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/utils/api";
import Image from "next/image";
import styles from "./chapter.module.css";

// Components
import { Spinner } from "@/components/Spinner";
import { AdBlockDetector } from "@/components/AdBlockDetector";

import { BsChevronLeft, BsChevronRight } from "react-icons/bs";

// Images
import ChibiBunny from "../../../../../public/chibi-bunny.png";

function Chapter() {
  const { id } = useParams();
  const [chapter, setChapter] = useState(null);
  const [hentais, setHentais] = useState([]);
  const [token] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState({});
  const [subscriptionActive, setSubscriptionActive] = useState(false);

  const router = useRouter();

  // Desabilitar o menu de contexto do botão direito do mouse
  useEffect(() => {
    document.addEventListener("contextmenu", (e) => {
      e.preventDefault();
    });

    return () => {
      // Remover o event listener ao desmontar o componente
      document.removeEventListener("contextmenu", (e) => {
        e.preventDefault();
      });
    };
  }, []);

  useEffect(() => {
    // if (!token) {
    //   router.push("/login"); // Redireciona para a página de login
    //   return; // Encerre o useEffect para evitar que o restante do código seja executado
    // }
    // api
    //   .get("/users/checkuser", {
    //     headers: {
    //       Authorization: `Bearer ${JSON.parse(token)}`,
    //     },
    //   })
    //   .then((response) => {
    //     setUser(response.data);
    //     if (response.data.subscriptionInfo.length > 0) {
    //       setSubscriptionActive(response.data.subscriptionInfo[0].status);
    //     }
    //   })
    //   .catch((error) => {
    //     // Lidar com o erro, se necessário
    //   });

    api.get("/hentais").then((response) => {
      const hentaisData = response.data.hentais;
      setHentais(hentaisData);

      const selectedChapter = hentaisData.reduce((foundChapter, hentai) => {
        const chapter = hentai.chapters.find((chapter) => chapter._id === id);
        if (chapter) {
          return chapter;
        }
        return foundChapter;
      }, null);
      setChapter(selectedChapter);
    });
  }, [id, token]);

  if (!chapter || hentais.length === 0) {
    return (
      <section className="min-h-screen flex flex-col justify-center items-center mt-4 mb-16">
        <h1>
          <Spinner />
        </h1>
      </section>
    );
  }

  const hentai = hentais.find((hentai) =>
    hentai.chapters.some((chap) => chap._id === id)
  );

  const currentChapterIndex = hentai.chapters.findIndex(
    (chap) => chap._id === chapter._id
  );

  // // Verificar a assinatura antes de retornar o JSX
  // if (subscriptionActive !== "active") {
  //   return (
  //     <section className="min-h-screen flex flex-col justify-center items-center">
  //       <div className="mb-2">
  //         <Image
  //           src={ChibiBunny}
  //           alt="Chibi Bunny"
  //           width={400}
  //           unoptimized
  //           priority
  //         />
  //       </div>
  //       <h1 className="text-2xl mb-2">
  //         Você não tem uma assinatura ativa para acessar esta página.
  //       </h1>
  //       <p className="mb-2">
  //         Torne-se premium para ter acesso à 100% do conteúdo!
  //       </p>
  //       <Link
  //         className="bg-blue-800 hover-bg-blue-500 text-white transition-all ease-in duration-200 mt-4 py-2 px-4 rounded"
  //         href="/subscription"
  //       >
  //         Assinar Plano Premium
  //       </Link>
  //     </section>
  //   );
  // }

  // Se a assinatura for ativa, retornar o JSX correspondente
  return (
    // <AdBlockDetector>
    <section className="min-h-screen flex flex-col items-center mt-4 mb-16">
      <div className="mb-8"></div>
      <article className="grid grid-cols-10">
        <div className="col-start-2 col-span-8">
          <div className="py-4 rounded-lg bg-pink-700 mb-4 shadow-lg text-white">
            <h1 className="text-center text-2xl">
              {hentai.title} ({chapter.titleChapter})
            </h1>
            <h3 className="text-center text-xl">{chapter.subtitleChapter}</h3>
          </div>
          {subscriptionActive !== "active" && (
            <div className="flex flex-row justify-center items-center">
              <div className="bg-violet-900 py-8 w-[1200px] text-center font-semibold text-2xl rounded-md">
                [Anúncio ExoClick Aqui]
              </div>
            </div>
          )}

          <div className="col-start-2 col-span-8 flex flex-row justify-center mt-6 mb-6 gap-8 overflow-visible">
            <div className="breakLine flex flex-col items-center gap-8">
              {chapter.imagesChapter.length > 0 ? (
                chapter.imagesChapter.reduce<React.ReactNode[]>(
                  (acc, image, index) => {
                    // Colocar o bloco da imagem + as duas publicidades laterais
                    acc.push(
                      <div
                        key={`img-block-${index}`}
                        className="flex flex-row justify-center items-center gap-10"
                      >
                        {subscriptionActive !== "active" && (
                          <div
                            style={{
                              writingMode: "vertical-rl",
                              textOrientation: "upright",
                            }}
                            className="hidden sm:flex bg-violet-900 py-8 sm:w-[150px] sm:h-[1280px] justify-center items-center text-center font-semibold text-2xl rounded-md mb-2"
                          >
                            [Anúncio ExoClick Aqui]
                          </div>
                        )}

                        <Image
                          className="rounded-lg shadow-xl w-[300px] lg:w-[1200px] h-auto object-contain pointer-events-none select-none"
                          src={`https://midara-midias.s3.us-east-1.amazonaws.com/${image}`}
                          alt={`Imagem ${index + 1}`}
                          width={50}
                          height={50}
                          unoptimized
                          draggable="false"
                        />

                        {subscriptionActive !== "active" && (
                          <div
                            style={{
                              writingMode: "vertical-rl",
                              textOrientation: "upright",
                            }}
                            className="hidden sm:flex bg-violet-900 py-8 sm:w-[150px] sm:h-[1280px] justify-center items-center text-center font-semibold text-2xl rounded-md mb-2"
                          >
                            [Anúncio ExoClick Aqui]
                          </div>
                        )}
                      </div>
                    );

                    // A cada 10 imagens, adicionar um banner vertical extra (abaixo das 10 imagens)
                    if (
                      (index + 1) % 4 === 0 &&
                      index !== chapter.imagesChapter.length - 1 &&
                      subscriptionActive !== "active"
                    ) {
                      acc.push(
                        <div
                          key={`vertical-ad-${index}`}
                          className="bg-violet-900 py-8 w-full max-w-[1280px] text-center font-semibold text-2xl rounded-md"
                        >
                          [Anúncio ExoClick Aqui - A cada 4 páginas]
                        </div>
                      );
                    }
                    return acc;
                  },
                  []
                )
              ) : (
                <p>Não há imagens disponíveis para este capítulo.</p>
              )}
            </div>

            <a
              href="#"
              className={`bg-blue-800 hover-bg-blue-500 transition-all ease-in duration-200 shadow-xl ${styles.btn}`}
            ></a>
          </div>
        </div>
      </article>
      <div className="flex flex-row justify-center gap-8">
        {currentChapterIndex > 0 && (
          <Link
            className="bg-blue-800 w-[300px] h-[60px] transition-all ease-in duration-200 hover:bg-blue-700 py-2 pl-3 pr-4 rounded-lg flex flex-row justify-center items-center gap-2"
            href={`/chapter/${hentai.chapters[currentChapterIndex - 1]._id}`}
          >
            <BsChevronLeft size={20} />
            <span> Capítulo Anterior</span>
          </Link>
        )}
        {currentChapterIndex < hentai.chapters.length - 1 && (
          <Link
            className="bg-blue-800 w-[300px] h-[60px] transition-all ease-in duration-200 hover:bg-blue-700 py-2 pl-4 pr-3 rounded-lg flex flex-row justify-center items-center gap-2"
            href={`/chapter/${hentai.chapters[currentChapterIndex + 1]._id}`}
          >
            <span> Próximo Capítulo</span>
            <BsChevronRight size={20} />
          </Link>
        )}
      </div>
    </section>
    // </AdBlockDetector>
  );
}

export default Chapter;
