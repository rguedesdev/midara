"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { RiPenNibFill, RiBook2Fill } from "react-icons/ri";
import { FaHashtag } from "react-icons/fa";

import api from "@/utils/api";

import Image from "next/image";
import Banner from "../../public/banner-midara.jpg";

// Components
import { Spinner } from "@/components/Spinner";

function HomePage() {
	const [hentais, setHentais] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			await api.get("/hentais").then((response) => {
				setHentais(response.data.hentais);
			});
		};
		fetchData();
	}, []);

	return (
		<section className="min-h-screen flex flex-col items-center mt-8 mb-16">
			<div className="mb-8">
				<Image
					className="rounded-xl shadow-xl"
					src={Banner}
					alt="Midara Banner"
					width={1280}
					unoptimized
					priority
				/>
			</div>

			<article className="grid grid-cols-10">
				<div className="col-start-2 col-span-8 py-4 rounded-lg bg-pink-700 shadow-lg">
					<h1 className="text-white text-center text-2xl px-4">
						Lançamentos
					</h1>
				</div>
				<div className="col-start-2 col-span-8 flex flex-row justify-center mt-6 mb-6 gap-8 overflow-visible">
					<div className="breakLine flex flex-row justify-center gap-4 static">
						{hentais.length > 0 &&
							hentais.map((hentai) => {
								const lastChapter =
									hentai.chapters[hentai.chapters.length - 1];

								return (
									<div
										className="flex flex-col"
										key={hentai._id}>
										<div className="flag bg-blue-800 hover:bg-blue-600 opacity-85 transition-all ease-in duration-200 text-white text-center font-bold p-2 absolute rounded-lg z-40 flex items-center">
											MH
										</div>

										<div className="mb-2">
											<img
												className="w-64 h-96 rounded-lg mb-2 -z-50 shadow-lg"
												src={`${
													process.env.NEXT_PUBLIC_API
												}/images/hentais/${
													hentai.chapters.length > 1
														? lastChapter
																.imagesChapter[0]
														: hentai.images[0]
												}`}
											/>
											<h1 className="mb-1 flex flex-row items-center gap-4">
												<RiBook2Fill size={20} />
												<p className="titleOverflow">
													{hentai.title}
												</p>
											</h1>
											<h2 className="mb-1 flex flex-row items-center gap-4 text-ellipsis overflow-hidden">
												<FaHashtag size={20} />
												{hentai.chapters.length > 0
													? lastChapter.titleChapter
													: "Título indisponível"}
											</h2>
											<h2 className="flex flex-row items-center gap-4 text-ellipsis overflow-hidden">
												<RiPenNibFill size={20} />
												{hentai.mangaka}
											</h2>
										</div>

										<Link
											className="bg-blue-800 hover:bg-blue-600 transition-all ease-in duration-200 text-white p-2 rounded px-14 w-64 shadow-lg"
											href={
												hentai.format === "Manga"
													? `/mangas/${hentai._id}`
													: `/doujinshis/${hentai._id}`
											}>
											Página do Hentai
										</Link>
									</div>
								);
							})}
						{hentais.length === 0 && <Spinner />}
					</div>
				</div>
			</article>
		</section>
	);
}

export default HomePage;
