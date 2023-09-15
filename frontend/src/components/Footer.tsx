"use client";

import Image from "next/image";
import FenixLogo from "../../public/images/fenixhentai-logo.png";

function Footer() {
	return (
		<>
			<footer className="bg-pink-900 py-4">
				<section className="flex flex-col">
					<div className="flex flex-col items-center mb-4">
						<h1 className="text-2xl font-bold">PARCEIROS:</h1>
						{/* <span>
							<Image
								src={FenixLogo}
								alt="Fenix Hentai Logo"
								width={180}
								unoptimized
							/>
						</span> */}
					</div>

					<div className="flex flex-col justify-center text-center">
						<h2>
							Todos os direitos dos Mangás são reservados aos
							artistas!
						</h2>
						<div>
							<span>Copyright &copy; Midara</span> |{" "}
							<span>Versão Beta: 0.0.1 </span>
						</div>
					</div>
				</section>
			</footer>
		</>
	);
}

export { Footer };
