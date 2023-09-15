"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { RiPenNibFill, RiBook2Fill } from "react-icons/ri";

import api from "@/utils/api";

import Image from "next/image";
import Banner from "../../public/images/banner-midara.jpg";

function Home() {
	const [hentais, setHentais] = useState([]);

	useEffect(() => {
		api.get("/hentais").then((response) => {
			setHentais(response.data.hentais);
		});
	}, []);

	return (
		<section className="min-h-screen flex flex-col items-center mt-8 mb-16">
			<div className="mb-8">
				{/* <Image
					className="rounded-xl"
					src={Banner}
					alt="Midara Banner"
					width={1280}
					unoptimized
					priority
				/> */}
			</div>
			<article className="grid grid-cols-10">
				<div className="col-start-2 col-span-8 py-4 rounded-lg bg-pink-700">
					<h1 className="text-center text-2xl">Lançamentos</h1>
				</div>
				<div className="col-start-2 col-span-8 flex flex-row justify-center mt-6 mb-6 gap-8 overflow-visible">
					<div className="breakLine flex flex-row justify-center gap-4 static">
						{hentais.length > 0 &&
							hentais.map((hentai) => (
								<div className="flex flex-col">
									<div className="mb-2">
										<span className="bg-blue-500 text-center p-2 absolute rounded-br-lg">
											MH。
										</span>
										<img
											className="w-64 h-96 rounded-lg mb-2"
											src={`http://localhost:5000/images/hentais/${hentai.images[0]}`}
											alt={hentai.title}
										/>
										<h3 className="mb-2 flex flex-row items-center gap-4">
											<RiBook2Fill size={20} />
											<p className="titleOverflow">
												{hentai.title}
											</p>
										</h3>
										<h2 className="flex flex-row items-center gap-4 text-ellipsis overflow-hidden">
											<RiPenNibFill size={20} />
											{hentai.mangaka}
										</h2>
									</div>
									<Link
										className="bg-blue-500 hover:bg-blue-300 transition duration-200 text-white p-2 rounded px-14 w-64"
										href={
											hentai.format == "Manga"
												? `/mangas/${hentai._id}`
												: `/doujinshis/${hentai._id}`
										}>
										Página do Hentai
									</Link>
								</div>
							))}
						{hentais.length === 0 && (
							<p>Não há Mangás em catálogo</p>
						)}
					</div>
				</div>
			</article>
		</section>
	);
}

export default Home;
