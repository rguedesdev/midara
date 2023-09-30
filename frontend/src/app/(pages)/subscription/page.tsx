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
		<div className="h-screen container-fluid flex flex-col items-center mt-16">
			<h1 className="pt-5 fw-bold text-2xl">
				Escolha o Planos perfeito para você
			</h1>
			<h2 className="lead pb-4 text-xl">Assine um dos planos abaixo:</h2>
			<h3>
				※ Não se preocupe, a descrição na Fatura não irá mencionar o
				conteúdo do site. Seremos discretos! ※
			</h3>
			<div className="offset-md-3 col-md-6 flex flex-col items-center justify-center mt-8">
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
