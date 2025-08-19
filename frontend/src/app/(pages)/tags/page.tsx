"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

import api from "@/utils/api";

// Components
import { Spinner } from "@/components/Spinner";

// Icons
import { IoPricetagsSharp } from "react-icons/io5";

function TagsPage() {
  const [tags, setTags] = useState([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const { data } = await api.get("/tags");
        setTags(data.tags);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTags();
  }, []);

  if (!tags || tags.length === 0) {
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
          <h1 className="text-center text-white text-2xl">Tags Hentai</h1>
        </div>
        <div className="col-start-2 col-span-8 flex flex-row justify-center mt-6 mb-6 gap-8 overflow-visible">
          <div className="breakLine flex flex-row justify-center gap-4 static">
            {tags.length > 0 &&
              tags.map((tag) => (
                <div className="flex flex-col">
                  <div className="mb-2">
                    <Image
                      className="w-64 h-96 rounded-lg mb-2 shadow-lg select-none pointer-events-none"
                      src={`https://midara-midias.s3.us-east-1.amazonaws.com/${tag.image}`}
                      alt={tag.tagName}
                      width={50}
                      height={50}
                      unoptimized
                    />
                    <h3 className="flex flex-row items-center gap-4">
                      <IoPricetagsSharp size={20} />
                      <p className="titleOverflow">{tag.tagName}</p>
                    </h3>
                  </div>

                  <Link
                    className="bg-blue-800 hover:bg-blue-600 transition-all ease-in duration-200 text-white p-2 rounded px-14 w-64 shadow-lg"
                    href={`/tags/${tag._id}`}
                  >
                    Página da Tag
                  </Link>
                </div>
              ))}
            {tags.length === 0 && <p>Não há Mangás em catálogo</p>}
          </div>
        </div>
      </article>
    </section>
  );
}

export default TagsPage;
