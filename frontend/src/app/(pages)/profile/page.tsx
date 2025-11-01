"use client";

import Image from "next/image";
import styles from "./profile.module.css";

import React, { useContext, useState, useEffect } from "react";
import api from "@/utils/api";
import moment from "moment";
import { useRouter } from "next/navigation";

// Components
import { Input } from "../../../components/Input";
import { Message } from "@/components/Message";
import { Spinner } from "@/components/Spinner";

// Hooks
import useFlashMessage from "../../../hooks/useFlashMessage";

// Context
import { Context } from "@/context/UserContext";

function Profile() {
  const [user, setUser] = useState({});
  const [token, setToken] = useState("");
  const { setFlashMessage } = useFlashMessage();
  const [preview, setPreview] = useState();
  const { loading }: any = useContext(Context);

  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const localToken = localStorage.getItem("token") || "";
    setToken(localToken);

    if (!localToken) {
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const { data } = await api.get("/users/checkuser", {
          headers: {
            Authorization: `Bearer ${localToken}`,
          },
        });
        setUser(data);
      } catch (err) {
        console.error(err);
        setFlashMessage("Erro ao buscar dados do usuário", "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleUpdateProfile = async (evt) => {
    evt.preventDefault();

    // Set isLoading to true when submitting the form
    setIsLoading(true);

    let msgType = "success";

    const formData = new FormData();

    // Add user data to the FormData
    Object.keys(user).forEach((key) => formData.append(key, user[key]));

    if (preview) {
      formData.append("profileImage", preview);
    }

    try {
      const response = await api.patch(`/users/edit/${user._id}`, formData, {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setFlashMessage(response.data.message, msgType);
    } catch (error) {
      console.error("Error updating profile:", error);
      msgType = "error";
      setFlashMessage(error.response.data, msgType);
    }

    // Set isLoading back to false after the request is complete
    setIsLoading(false);
  };

  function onFileChange(evt) {
    setPreview(evt.target.files[0]);
    setUser({ ...user, [evt.target.name]: evt.target.files[0] });
  }

  function handleChange(evt) {
    setUser({ ...user, [evt.target.name]: evt.target.value });
  }

  function traduzirStatus(statusEmIngles) {
    const traducoes: any = {
      active: "Ativo",
      canceled: "Cancelado",
    };

    return traducoes[statusEmIngles] || statusEmInglês;
  }

  async function manageSubscription(evt) {
    evt.preventDefault();

    if (token) {
      try {
        const { data } = await api.get("/stripe/customer-portal", {
          headers: {
            Authorization: `Bearer ${JSON.parse(token)}`,
          },
        });
        window.open(data, "_self");
      } catch (error) {
        console.error("Error requesting Stripe:", error);
      }
    } else {
      alert("Error trying to manage subscription!");
    }
  }

  return (
    <section className="min-h-screen flex flex-col items-center justify-center gap-4 mt-8 mb-16">
      {isLoading ? ( // Show a Spinner when isLoading is true
        <Spinner />
      ) : (
        <div className="flex flex-col gap-8">
          <h1 className="bg-pink-800 text-center text-2xl py-2 shadow-xl rounded">
            Meu Perfil
          </h1>
          <div className="w-full flex flex-row gap-8">
            <form
              className="flex flex-col justify-center items-center gap-4"
              onSubmit={handleUpdateProfile}
            >
              <Message />

              <label className={styles.labelArq}>
                {user.image || preview ? (
                  <div className={styles.previewContainer}>
                    <Image
                      className="rounded-md w-44 h-44"
                      src={
                        preview
                          ? URL.createObjectURL(preview)
                          : `${process.env.NEXT_PUBLIC_API}/images/users/${user.image}`
                      }
                      alt={user.name}
                      width={0}
                      height={0}
                      priority
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="flex justify-center items-center">
                    <span>Enviar Arquivo</span>
                    <input
                      className={styles.file}
                      type="file"
                      name="profileImage"
                      onChange={onFileChange}
                    />
                  </div>
                )}
              </label>

              <div>
                <Input
                  text="E-mail"
                  type="email"
                  name="email"
                  placeholder="Digite o e-mail"
                  onChange={handleChange}
                  value={user.email || ""}
                />
                <Input
                  text="Nome"
                  type="text"
                  name="name"
                  placeholder="Digite o nome"
                  onChange={handleChange}
                  value={user.name || ""}
                />
              </div>

              <div>
                <Input
                  text="Senha"
                  type="password"
                  name="password"
                  placeholder="Digite a sua senha"
                  onChange={handleChange}
                />
                <Input
                  text="Confirmação de senha"
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirme a sua senha"
                  onChange={handleChange}
                />
              </div>
              <article>
                <button
                  className="!bg-blue-800 hover:!bg-blue-700 transition-all ease-in duration-200 w-[300px] rounded mt-6 p-3 drop-shadow-sm"
                  type="submit"
                >
                  {loading ? "Processando..." : "Atualizar"}
                </button>
              </article>
              {/* <pre>{JSON.stringify(subscription, null, 4)}</pre> */}
            </form>
            <div className="flex flex-row justify-center gap-10">
              {user.subscriptionInfo &&
                user.subscriptionInfo.map((sub) => (
                  <div key={sub.id}>
                    <section>
                      <h4 className="font-bold">Plano: {sub.plan.nickname}</h4>
                      <h5>
                        Mensalidade:{" "}
                        {(sub.plan.amount / 100).toLocaleString("pt-BR", {
                          style: "currency",
                          currency: sub.plan.currency,
                        })}
                      </h5>
                      <p>Status: {traduzirStatus(sub.status)}</p>
                      <p>
                        Cartão terminado em: ••••{" "}
                        {sub.default_payment_method.card.last4}
                      </p>
                      <p className="mb-4">
                        Seu plano expira em:{" "}
                        {moment(sub.current_period_end * 1000)
                          .format("DD/MM/YYYY")
                          .toString()}
                      </p>
                      <button
                        onClick={manageSubscription}
                        className="bg-green-700 hover:bg-green-500 duration-200 rounded w-full px-5 py-2"
                      >
                        Gerenciar Assinatura
                      </button>
                    </section>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Profile;
