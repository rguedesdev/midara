"use client";

import { useContext, useState, useEffect } from "react";
import api from "@/utils/api";

// Context
import { Context } from "@/context/UserContext";

const PriceCard = ({ price, handleSubscription }) => {
  const [user, setUser] = useState({});
  const [token, setToken] = useState("");

  useEffect(() => {
    const localToken = localStorage.getItem("token") || "";
    setToken(localToken);

    if (!localToken) return;

    const fetchUser = async () => {
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

    fetchUser();
  }, []);

  const dynamicDescription = () => {
    if (price.nickname === "BASIC") {
      return "Somente informações";
    } else if (price.nickname === "STANDARD") {
      return "30 dias de Acesso";
    } else if (price.nickname === "PREMIUM") {
      return "1 ano de Acesso";
    }
  };
  const dynamicDescription2 = () => {
    if (price.nickname === "BASIC") {
      return "Gratuito";
    } else if (price.nickname === "STANDARD") {
      return "sem desconto";
    } else if (price.nickname === "PREMIUM") {
      return "15% de Desconto";
    }
  };

  const dynamicDescription3 = () => {
    if (price.nickname === "BASIC") {
      return "Sem acesso aos caps.";
    } else if (price.nickname === "STANDARD") {
      return "Acesso total";
    } else if (price.nickname === "PREMIUM") {
      return "Acesso total";
    }
  };

  function cardStyle() {
    return price.nickname === "STANDARD"
      ? "drop-shadow-md bg-pink-700 border-4 border-blue-700"
      : "card drop-shadow-md bg-blue-500 text-white rounded-lg py-4 px-2";
  }

  function buttonStyle() {
    return price.nickname === "STANDARD"
      ? "bg-blue-800 transition-all ease-out duration-200 hover:bg-blue-500"
      : "bg-pink-700 hover:bg-pink-600";
  }

  return (
    <div className="flex flex-col columns-1 pt-5 text-black">
      <div
        className={`card drop-shadow-md bg-blue-500 text-white rounded-lg py-4 px-2 ${cardStyle()}`}
      >
        <div className="card-header">
          <h4 className="font-bold text-center text-lg">{price.nickname}</h4>
        </div>
        <div className="card-body">
          <h1 className="card-title pricing-card-name font-bold text-3xl flex justify-center">
            {(price.unit_amount / 100).toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
            /mês
          </h1>
          <ul className="list-none mt-3 mb-4">
            <li className="">
              ✓ <span className="ml-2">{dynamicDescription(price)}</span>
            </li>
            <li className="">
              ✓ <span className="ml-2">{dynamicDescription2(price)}</span>
            </li>
            <li className="">
              ✗ <span className="ml-2">{dynamicDescription3(price)}</span>
            </li>
            <li>Análises completas</li>
            <li>Suporte por email</li>
            <li>Central de ajuda</li>
          </ul>

          {/* <pre>{JSON.stringify(price, null, 4)}</pre> */}

          <button
            onClick={(evt) => handleSubscription(evt, price)}
            className={`text-white duration-200 px-20 py-4 rounded-md ${buttonStyle()}`}
          >
            Assinar
          </button>
        </div>
      </div>
    </div>
  );
};

export { PriceCard };
