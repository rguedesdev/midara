import api from "@/utils/api";
import { useState, useEffect } from "react";
import useFlashMessage from "./useFlashMessage";

import { useRouter } from "next/navigation";

export default function useAuth() {
	const { setFlashMessage } = useFlashMessage();
	const [authenticated, setAuthenticated] = useState(false);
	const [loading, setLoading] = useState(false);

	const router = useRouter();

	useEffect(() => {
		const token = localStorage.getItem("token");

		if (token) {
			api.defaults.headers.Authorization = `Bearer ${JSON.parse(token)}`;
			setAuthenticated(true);
		}
	}, []);

	async function register(user: object) {
		let msgText = "Cadastro realizado com sucesso!";
		let msgType = "success";

		setLoading(true);

		try {
			const data: object = await api
				.post("/users/register", user)
				.then((response) => {
					return response.data;
				});

			await authUser(data);
			await router.push("/subscription");
		} catch (error: any) {
			// Tratar o erro
			msgText = error.response.data.message;
			msgType = "error";
		}

		setFlashMessage(msgText, msgType);
		setLoading(false);
	}

	async function login(user: object) {
		let msgText = "Login realizado com sucesso!";
		let msgType = "success";

		setLoading(true);

		try {
			const data = await api
				.post("/users/login", user)
				.then((response) => {
					return response.data;
				});

			await authUser(data);
			await router.push("/profile");
		} catch (error: any) {
			msgText = error.response.data.message;
			msgType = "error";
		}
		setFlashMessage(msgText, msgType);
		setLoading(false);
	}

	function logout() {
		const msgText = "Logout realizado com sucesso";
		const msgType = "success";

		setAuthenticated(false);
		localStorage.removeItem("token");

		api.defaults.headers.Authorization = null;

		setFlashMessage(msgText, msgType);

		router.push("/login");
	}

	async function authUser(data: any) {
		setAuthenticated(true);
		localStorage.setItem("token", JSON.stringify(data.token));
		// await router.push("/subscription");
	}

	return { authenticated, loading, register, login, logout };
}
