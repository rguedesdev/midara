"use client";

import api from "@/utils/api";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

import { MangaForm } from "@/components/MangaForm";
import useFlashMessage from "@/hooks/useFlashMessage";

export default function EditManga() {
  const [hentai, setHentai] = useState({});
  const [token, setToken] = useState(""); // inicializa vazio
  const { id } = useParams();
  const { setFlashMessage } = useFlashMessage();

  useEffect(() => {
    const localToken = localStorage.getItem("token") || "";
    setToken(localToken);

    if (!localToken) return; // evita requisição sem token

    const fetchData = async () => {
      try {
        const response = await api.get(`/hentais/${id}`, {
          headers: {
            Authorization: `Bearer ${JSON.parse(localToken)}`,
          },
        });
        setHentai(response.data.hentai);
        console.log(response.data.hentai);
      } catch (err) {
        console.error(err);
        setFlashMessage("Erro ao carregar o hentai", "error");
      }
    };

    fetchData();
  }, [id]);

  async function updateHentai(hentai) {
    let msgType = "success";

    const formData = new FormData();

    await Object.keys(hentai).forEach((key) => {
      if (key === "images") {
        for (let i = 0; i < hentai[key].length; i++) {
          formData.append("images", hentai[key][i]);
        }
      } else if (key === "tags") {
        const tagsArray = hentai[key].split("; ");
        tagsArray.forEach((tag) => {
          formData.append(key, tag.trim());
        });
      } else {
        formData.append(key, hentai[key]);
      }
    });

    const data = await api
      .patch(`/hentais/edit/${hentai._id}`, formData, {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        msgType = "error";
        return err.response.data;
      });

    setFlashMessage(data.message, msgType);
  }

  return (
    <section className="min-h-screen flex flex-col items-center mt-8 mb-8">
      <div>
        <h1>Editando o Hentai: {hentai.title}</h1>
      </div>
      {hentai.title && (
        <MangaForm handleSubmit={updateHentai} hentaiData={hentai} />
      )}
    </section>
  );
}
