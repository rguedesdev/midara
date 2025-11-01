"use client";

import { useContext, useState } from "react";

// Components
import { Input } from "@/components/Input";
import { Message } from "@/components/Message";

// Context
import { Context } from "@/context/UserContext";
import Link from "next/link";

function Login() {
	const [output, setOutput] = useState("");
	const [user, setUser] = useState({});
	const { login, loading } = useContext(Context);

	function handleChange(evt: any) {
		setUser({ ...user, [evt.target.name]: evt.target.value });
	}

	function handleSubmit(evt: any) {
		evt.preventDefault();

		// Fazer login do usuário
		login(user);

		// // Mostrar console log no site em desenvolvimento
		// setOutput(JSON.stringify(user, null, 2));
	}

	return (
		<main className="h-screen flex flex-col justify-center items-center">
			<h1 className="text-2xl">Login Midara</h1>
			<form className="w-1/4" onSubmit={handleSubmit}>
				<Message />
				<Input
					text="Email"
					type="email"
					name="email"
					placeholder="Digite seu email"
					handleOnChange={handleChange}
				/>
				<Input
					text="Senha"
					type="password"
					name="password"
					placeholder="Digite sua senha"
					handleOnChange={handleChange}
				/>
				<button
					className="btn bg-blue-800 hover:bg-blue-600 text-white rounded border-none w-full mt-4"
					type="submit">
					{loading ? (
						<>
							<span className="loading loading-spinner"></span>
							Loading...
						</>
					) : (
						<>Entrar</>
					)}
				</button>

				{/* 
				<button
					className="bg-blue-800 hover:bg-blue-500 duration-200 w-full rounded mt-6 p-3 drop-shadow-sm"
					type="submit">
					{loading ? "Processando..." : "Entrar"}
				</button> */}
			</form>

			<span className="mt-2">
				Ainda não tem uma conta?{" "}
				<Link
					className="text-blue-300 hover:text-blue-400 transition-all ease-in duration-200 font-bold"
					href="/register">
					Cadastre-se
				</Link>
			</span>

			{/* <pre className="flex justify-center mt-8">{output}</pre> */}
		</main>
	);
}

export default Login;
