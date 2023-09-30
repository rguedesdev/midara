"use client";

import { useState, useEffect, useContext } from "react";

// Next Themes
import { useTheme } from "next-themes";
import { MdDarkMode, MdSunny } from "react-icons/md";
import { LuLogIn, LuPenSquare } from "react-icons/lu";

// Context
import { Context } from "@/context/UserContext";

// Next Components
import Image from "next/image";
import Link from "next/link";

// React Icons
import { BiHomeSmile } from "react-icons/bi";
import { FaFire, FaMeteor, FaUserAstronaut } from "react-icons/fa";
import { LuLayoutDashboard } from "react-icons/lu";
import { RxExit } from "react-icons/rx";
import { IoPricetagsSharp } from "react-icons/io5";
import { RiPenNibFill } from "react-icons/ri";

import Logo from "../../public/midara-logo.png";

function Navbar() {
	const { systemTheme, theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);
	const { authenticated, logout } = useContext(Context);

	useEffect(() => {
		setMounted(true);
	}, []);

	const renderThemeChanger = () => {
		if (!mounted) return null;

		const currentTheme = theme === "system" ? systemTheme : theme;

		if (currentTheme === "dark") {
			return (
				<div
					className="flex flex-row items-center hover:text-blue-300 transition-all ease-in duration-200 gap-1 cursor-pointer"
					onClick={() => setTheme("light")}>
					<MdSunny size={20} />
					<span>Light</span>
				</div>
			);
		} else {
			return (
				<div
					className="flex flex-row items-center hover:text-blue-300 transition-all ease-in duration-200 gap-1 cursor-pointer"
					onClick={() => setTheme("dark")}>
					<MdDarkMode size={20} />
					<span>Dark</span>
				</div>
			);
		}
	};

	return (
		<nav className="bg-pink-900 py-4 w-full">
			<ul className="flex flex-row items-center justify-between ml-16 mr-16">
				<div>
					<li>
						<Image
							src={Logo}
							alt="Midara Logo"
							width={350}
							unoptimized
							priority
						/>
					</li>
				</div>

				<div className="flex flex-row items-center gap-2">
					{authenticated ? (
						<>
							<li>
								<Link
									className="flex flex-row items-center hover:text-blue-300 transition-all ease-in duration-200 gap-1"
									href="/">
									<BiHomeSmile /> Home
								</Link>
							</li>

							<li>
								<Link
									className="flex flex-row items-center hover:text-blue-300 transition-all ease-in duration-200 gap-1"
									href="/mangas">
									<FaFire /> Mangas
								</Link>
							</li>

							<li>
								<Link
									className="flex flex-row items-center hover:text-blue-300 transition-all ease-in duration-200 gap-1"
									href="/doujinshis">
									<FaMeteor /> Doujinshis
								</Link>
							</li>

							<li>
								<Link
									className="flex flex-row items-center hover:text-blue-300 transition-all ease-in duration-200 gap-1"
									href="/tags">
									<IoPricetagsSharp size={15} /> Tags
								</Link>
							</li>

							<li>
								<Link
									className="flex flex-row items-center hover:text-blue-300 transition-all ease-in duration-200 gap-1"
									href="/mangakas">
									<RiPenNibFill /> Mangakas
								</Link>
							</li>

							<li>|</li>

							<li>
								<Link
									className="flex flex-row items-center hover:text-blue-300 transition-all ease-in duration-200 gap-1"
									href="/profile">
									<FaUserAstronaut /> My Profile
								</Link>
							</li>

							<li>
								<Link
									className="flex flex-row items-center hover:text-blue-300 transition-all ease-in duration-200 gap-1"
									href="/subscription">
									Subscription
								</Link>
							</li>

							<li
								className="cursor cursor-pointer flex flex-row items-center hover:text-blue-300 transition-all ease-in duration-200 gap-1"
								onClick={logout}>
								<RxExit /> Sair
							</li>
						</>
					) : (
						<>
							<li>
								<Link
									className="flex flex-row items-center hover:text-blue-300 transition-all ease-in duration-200 gap-1"
									href="/">
									<BiHomeSmile /> Home
								</Link>
							</li>

							<li>
								<Link
									className="flex flex-row items-center hover:text-blue-300 transition-all ease-in duration-200 gap-1"
									href="/mangas">
									<FaFire /> Mangas
								</Link>
							</li>

							<li>
								<Link
									className="flex flex-row items-center hover:text-blue-300 transition-all ease-in duration-200 gap-1"
									href="/doujinshis">
									<FaMeteor /> Doujinshis
								</Link>
							</li>

							<li>|</li>

							<li>
								<Link
									className="flex flex-row items-center hover:text-blue-300 transition-all ease-in duration-200 gap-1"
									href="/register">
									{" "}
									<LuPenSquare />
									Cadastrar
								</Link>
							</li>

							<li>
								<Link
									className="flex flex-row items-center hover:text-blue-300 transition-all ease-in duration-200 gap-1"
									href="/login">
									{" "}
									<LuLogIn />
									Login{" "}
								</Link>
							</li>
						</>
					)}

					<li>{renderThemeChanger()}</li>
				</div>
			</ul>
		</nav>
	);
}

export { Navbar };
