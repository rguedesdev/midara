"use client";

import { useContext, useState, useEffect } from "react";
import api from "@/utils/api";

// Context
import { Context } from "@/context/UserContext";

const PriceCard = ({ price, handleSubscription }) => {
	const [user, setUser] = useState({});
	const [token] = useState(localStorage.getItem("token") || "");

	useEffect(() => {
		api.get("/users/checkuser", {
			headers: {
				Authorization: `Bearer ${JSON.parse(token)}`,
			},
		}).then((response) => {
			setUser(response.data);
		});
	}, [token]);

	const dynamicDescription = () => {
		if (price.nickname === "BASIC") {
			return "Crédito de R$ 1,00";
		} else if (price.nickname === "STANDARD") {
			return "Crédito de R$ 2,00";
		} else if (price.nickname === "PREMIUM") {
			return "Crédito de R$ 10,00";
		}
	};

	function buttonStyle() {
		return price.nickname === "BASIC"
			? "text-black hover:bg-red-400 border-2 border-red-500"
			: "bg-red-500 hover:bg-red-400";
	}

	return (
		<div className="flex flex-row columns-1 pt-5 mb-3 text-center text-black">
			<div className="card drop-shadow-md bg-gray-300 rounded-lg py-4 px-2">
				<div className="card-header">
					<h4 className="font-bold text-lg mb-2">{price.nickname}</h4>
				</div>
				<div className="card-body">
					<h1 className="card-title pricing-card-name font-bold text-3xl">
						{(price.unit_amount / 100).toLocaleString("pt-BR", {
							style: "currency",
							currency: "BRL",
						})}
						<small>/mês</small>
					</h1>
					<ul className="list-none mt-3 mb-4">
						<li className="font-bold">
							{dynamicDescription(price)}
						</li>
						<li>Análises completas</li>
						<li>Suporte por email</li>
						<li>Central de ajuda</li>
					</ul>

					<pre>{JSON.stringify(price, null, 4)}</pre>

					<button
						onClick={(evt) => handleSubscription(evt, price)}
						className={`text-white duration-200 px-20 py-4 rounded-md ${buttonStyle()}`}>
						Assinar
					</button>
				</div>
			</div>
		</div>
	);
};

export { PriceCard };
