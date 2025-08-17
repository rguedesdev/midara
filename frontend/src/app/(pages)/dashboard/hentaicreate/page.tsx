"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/utils/api";

// Components
import { MangaForm } from "@/components/MangaForm";
import { Message } from "@/components/Message";

// Hooks
import useFlashMessage from "@/hooks/useFlashMessage";

function HentaiCreate() {
  const [token, setToken] = useState("");
  const { setFlashMessage } = useFlashMessage();
  const router = useRouter();

  useEffect(() => {
    const localToken = localStorage.getItem("token") || "";
    setToken(localToken);
  }, []);

  async function registerManga(hentai) {
    if (!token) {
      setFlashMessage("Token não encontrado", "error");
      return;
    }

    let msgType = "success";
    const formData = new FormData();

    Object.keys(hentai).forEach((key) => {
      if (key === "images") {
        hentai[key].forEach((img) => formData.append("images", img));
      } else if (key === "tags") {
        hentai[key]
          .split("; ")
          .forEach((tag) => formData.append(key, tag.trim()));
      } else {
        formData.append(key, hentai[key]);
      }
    });

    try {
      const response = await api.post(`/hentais/create`, formData, {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setFlashMessage(response.data.message, "success");
      router.push("/catalog");
    } catch (err: any) {
      console.error(err);
      setFlashMessage(
        err.response?.data?.message || "Erro desconhecido",
        "error"
      );
    }
  }

  return (
    <section className="min-h-screen flex flex-col items-center mt-8 mb-8">
      <div className="text-center">
        <h1>My Dashboard</h1>
        <p>Após cadastrar, o Hentai ficará disponível para leitura!</p>
      </div>
      <div>
        <Message />
        <p>Formulário</p>
        <MangaForm handleSubmit={registerManga} />
      </div>
    </section>
  );
}

export default HentaiCreate;
