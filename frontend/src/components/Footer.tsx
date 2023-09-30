"use client";

import Link from "next/link";

import Image from "next/image";
import FenixLogo from "../../public/fenixhentai-logo.png";
import FenixSub from "../../public/fenixsub-logo.png";

function Footer() {
	return (
		<>
			<footer className="bg-pink-900 py-4">
				<section className="flex flex-col">
					<div className="flex flex-col items-center mb-4">
						<h1 className="text-2xl font-bold">PARCEIROS:</h1>

						<div className="flex flex-row justify-center items-center mt-2 gap-4">
							<Link
								href="https://fenixfansub.net/"
								target="_blank">
								<Image
									src={FenixSub}
									alt="FenixSub Logo"
									width={130}
									unoptimized
								/>
							</Link>
							<Link
								href="https://fenixfansub.net/hentai/"
								target="_blank">
								<Image
									src={FenixLogo}
									alt="Fenix Hentai Logo"
									width={160}
									unoptimized
								/>
							</Link>
						</div>
					</div>

					<div className="flex flex-col justify-center text-center">
						<h2>
							Todos os direitos dos Mangás são reservados aos
							artistas!
						</h2>
						<div>
							<span>Copyright &copy; Midara</span> |{" "}
							<span>
								Versão Beta:{" "}
								{`${process.env.NEXT_PUBLIC_APP_VERSION}`}
							</span>
						</div>
					</div>
				</section>
			</footer>
		</>
	);
}

export { Footer };
