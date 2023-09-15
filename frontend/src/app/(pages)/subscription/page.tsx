"use client";

import styles from "./profile.module.css";

import React, { useEffect, useState, useContext } from "react";
import { useRouter } from "next/navigation";
import api from "@/utils/api";

// Components
import { PriceCard } from "@/components/PriceCard";

// Hooks

// Context

function SubscriptionPage() {
	const [user, setUser] = useState({});
	const [token, setToken] = useState(localStorage.getItem("token") || "");
	const [prices, setPrices] = useState([]);

	const router = useRouter();

	useEffect(() => {
		const fetchData = async () => {
			const { data } = await api.get("/users/checkuser", {
				headers: {
					Authorization: `Bearer ${JSON.parse(token)}`,
				},
			});
			// console.log(token);
			// console.log(data);
			setUser(data);
		};
		fetchData();
	}, [token]);

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
		<div className="h-screen container-fluid">
			<div className="offset-md-3 text-center flex flex-col col-md-6 items-center justify-center">
				<h1 className="pt-5 fw-bold">Planos perfeitos para você</h1>
				<p className="lead pb-4">Escolha uma das opções abaixo:</p>

				<div className="flex flex-row gap-8">
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
