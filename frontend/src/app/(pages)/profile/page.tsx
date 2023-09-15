"use client";

import styles from "./profile.module.css";

import React, { useContext, useState, useEffect } from "react";
import api from "@/utils/api";
import moment from "moment";

// Components
import { Input } from "../../../components/Input";
import { Message } from "@/components/Message";
import { RoundedImage } from "@/components/RoundedImage";

// Hooks
import useFlashMessage from "../../../hooks/useFlashMessage";

// Context
import { Context } from "@/context/UserContext";

function Profile() {
	const [user, setUser] = useState({});
	const [token] = useState(localStorage.getItem("token") || "");
	const { setFlashMessage } = useFlashMessage();
	const [preview, setPreview] = useState();
	const { loading }: any = useContext(Context);

	const [subscription, setSubscription] = useState([]);

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
		const getSubscriptionInfo = async () => {
			const { data } = await api.get("/stripe/subscription-info", {
				headers: {
					Authorization: `Bearer ${JSON.parse(token)}`,
				},
			});
			// console.log("SUBSCRIPTION STATUS", data);
			setSubscription(data.data);
		};
		getSubscriptionInfo();
	}, []);

	function onFileChange(evt) {
		setPreview(evt.target.files[0]);
		setUser({ ...user, [evt.target.name]: evt.target.files[0] });
	}

	function handleChange(evt) {
		setUser({ ...user, [evt.target.name]: evt.target.value });
	}

	async function handleSubmit(evt) {
		evt.preventDefault();

		let msgType = "success";

		const formData = new FormData();

		const userFormData = await Object.keys(user).forEach((key) =>
			formData.append(key, user[key])
		);

		formData.append("user", userFormData);

		const data = await api
			.patch(`/users/edit/${user._id}`, formData, {
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
	}

	function traduzirStatus(statusEmIngles) {
		const traducoes: any = {
			active: "Ativo",
		};

		return traducoes[statusEmIngles] || statusEmIngles;
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
				// Lide com erros de requisição aqui, se necessário
				console.error("Erro na solicitação ao Stripe:", error);
			}
		} else {
			// É possível redirecionar o usuário
			alert("Erro ao tentar realizar a assinatura!");
		}
	}

	return (
		<section className="min-h-screen flex flex-col gap-4 justify-center mt-8 mb-16">
			<div>
				{(user.image || preview) && (
					<img
						className="rounded-md w-40 h-40"
						src={
							preview
								? URL.createObjectURL(preview)
								: `http://localhost:5000/images/users/${user.image}`
						}
						alt={user.name}
					/>
				)}
			</div>

			<form
				className="flex flex-row justify-center gap-4"
				onSubmit={handleSubmit}>
				<Message />
				<Input
					text="Imagem"
					type="file"
					name="image"
					handleOnChange={onFileChange}
				/>
				<div>
					<Input
						text="E-mail"
						type="email"
						name="email"
						placeholder="Digite o e-mail"
						handleOnChange={handleChange}
						value={user.email || ""}
					/>
					<Input
						text="Nome"
						type="text"
						name="name"
						placeholder="Digite o nome"
						handleOnChange={handleChange}
						value={user.name || ""}
					/>
				</div>

				<div>
					<Input
						text="Senha"
						type="password"
						name="password"
						placeholder="Digite a sua senha"
						handleOnChange={handleChange}
					/>
					<Input
						text="Confirmação de senha"
						type="password"
						name="confirmPassword"
						placeholder="Confirme a sua senha"
						handleOnChange={handleChange}
					/>
				</div>
				<article>
					<button
						className=" bg-blue-800 hover:bg-blue-500 duration-200 w-full rounded mt-6 p-3 drop-shadow-sm"
						type="submit">
						{loading ? "Processando..." : "Atualizar"}
					</button>
				</article>
				{/* <pre>{JSON.stringify(subscription, null, 4)}</pre> */}
			</form>
			<div className="flex flex-row justify-center gap-4">
				{subscription &&
					subscription.map((sub) => (
						<div key={sub.id}>
							<section>
								<hr />
								<h4 className="font-bold">
									{sub.plan.nickname}
								</h4>
								<h5>
									{(sub.plan.amount / 100).toLocaleString(
										"pt-BR",
										{
											style: "currency",
											currency: sub.plan.currency,
										}
									)}
								</h5>
								<p>Status: {traduzirStatus(sub.status)}</p>
								<p>
									4 últimos dígitos do cartão:{" "}
									{sub.default_payment_method.card.last4}
								</p>
								<p className="mb-4">
									Data de expiração do plano:{" "}
									{moment(sub.current_period_end * 1000)
										.format("DD/MM/YYYY HH:mm")
										.toString()}
								</p>
								<button className="bg-green-500 hover:bg-green-300 duration-200 rounded mr-4 px-5 py-2">
									Access
								</button>
								<button
									onClick={manageSubscription}
									className="bg-purple-700 hover:bg-purple-500 duration-200 rounded px-5 py-2">
									Manage Subscription
								</button>
							</section>
						</div>
					))}
			</div>
		</section>
	);
}

export default Profile;
