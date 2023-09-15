import React, { useState } from "react";

import sytles from "./Form.module.css";

import { Input } from "./Input";

function ChapterForm({ handleSubmit, hentaiData }) {
	const [hentai, setHentai] = useState(hentaiData || {});
	const [preview, setPreview] = useState([]);

	function onFileChange(evt) {
		setPreview(Array.from(evt.target.files));
		setHentai({ ...hentai, images: [...evt.target.files] });
	}

	function handleChange(evt) {
		setHentai({ ...hentai, [evt.target.name]: evt.target.value });
	}

	function submit(evt) {
		evt.preventDefault();
		handleSubmit(hentai);
	}

	return (
		<section>
			<form onSubmit={submit}>
				<div className="flex justify-center w-40 gap-2">
					{preview.length > 0
						? preview.map((image, index) => (
								<img
									className="rounded"
									src={URL.createObjectURL(image)}
									alt={hentai.name}
									key={`${hentai.name} + ${index}`}
								/>
						  ))
						: hentai.images &&
						  hentai.images.map((image, index) => (
								<img
									src={`http://localhost:5000/images/hentais/${image}`}
									alt={hentai.name}
									key={`${hentai.name} + ${index}`}
								/>
						  ))}
				</div>
				<Input
					text="Páginas do Capítulo"
					type="file"
					name="images"
					handleOnChange={onFileChange}
					multiple={true}
				/>

				<Input
					text="Título do Capítulo"
					type="text"
					name="titleChapter"
					placeholder="Digite o título..."
					handleOnChange={handleChange}
					value={hentai.titleChapter || ""}
				/>

				<Input
					text="Subtítulo do Capítulo"
					type="text"
					name="subtitleChapter"
					placeholder="Digite a sinopse..."
					handleOnChange={handleChange}
					value={hentai.subtitleChapter || ""}
				/>

				<button
					className="bg-blue-800 hover:bg-blue-500 duration-200 w-full rounded mt-6 p-3 drop-shadow-sm"
					type="submit">
					Cadastrar Capítulo
				</button>
			</form>
		</section>
	);
}

export { ChapterForm };
