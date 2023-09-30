"use client";

import api from "@/utils/api";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

import { ChapterForm } from "@/components/ChapterForm";
import useFlashMessage from "@/hooks/useFlashMessage";

function CreateChapter() {
	const [hentai, setHentai] = useState({});
	const [token] = useState(localStorage.getItem("token") || "");
	const { id } = useParams();
	const { setFlashMessage } = useFlashMessage();

	useEffect(() => {
		api.get(`/hentais/${id}`, {
			headers: {
				Authorization: `Bearer ${JSON.parse(token)}`,
			},
		}).then((response) => {
			setHentai(response.data.hentai);
		});
	}, [token, id]);

	async function createCh(hentai) {
		let msgType = "success";

		const formData = new FormData();

		await Object.keys(hentai).forEach((key) => {
			if (key === "images") {
				for (let i = 0; i < hentai[key].length; i++) {
					formData.append("images", hentai[key][i]);
				}
			} else {
				formData.append(key, hentai[key]);
			}
		});

		const data = await api
			.patch(`/hentais/chcreate/${hentai._id}`, formData, {
				headers: {
					Authorization: `Bearer ${JSON.parse(token)}`,
					"Content-Type": "multipart/form-data",
				},
			})
			.then((response) => {
				return response.data;
			})
			.catch((err) => {
				msgType = "error";
				return err.response.data;
			});

		setFlashMessage(data.message, msgType);
	}

	return (
		<section className="min-h-screen flex flex-col items-center mt-8 mb-8">
			<div>
				<h1>Adicionando Capítulo ao Hentai: {hentai.title}</h1>
			</div>
			{hentai.title && (
				<ChapterForm handleSubmit={createCh} hentaiData={hentai} />
			)}
		</section>
	);
}

export default CreateChapter;
