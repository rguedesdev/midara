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
		const getSubscriptionStatus = async () => {
			const { data } = await api.get("/stripe/subscription-status", {
				headers: {
					Authorization: `Bearer ${JSON.parse(token)}`,
				},
			});
			// console.log("SUBSCRIPTION STATUS", data);

			if (data && data.length === 0) {
				router.push("/subscription");
			} else {
				router.push("profile");
			}
		};
		getSubscriptionStatus();
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
				<SyncOutlined spin style={{ fontSize: "50px" }} />
			</div>
		</div>
	);
}

export default SuccessPage;
