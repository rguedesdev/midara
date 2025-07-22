"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/utils/api";
import Image from "next/image";
import styles from "./chapter.module.css";

import { BsChevronLeft, BsChevronRight } from "react-icons/bs";

import ChibiBunny from "../../../../../public/chibi-bunny.png";

// Components
import { Spinner } from "@/components/Spinner";

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
    if (!token) {
      router.push("/login"); // Redireciona para a página de login
      return; // Encerre o useEffect para evitar que o restante do código seja executado
    }
    api
      .get("/users/checkuser", {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      })
      .then((response) => {
        setUser(response.data);
        if (response.data.subscriptionInfo.length > 0) {
          setSubscriptionActive(response.data.subscriptionInfo[0].status);
        }
      })
      .catch((error) => {
        // Lidar com o erro, se necessário
      });

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

  // Verificar a assinatura antes de retornar o JSX
  if (subscriptionActive === "active") {
    return (
      <section className="min-h-screen flex flex-col justify-center items-center">
        <div className="mb-2">
          <Image
            src={ChibiBunny}
            alt="Chibi Bunny"
            width={400}
            unoptimized
            priority
          />
        </div>
        <h1 className="text-2xl mb-2">
          Você não tem uma assinatura ativa para acessar esta página.
        </h1>
        <p className="mb-2">
          Torne-se premium para ter acesso à 100% do conteúdo!
        </p>
        <Link
          className="bg-blue-800 hover-bg-blue-500 text-white transition-all ease-in duration-200 mt-4 py-2 px-4 rounded"
          href="/subscription"
        >
          Assinar Plano Premium
        </Link>
      </section>
    );
  }

  // Se a assinatura for ativa, retornar o JSX correspondente
  return (
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
          <div className="col-start-2 col-span-8 flex flex-row justify-center mt-6 mb-6 gap-8 overflow-visible">
            <div className="breakLine flex flex-row justify-center gap-4 static">
              {chapter.imagesChapter.length > 0 ? (
                chapter.imagesChapter.map((image, index) => (
                  <img
                    className="w-9/12 rounded-lg mb-2 shadow-xl"
                    key={index}
                    src={`${process.env.NEXT_PUBLIC_API}/images/hentais/${image}`}
                    alt=""
                    draggable="false" // Adicione esta linha
                  />
                ))
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
            className="bg-blue-500 transition-all ease-in duration-200 hover-bg-blue-300 py-2 pl-3 pr-4 rounded flex flex-row justify-center items-center gap-2"
            href={`/chapter/${hentai.chapters[currentChapterIndex - 1]._id}`}
          >
            <BsChevronLeft size={20} />
            Capítulo Anterior
          </Link>
        )}
        {currentChapterIndex < hentai.chapters.length - 1 && (
          <Link
            className="bg-blue-500 transition-all ease-in duration-200 hover-bg-blue-300 py-2 pl-4 pr-3 rounded flex flex-row justify-center items-center gap-2"
            href={`/chapter/${hentai.chapters[currentChapterIndex + 1]._id}`}
          >
            Próximo Capítulo
            <BsChevronRight size={20} />
          </Link>
        )}
      </div>
    </section>
  );
}

export default Chapter;
