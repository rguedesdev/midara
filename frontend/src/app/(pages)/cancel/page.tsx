"use client";
import React, { useEffect, useState, useContext } from "react";
import { useRouter } from "next/navigation";
import api from "@/utils/api";
import { WarningTwoTone } from "@ant-design/icons";

// Hooks

// Context

function CancelPage() {
  const [user, setUser] = useState({});
  const [token, setToken] = useState(""); // inicializa vazio
  const [prices, setPrices] = useState([]);

  useEffect(() => {
    const localToken = localStorage.getItem("token") || "";
    setToken(localToken);

    const fetchData = async () => {
      if (!localToken) return;

      const { data } = await api.get("/users/checkuser", {
        headers: {
          Authorization: `Bearer ${JSON.parse(localToken)}`,
        },
      });
      setUser(data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchPrices = async () => {
      const { data } = await api.get("/stripe/prices");
      // console.log("prices get request", data);
      setPrices(data);
    };
    fetchPrices();
  }, []);

  async function handleClick(evt, price) {
    evt.preventDefault();
    if (token) {
      try {
        const { data } = await api.post(
          "/stripe/create-subscription",
          {
            priceId: price.id,
          },
          {
            headers: {
              Authorization: `Bearer ${JSON.parse(token)}`,
            },
          }
        );
        window.open(data, "_self");
      } catch (error) {
        // Lide com erros de requisição aqui, se necessário
        console.error("Erro na solicitação ao Stripe:", error);
      }
    } else {
      // É possível redirecionar o usuário
      alert("Erro ao tentar realizar a assinatura!");
    }
  }

  return (
    <div className="h-screen container-fluid flex items-center justify-center">
      <div className="offset-md-3 text-center flex flex-col col-md-6 items-center justify-center">
        <WarningTwoTone style={{ fontSize: "50px" }} />
      </div>
    </div>
  );
}

export default CancelPage;
