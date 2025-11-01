"use client";

import styles from "./profile.module.css";

import React, { useEffect, useState, useContext } from "react";
import { useRouter } from "next/navigation";
import api from "@/utils/api";

// Components
import { PriceCard } from "@/components/PriceCard";

// Hooks

// Context
import { Spinner } from "@/components/Spinner";

function SubscriptionPage() {
  const [user, setUser] = useState({});
  const [token, setToken] = useState("");
  const [prices, setPrices] = useState([]);

  const router = useRouter();

  useEffect(() => {
    // Ler token do localStorage apenas no cliente
    const localToken = localStorage.getItem("token") || "";
    setToken(localToken);

    // Buscar dados do usuário apenas se houver token
    if (localToken) {
      const fetchData = async () => {
        try {
          const { data } = await api.get("/users/checkuser", {
            headers: {
              Authorization: `Bearer ${JSON.parse(localToken)}`,
            },
          });
          setUser(data);
        } catch (err) {
          console.error(err);
        }
      };
      fetchData();
    }
  }, []);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const { data } = await api.get("/stripe/prices");
        setPrices(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPrices();
  }, []);

  if (!prices || prices.length === 0) {
    return (
      <section className="min-h-screen flex flex-col justify-center items-center mt-4 mb-16">
        <h1>
          <Spinner />
        </h1>
      </section>
    );
  }

  async function handleClick(evt, price) {
    evt.preventDefault();
    if (!token) {
      alert("Erro ao tentar realizar a assinatura!");
      return;
    }

    try {
      const { data } = await api.post(
        "/stripe/create-subscription",
        { priceId: price.id },
        { headers: { Authorization: `Bearer ${JSON.parse(token)}` } }
      );
      window.open(data, "_self");
    } catch (error) {
      console.error("Erro na solicitação ao Stripe:", error);
    }
  }

  return (
    <div className="min-h-screen container-fluid flex flex-col items-center mt-4 lg:mt-16">
      <h1 className="p-5 fw-bold text-2xl">
        Escolha o Planos perfeito para você
      </h1>
      <h2 className="lead pb-4 text-xl">Assine um dos planos abaixo:</h2>
      <h3 className="p-5">
        ※ Não se preocupe, a descrição na Fatura não irá mencionar o conteúdo do
        site. Seremos discretos! ※
      </h3>
      <div className="offset-md-3 col-md-6 flex flex-col items-center justify-center mt-8 mb-16">
        <div className="flex flex-col md:flex-row gap-8">
          {prices &&
            prices.map((price) => (
              <PriceCard
                key={price.id}
                price={price}
                handleSubscription={handleClick}
              />
            ))}
        </div>
      </div>
    </div>
  );
}

export default SubscriptionPage;
