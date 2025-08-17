"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import api from "@/utils/api";

// Components
import { RoundedImage } from "@/components/RoundedImage";

// Hooks
import useFlashMessage from "@/hooks/useFlashMessage";

export default function Catalog() {
  const [hentais, setHentais] = useState([]);
  const [token, setToken] = useState(""); // inicializa vazio
  const { setFlashMessage } = useFlashMessage();

  useEffect(() => {
    const localToken = localStorage.getItem("token") || "";
    setToken(localToken);

    if (!localToken) return; // evita requisição sem token

    const fetchData = async () => {
      try {
        const response = await api.get("/hentais", {
          headers: {
            Authorization: `Bearer ${JSON.parse(localToken)}`,
          },
        });
        setHentais(response.data.hentais);
      } catch (err) {
        console.error(err);
        setFlashMessage("Erro ao carregar catálogo", "error");
      }
    };

    fetchData();
  }, []);

  async function removeHentai(id) {
    let msgType = "success";

    const data = await api
      .delete(`/hentais/${id}`, {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      })
      .then((response) => {
        const updatedHentai = hentais.filter((hentai) => hentai._id !== id);
        setHentais(updatedHentai);
        return response.data;
      })
      .catch((err) => {
        msgType = "error";
        return err.response.data;
      });

    setFlashMessage(data.message, msgType);
  }

  return (
    <div className="min-h-screen">
      <h1 className="text-center mt-8 mb-3">Catálogo de Títulos</h1>
      <div className="text-white mt-8 mb-4 flex flex-row justify-center gap-4">
        {hentais.length > 0 &&
          hentais.map((hentai) => (
            <div className="flex flex-col" key={hentai._id}>
              <Image
                className="w-56 rounded"
                src={`${process.env.NEXT_PUBLIC_API}/images/hentais/${hentai.images[0]}`}
                alt={hentai.title}
                width={0}
                height={0}
                priority
                unoptimized
              />
              <span className="bold mb-2 mt-2">{hentai.title}</span>
              <Link
                className="text-center text-white bg-blue-600 w-56 p-2 rounded mb-4"
                href={`/catalog/edit/${hentai._id}`}
              >
                Editar Hentai
              </Link>
              <Link
                className="text-center text-white bg-green-600 w-56 p-2 rounded mb-4"
                href={`/catalog/createchapter/${hentai._id}`}
              >
                Adicionar Capítulo
              </Link>
              <button
                onClick={() => {
                  removeHentai(hentai._id);
                }}
                className="text-center text-white bg-red-600 w-56 p-2 rounded mb-4"
              >
                Excluir Hentai
              </button>
            </div>
          ))}
        {hentais.length === 0 && <p>Não há Hentais cadastrados</p>}
      </div>
    </div>
  );
}
