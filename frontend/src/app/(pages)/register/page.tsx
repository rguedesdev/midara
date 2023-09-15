"use client";

import { useContext, useState } from "react";

// Components
import { Input } from "@/components/Input";
import { Message } from "@/components/Message";

// Context
import { Context } from "@/context/UserContext";

function Register() {
	const [output, setOutput] = useState("");
	const [user, setUser] = useState({});
	const { register, loading } = useContext(Context);

	function handleChange(evt: any) {
		setUser({ ...user, [evt.target.name]: evt.target.value });
	}

	async function handleSubmit(evt: any) {
		evt.preventDefault();
		// Enviar um usuário para o banco de dados
		register(user);

		// Mostrar console log no site em desenvolvimento
		setOutput(JSON.stringify(user, null, 2));
	}

	return (
		<main className="h-screen flex flex-col justify-center items-center">
			<h1 className="text-2xl">Cadastre-se</h1>
			<form className="w-1/4" onSubmit={handleSubmit}>
				<Message />
				<Input
					text="Nome"
					type="text"
					name="name"
					placeholder="Digite seu nome"
					handleOnChange={handleChange}
				/>

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

				<Input
					text="Confirmação de Senha"
					type="password"
					name="confirmPassword"
					placeholder="Confirme a sua senha"
					handleOnChange={handleChange}
				/>

				<button
					className=" bg-blue-800 hover:bg-blue-500 duration-200 w-full rounded mt-6 p-3 drop-shadow-sm"
					type="submit">
					{loading ? "Processando..." : "Cadastrar"}
				</button>
			</form>

			<pre className="flex justify-center mt-8">{output}</pre>
		</main>
	);
}

export default Register;
