"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Substitua next/navigation por next/router
import api from "@/utils/api";
import Link from "next/link";

// Components
import { MangaForm } from "@/components/MangaForm";
import { Message } from "@/components/Message";

// Hooks
import useFlashMessage from "@/hooks/useFlashMessage";

export default function Dashboard() {
  const [user, setUser] = useState({});
  const [token, setToken] = useState("");
  const { setFlashMessage } = useFlashMessage();
  const router = useRouter();

  useEffect(() => {
    const localToken = localStorage.getItem("token") || "";
    setToken(localToken);
  }, []);

  useEffect(() => {
    if (!token) return; // não roda se token não estiver carregado

    const fetchData = async () => {
      try {
        const { data } = await api.get("/users/checkuser", {
          headers: {
            Authorization: `Bearer ${JSON.parse(token)}`,
          },
        });

        if (
          data.email !== "r@gmail.com" ||
          data._id !== "650d388585f0942fd476d497"
        ) {
          setUser({ blocked: true });
        } else {
          setUser(data);
        }
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
        setUser({ error: true });
      }
    };
    fetchData();
  }, [token]);

  async function registerManga(hentai) {
    let msgType = "success";

    const formData = new FormData();

    const mangaFormData = await Object.keys(hentai).forEach((key) => {
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

    formData.append("hentai", mangaFormData);

    const data = await api
      .post(`/hentais/create`, formData, {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log(response.data);
        return response.data;
      })
      .catch((err) => {
        console.log(err);
        msgType = "error";
        return err.response.data;
      });

    setFlashMessage(data.message, msgType);

    if (msgType !== "error") {
      router.push("/catalog");
    }
  }

  return (
    <section className="min-h-screen mt-8 flex justify-center items-center">
      {user.blocked ? (
        <h1 className="text-xl">
          Você não tem permissão para acessar o Dashboard.
        </h1>
      ) : user.error ? (
        <h1>Ocorreu um erro ao buscar os dados do usuário.</h1>
      ) : (
        <div className="flex flex-row justify-center gap-3">
          <Link className="bg-green-500 p-2 rounded mb-3" href="../catalog">
            Acessar Catálogo
          </Link>
          <Link
            className="bg-green-500 p-2 rounded mb-3"
            href="/dashboard/hentaicreate"
          >
            Cadastrar Hentai
          </Link>
        </div>
      )}
    </section>
  );
}
