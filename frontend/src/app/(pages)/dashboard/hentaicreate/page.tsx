"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/utils/api";

// Components
import { MangaForm } from "@/components/MangaForm";
import { Message } from "@/components/Message";

// Hooks
import useFlashMessage from "@/hooks/useFlashMessage";

function HentaiCreate() {
	const [token] = useState(localStorage.getItem("token") || "");
	const { setFlashMessage } = useFlashMessage();
	const router = useRouter();

	async function registerManga(hentai) {
		let msgType = "success";

		const formData = new FormData();

		const mangaFormData = await Object.keys(hentai).forEach((key) => {
			if (key === "images") {
				for (let i = 0; i < hentai[key].length; i++) {
					formData.append("images", hentai[key][i]);
				}
			} else if (key === "tags") {
				const tagsArray = hentai[key].split("; ");
				tagsArray.forEach((tag) => {
					formData.append(key, tag.trim());
				});
			} else {
				formData.append(key, hentai[key]);
			}
		});

		formData.append("hentai", mangaFormData);

		const data = await api
			.post(`/hentais/create`, formData, {
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

		if (msgType !== "error") {
			router.push("/catalog");
		}
	}

	return (
		<section className="min-h-screen flex flex-col items-center mt-8 mb-8">
			<div className="text-center">
				<h1>My Dashboard</h1>
				<p>Após cadastrar, o Hentai ficará disponível para leitura!</p>
			</div>
			<div>
				<Message />
				<p>Formulário</p>
				<MangaForm handleSubmit={registerManga} />
			</div>
		</section>
	);
}

export default HentaiCreate;
