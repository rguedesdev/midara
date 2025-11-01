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
import { RxExit, RxHamburgerMenu, RxCross2 } from "react-icons/rx";
import { IoCalendarOutline, IoPricetagsSharp } from "react-icons/io5";
import { RiPenNibFill, RiVipCrownLine } from "react-icons/ri";

import Logo from "../../public/midara-logo.png";

function Navbar() {
  const { systemTheme, theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { authenticated, logout } = useContext(Context);
  const [menuOpen, setMenuOpen] = useState(false);

  // Utilitário de classe para estilização de links
  const navItemClass = `relative inline-flex flex-row items-center gap-2 text-white hover:text-blue-300 transition-colors duration-200
  after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 
  after:bg-blue-300 after:transition-all after:duration-300 hover:after:w-full`;

  useEffect(() => {
    setMounted(true);
  }, []);

  const renderThemeChanger = () => {
    if (!mounted) return null;
    const currentTheme = theme === "system" ? systemTheme : theme;

    return currentTheme === "dark" ? (
      <div
        className="relative inline-flex flex-row items-center gap-1 text-white hover:text-blue-300 transition-colors duration-200
          after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 
          after:bg-blue-300 after:transition-all after:duration-300 hover:after:w-full cursor-pointer ml-4 mb-2 sm:ml-0 sm:mb-0"
        onClick={() => setTheme("light")}
      >
        <MdSunny size={20} />
        <span>Light</span>
      </div>
    ) : (
      <div
        className="relative inline-flex flex-row items-center gap-1 text-white hover:text-blue-300 transition-colors duration-200
          after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 
          after:bg-blue-300 after:transition-all after:duration-300 hover:after:w-full cursor-pointer ml-4 mb-2 sm:ml-0 sm:mb-0"
        onClick={() => setTheme("dark")}
      >
        <MdDarkMode size={20} />
        <span>Dark</span>
      </div>
    );
  };

  return (
    <nav className="bg-pink-900 h-[80px] py-4 w-full">
      <ul className="hidden lg:flex flex-row items-center justify-between ml-16 mr-16">
        <div>
          <li>
            <Link href="/">
              <Image
                src={Logo}
                alt="Midara Logo"
                width={350}
                unoptimized
                priority
              />
            </Link>
          </li>
        </div>

        <div className="flex flex-row items-center gap-6">
          {authenticated ? (
            <>
              <li>
                <Link href="/" className={`${navItemClass}`}>
                  <BiHomeSmile />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link href="/mangas" className={navItemClass}>
                  <FaFire /> <span>Mangas</span>
                </Link>
              </li>
              <li>
                <Link href="/doujinshis" className={navItemClass}>
                  <FaMeteor /> <span>Doujinshis</span>
                </Link>
              </li>
              <li>
                <Link href="/tags" className={navItemClass}>
                  <IoPricetagsSharp /> <span>Tags</span>
                </Link>
              </li>
              <li>
                <Link href="/mangakas" className={navItemClass}>
                  <RiPenNibFill /> <span>Mangakas</span>
                </Link>
              </li>
              <li>|</li>
              <li>
                <Link href="/profile" className={navItemClass}>
                  <FaUserAstronaut /> <span>Perfil</span>
                </Link>
              </li>
              {/* <li>
                <Link href="/subscription" className={navItemClass}>
                  <RiVipCrownLine /> VIP
                </Link>
              </li> */}

              {/* <li>
                <Link href="/" className={navItemClass}>
                  <LuLayoutDashboard /> Dashboard
                </Link>
              </li> */}

              <li className={`${navItemClass} cursor-pointer`} onClick={logout}>
                <RxExit /> <span>Sair</span>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link href="/" className={navItemClass}>
                  <BiHomeSmile /> <span>Home</span>
                </Link>
              </li>
              <li>
                <Link href="/mangas" className={navItemClass}>
                  <FaFire /> <span>Mangas</span>
                </Link>
              </li>
              <li>
                <Link href="/doujinshis" className={navItemClass}>
                  <FaMeteor /> <span>Doujinshis</span>
                </Link>
              </li>
              <li>
                <Link href="/tags" className={navItemClass}>
                  <IoPricetagsSharp /> <span>Tags</span>
                </Link>
              </li>
              <li>
                <Link href="/mangakas" className={navItemClass}>
                  <RiPenNibFill /> <span>Mangakas</span>
                </Link>
              </li>
              <li>
                <Link href="/hentai-calendar" className={navItemClass}>
                  <IoCalendarOutline /> <span>Calendário</span>
                </Link>
              </li>
              <li>|</li>
              <li>
                <Link href="/register" className={navItemClass}>
                  <LuPenSquare /> <span>Cadastrar</span>
                </Link>
              </li>
              <li>
                <Link href="/login" className={navItemClass}>
                  <LuLogIn /> <span>Login</span>
                </Link>
              </li>
            </>
          )}

          <li>{renderThemeChanger()}</li>
        </div>
      </ul>

      {/* Navbar Mobile */}
      <ul className="sm:hidden flex flex-row items-center justify-between">
        <div>
          <li className="ml-4 w-[250px] sm:w-[300px] md:w-[600px] lg:w-[600px]">
            <Image
              src={Logo}
              alt="Midara Logo"
              width={600}
              unoptimized
              priority
            />
          </li>
        </div>
        <div className="flex flex-row items-center gap-2 mr-4">
          <li
            className="cursor-pointer"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            {menuOpen ? <RxCross2 size={30} /> : <RxHamburgerMenu size={30} />}
          </li>
        </div>
      </ul>

      <div
        className={`sm:hidden absolute top-[80px] left-0 w-full bg-pink-800 z-50 transition-all duration-300 ease-in-out transform ${
          menuOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-5 pointer-events-none"
        }`}
      >
        <ul className="flex flex-col text-white text-lg">
          <li>
            <Link
              className="flex w-full flex-row items-center gap-2 px-4 py-3 active:bg-pink-900 transition-colors duration-150"
              href="/"
              onClick={() => setMenuOpen(false)}
            >
              <BiHomeSmile />
              <span>Home</span>
            </Link>
          </li>
          <li>
            <Link
              className="flex w-full flex-row items-center gap-2 px-4 py-3 active:bg-pink-900 transition-colors duration-150"
              href="/mangas"
              onClick={() => setMenuOpen(false)}
            >
              <FaFire />
              <span> Mangas</span>
            </Link>
          </li>
          <li>
            <Link
              className="flex w-full flex-row items-center gap-2 px-4 py-3 active:bg-pink-900 transition-colors duration-150"
              href="/doujinshis"
              onClick={() => setMenuOpen(false)}
            >
              <FaMeteor />
              <span>Doujinshis</span>
            </Link>
          </li>
          <li>
            <Link
              className="flex w-full flex-row items-center gap-2 px-4 py-3 active:bg-pink-900 transition-colors duration-150"
              href="/tags"
              onClick={() => setMenuOpen(false)}
            >
              <IoPricetagsSharp />
              <span>Tags</span>
            </Link>
          </li>

          <li>
            <Link
              className="flex w-full flex-row items-center gap-2 px-4 py-3 active:bg-pink-900 transition-colors duration-150"
              href="/mangakas"
              onClick={() => setMenuOpen(false)}
            >
              <RiPenNibFill />
              <span>Mangakas</span>
            </Link>
          </li>

          <li>
            <Link
              className="flex w-full flex-row items-center gap-2 px-4 py-3 active:bg-pink-900 transition-colors duration-150"
              href="/hentai-calendar"
              onClick={() => setMenuOpen(false)}
            >
              <IoCalendarOutline />
              <span>Calendário</span>
            </Link>
          </li>

          {authenticated ? (
            <>
              {/* <li>
                <Link
                  className="flex w-full items-center gap-2 px-4 py-3 active:bg-pink-900 transition-colors duration-150"
                  href="/subscription"
                  onClick={() => setMenuOpen(false)}
                >
                  <RiVipCrownLine />
                  <span>VIP</span>
                </Link>
              </li> */}
              {/* <li>
                <Link
                  className="flex w-full items-center gap-2 px-4 py-3 active:bg-pink-900 transition-colors duration-150"
                  href="/dashboard"
                  onClick={() => setMenuOpen(false)}
                >
                  <LuLayoutDashboard />
                  <span>Dashboard</span>
                </Link>
              </li> */}
              <li
                className="flex flex-row items-center gap-2 w-full px-4 py-3 active:bg-pink-900 transition-colors duration-150"
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
              >
                <RxExit />
                <span>Sair</span>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  className="flex w-full flex-row items-center gap-2 px-4 py-3 active:bg-pink-900 transition-colors duration-150"
                  href="/register"
                  onClick={() => setMenuOpen(false)}
                >
                  <LuPenSquare />
                  <span>Cadastrar</span>
                </Link>
              </li>
              <li>
                <Link
                  className="flex w-full flex-row items-center gap-2 px-4 py-3 active:bg-pink-900 transition-colors duration-150"
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                >
                  <LuLogIn />
                  <span>Login</span>
                </Link>
              </li>
            </>
          )}
          <li>{renderThemeChanger()}</li>
        </ul>
      </div>
    </nav>
  );
}

// Aplica no global
export { Navbar };
