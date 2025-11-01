"use client";

import styles from "./profile.module.css";

import React, { useEffect, useState, useContext } from "react";
import { useRouter } from "next/navigation";
import api from "@/utils/api";
import { SyncOutlined } from "@ant-design/icons";

// Components
import { PriceCard } from "@/components/PriceCard";

// Hooks

// Context
import UserContex from "@/context/UserContext";

function SuccessPage() {
  const [user, setUser] = useState({});
  const [token, setToken] = useState("");
  const [prices, setPrices] = useState([]);

  const router = useRouter();

  useEffect(() => {
    // Lê token apenas no cliente
    const localToken = localStorage.getItem("token") || "";
    setToken(localToken);

    if (!localToken) return;

    const fetchData = async () => {
      try {
        const { data } = await api.get("/users/checkuser", {
          headers: { Authorization: `Bearer ${JSON.parse(localToken)}` },
        });
        setUser(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();

    const getSubscriptionStatus = async () => {
      try {
        const { data } = await api.get("/stripe/subscription-status", {
          headers: { Authorization: `Bearer ${JSON.parse(localToken)}` },
        });
        if (!data || data.length === 0) {
          router.push("/subscription");
        } else {
          router.push("/profile");
        }
      } catch (err) {
        console.error(err);
      }
    };
    getSubscriptionStatus();
  }, []); // roda apenas no cliente

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
    <div className="h-screen container-fluid flex items-center justify-center">
      <div className="offset-md-3 text-center flex flex-col col-md-6 items-center justify-center">
        <SyncOutlined spin style={{ fontSize: "50px" }} />
      </div>
    </div>
  );
}

export default SuccessPage;
