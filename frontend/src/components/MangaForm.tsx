import React, { useState } from "react";
import Image from "next/image";

import sytles from "./Form.module.css";

import { Input } from "./Input";

function MangaForm({ handleSubmit, hentaiData }) {
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
                <Image
                  className="rounded"
                  src={URL.createObjectURL(image)}
                  alt={hentai.name}
                  key={`${hentai.name} + ${index}`}
                  width={0}
                  height={0}
                  priority
                  unoptimized
                />
              ))
            : hentai.images &&
              hentai.images.map((image, index) => (
                <Image
                  src={`http://localhost:5000/images/hentais/${image}`}
                  alt={hentai.name}
                  key={`${hentai.name} + ${index}`}
                  width={0}
                  height={0}
                  priority
                  unoptimized
                />
              ))}
        </div>
        <Input
          text="Capa do Hentai"
          type="file"
          name="images"
          handleOnChange={onFileChange}
          multiple={true}
        />

        <Input
          text="Título do Mangá"
          type="text"
          name="title"
          placeholder="Digite o título..."
          handleOnChange={handleChange}
          value={hentai.title || ""}
        />

        <Input
          text="Sinopse do Mangá"
          type="text"
          name="description"
          placeholder="Digite a sinopse..."
          handleOnChange={handleChange}
          value={hentai.description || ""}
        />

        <Input
          text="Nome do Mangaká"
          type="text"
          name="mangaka"
          placeholder="Digite o nome do mangaka..."
          handleOnChange={handleChange}
          value={hentai.mangaka || ""}
        />

        <Input
          text="Tags"
          type="text"
          name="tags"
          placeholder="Digite as tags..."
          handleOnChange={handleChange}
          value={hentai.tags || ""}
        />

        <Input
          text="Status"
          type="text"
          name="status"
          placeholder="Informe o Status do projeto..."
          handleOnChange={handleChange}
          value={hentai.status || ""}
        />

        <Input
          text="Formato"
          type="text"
          name="format"
          placeholder="Informe o formato da obra..."
          handleOnChange={handleChange}
          value={hentai.format || ""}
        />

        <button
          className="bg-blue-800 hover:bg-blue-500 duration-200 w-full rounded mt-6 p-3 drop-shadow-sm"
          type="submit"
        >
          Atualizar Hentai
        </button>
      </form>
    </section>
  );
}

export { MangaForm };
