"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

import api from "@/utils/api";

// Components
import { Spinner } from "@/components/Spinner";

// Icons
import { RiPenNibFill } from "react-icons/ri";

function MangakasPage() {
  const [mangakas, setMangakas] = useState([]);
  const [token] = useState(localStorage.getItem("token") || "");

  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      await api.get("/mangakas").then((response) => {
        setMangakas(response.data.mangakas);
        // console.log(response.data.hentais);
      });
    };
    fetchData();
  }, [token]);

  if (!mangakas || mangakas.length === 0) {
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
          <h1 className="text-center text-white text-2xl">Mangakas</h1>
        </div>
        <div className="col-start-2 col-span-8 flex flex-row justify-center mt-6 mb-6 gap-8 overflow-visible">
          <div className="breakLine flex flex-row justify-center gap-4 static">
            {mangakas.length > 0 &&
              mangakas.map((mangaka) => (
                <div className="flex flex-col">
                  <div className="mb-2">
                    <Image
                      className="w-64 h-96 rounded-lg mb-2 shadow-lg select-none pointer-events-none"
                      src={`https://midara-midias.s3.us-east-1.amazonaws.com/${mangaka.image}`}
                      alt={mangaka.mangakaName}
                      width={50}
                      height={50}
                      unoptimized
                    />
                    <h3 className="flex flex-row items-center gap-4">
                      <RiPenNibFill size={20} />
                      <p className="titleOverflow">{mangaka.mangakaName}</p>
                    </h3>
                  </div>

                  <Link
                    className="bg-blue-800 hover:bg-blue-600 transition-all ease-in duration-200 text-white p-2 rounded px-14 w-64 shadow-lg"
                    href={`/mangakas/${mangaka._id}`}
                  >
                    Pág. do Mangaka
                  </Link>
                </div>
              ))}
            {mangakas.length === 0 && <p>Não há Mangakas em catálogo</p>}
          </div>
        </div>
      </article>
    </section>
  );
}

export default MangakasPage;
