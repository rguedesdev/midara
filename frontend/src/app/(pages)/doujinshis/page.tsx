"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { RiPenNibFill, RiBook2Fill } from "react-icons/ri";

import api from "@/utils/api";

// Components
import { Spinner } from "@/components/Spinner";

function Doujinshis() {
	const [hentais, setHentais] = useState([]);

	useEffect(() => {
		api.get("/hentais").then((response) => {
			setHentais(response.data.hentais);
		});
	}, []);

	if (!hentais || hentais.length === 0) {
		return (
			<section className="min-h-screen flex flex-col justify-center items-center mt-4 mb-16">
				<h1>
					<Spinner />
				</h1>
			</section>
		);
	}

	return (
		<section className="min-h-screen flex flex-col items-center mt-8 mb-16">
			<article className="grid grid-cols-10">
				<div className="col-start-2 col-span-8 py-4 rounded-lg bg-pink-700 shadow-lg">
					<h1 className="text-center text-white text-2xl">
						Doujinshis Hentai
					</h1>
				</div>
				<div className="col-start-2 col-span-8 flex flex-row justify-center mt-6 mb-6 gap-8 overflow-visible">
					<div className="breakLine flex flex-row justify-center gap-4 static">
						{hentais.map(
							(hentai) =>
								hentai.format === "Doujinshi" && (
									<div className="flex flex-col">
										<div className="mb-2">
											<img
												className="w-64 h-96 rounded-lg mb-2 shadow-lg"
												src={`${process.env.NEXT_PUBLIC_API}/images/hentais/${hentai.images[0]}`}
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
											className="bg-blue-800 hover:bg-blue-600 transition-all ease-in duration-200 text-white p-2 rounded px-14 shadow-lg"
											href={`/doujinshis/${hentai._id}`}>
											Página do Hentai
										</Link>
									</div>
								)
						)}
						{hentais.length === 0 && (
							<p>Não há Doujinshis em catálogo</p>
						)}
					</div>
				</div>
			</article>
		</section>
	);
}

export default Doujinshis;
