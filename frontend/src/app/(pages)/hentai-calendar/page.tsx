"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { TbDeviceTv } from "react-icons/tb";
import { PiMonitorPlay } from "react-icons/pi";
import { MdVideoLabel } from "react-icons/md";
import { IoCalendarOutline } from "react-icons/io5";

// Import de imagens
import ShoujoRamune from "../../../../public/calendar/shoujo-ramune.png";
import NetoraretaBakunyuu01 from "../../../../public/calendar/netorareta-bakunyuu01.png";
import Mujin02 from "../../../../public/calendar/mujin02.png";
import PrincessBurst from "../../../../public/calendar/princess-burst.png";
import KoretteNaani from "../../../../public/calendar/korette-naani.png";
import KikenNaMoriOnigokko from "../../../../public/calendar/kiken-mori.png";
import Kakurenbo from "../../../../public/calendar/kakurenbo.png";
import SisterBreeder01 from "../../../../public/calendar/sister-breeder01.png";
import SisterBreeder02 from "../../../../public/calendar/sister-breeder02.png";
import NetoraretaBakunyuu02 from "../../../../public/calendar/netorareta-bakunyuu02.png";
import HoneyBlonde from "../../../../public/calendar/honey-blonde.png";
import ChoroMesu from "../../../../public/calendar/choro-mesu-ays.png";
import Reika01 from "../../../../public/calendar/reika-Karei01.png";
import Reika02 from "../../../../public/calendar/reika-Karei02.png";
import Shachiku02 from "../../../../public/calendar/shachiku-cinderella02.png";
import Dearest from "../../../../public/calendar/dearest-blue.png";
import Seikon from "../../../../public/calendar/seikon-Aria.png";
import HGishi from "../../../../public/calendar/h-ishi.png";
import Natsuzuma01 from "../../../../public/calendar/natsuzuma01.png";
import Natsuzuma02 from "../../../../public/calendar/natsuzuma02.png";
import Ikinari from "../../../../public/calendar/1LDK.png";
import MaidKyouiku from "../../../../public/calendar/maid-kyouiku.png";
import YuushahimeMilia04 from "../../../../public/calendar/yuusha-hime04.png";
import KikenMori02 from "../../../../public/calendar/kiken-mori02.png";
import DoSPet from "../../../../public/calendar/dos-pet.png";
import Nagachichi from "../../../../public/calendar/nagachichi01.png";
import HGishi02 from "../../../../public/calendar/h-gishi02.png";
import Nagachichi02 from "../../../../public/calendar/nagachichi02.png";

// Dados mockados
const mockCalendar = [
  {
    id: 1,
    image: ShoujoRamune,
    title: "Shoujo Ramune",
    episode: "Episódio 06",
    studio: "Mary Jane",
    date: "05 de Setembro",
    link: "/mangaka/homunculus",
  },
  {
    id: 2,
    image: NetoraretaBakunyuu01,
    title: "Netorareta Bakunyuu Tsuma-tachi",
    episode: "Episódio 01",
    studio: "Queen Bee",
    date: "12 de Setembro",
    link: "/mangaka/homunculus",
  },
  {
    id: 3,
    image: Mujin02,
    title: "Mujin Eki: The Animation",
    episode: "Episódio 02",
    studio: "Showten",
    date: "26 de Setembro",
    link: "/mangaka/homunculus",
  },
  {
    id: 4,
    image: PrincessBurst,
    title: "Princess Burst!",
    episode: "Episódio 02",
    studio: "Magin Label",
    date: "26 de Setembro",
    link: "/mangaka/homunculus",
  },
  {
    id: 5,
    image: KoretteNaani,
    title: "Korette Naani?",
    episode: "Episódio 01",
    studio: "Nur",
    date: "26 de Setembro",
    link: "/mangaka/homunculus",
  },
  {
    id: 6,
    image: KikenNaMoriOnigokko,
    title: "Kiken na Mori Onigokko",
    episode: "Episódio 01",
    studio: "Magin Label",
    date: "26 de Setembro",
    link: "/mangaka/homunculus",
  },
  {
    id: 7,
    image: Kakurenbo,
    title: "Kakurenbo: The Animation",
    episode: "Episódio 01",
    studio: "Pink Pineapple",
    date: "26 de Setembro",
    link: "/mangaka/homunculus",
  },
  {
    id: 8,
    image: SisterBreeder01,
    title: "Sister Breeder",
    episode: "Episódio 01",
    studio: "Bunny Walker",
    date: "26 de Setembro",
    link: "/mangaka/homunculus",
  },
  {
    id: 9,
    image: SisterBreeder02,
    title: "Sister Breeder",
    episode: "Episódio 02",
    studio: "Bunny Walker",
    date: "26 de Setembro",
    link: "/mangaka/homunculus",
  },
  {
    id: 10,
    image: NetoraretaBakunyuu02,
    title: "Netorareta Bakunyuu Tsuma-tachi",
    episode: "Episódio 02",
    studio: "Queen Bee",
    date: "10 de Outubro",
    link: "/mangaka/homunculus",
  },
  {
    id: 11,
    image: ChoroMesu,
    title: "Choro Mesu Days",
    episode: "Episódio 01",
    studio: "Mary Jane",
    date: "17 de Outubro",
    link: "/mangaka/homunculus",
  },
  {
    id: 12,
    image: HoneyBlonde,
    title: "Honey Blonde 2",
    episode: "Episódio 01",
    studio: "Queen Bee",
    date: "24 de Outubro",
    link: "/mangaka/homunculus",
  },
  {
    id: 13,
    image: Reika01,
    title: "Reika wa Karei na Boku no Joou: The Animation",
    episode: "Episódio 01",
    studio: "Pink Pineapple",
    date: "24 de Outubro",
    link: "/mangaka/homunculus",
  },
  {
    id: 14,
    image: Reika02,
    title: "Reika wa Karei na Boku no Joou: The Animation",
    episode: "Episódio 02",
    studio: "Pink Pineapple",
    date: "24 de Outubro",
    link: "/mangaka/homunculus",
  },
  {
    id: 15,
    image: Shachiku02,
    title: "Shachiku Cinderella",
    episode: "Episódio 02",
    studio: "Nur Edel",
    date: "31 de Outubro",
    link: "/mangaka/homunculus",
  },
  {
    id: 16,
    image: Seikon,
    title: "Seikon no Aria (Stigma Aria)",
    episode: "Episódio 01",
    studio: "Magin Label",
    date: "31 de Outubro",
    link: "/mangaka/homunculus",
  },
  {
    id: 17,
    image: HGishi,
    title: "H na Gishi Series: The Animation",
    episode: "Episódio 01",
    studio: "Showten",
    date: "31 de Outubro",
    link: "/mangaka/homunculus",
  },
  {
    id: 18,
    image: Natsuzuma01,
    title: "Natsuzuma",
    episode: "Episódio 01",
    studio: "Antechinus",
    date: "31 de Outubro",
    link: "/mangaka/homunculus",
  },
  {
    id: 19,
    image: Natsuzuma02,
    title: "Natsuzuma",
    episode: "Episódio 02",
    studio: "Antechinus",
    date: "31 de Outubro",
    link: "/mangaka/homunculus",
  },
  {
    id: 20,
    image: Dearest,
    title: "Dearest Blue",
    episode: "Episódio 04",
    studio: "PoRO",
    date: "31 de Outubro",
    link: "/mangaka/homunculus",
  },
  {
    id: 21,
    image: Ikinari,
    title: "1LDK+JK Ikinari Doukyo? Micchaku!? Hatsu Ecchi!!?",
    episode: "Episódio 06",
    studio: "King Bee",
    date: "21 de Novembro",
    link: "/mangaka/homunculus",
  },
  {
    id: 22,
    image: MaidKyouiku,
    title: "Maid Kyouiku: Botsuraku Kizoku Rurikawa Tsubaki The Animation",
    episode: "Episódio 02",
    studio: "Pink Pineapple",
    date: "28 de Novembro",
    link: "/mangaka/homunculus",
  },
  {
    id: 23,
    image: YuushahimeMilia04,
    title: "Yuusha-hime Milia",
    episode: "Episódio 04",
    studio: "Magin Label",
    date: "28 de Novembro",
    link: "/mangaka/homunculus",
  },
  {
    id: 24,
    image: KikenMori02,
    title: "Kiken na Mori Onigokko",
    episode: "Episódio 02",
    studio: "Magin Label",
    date: "28 de Novembro",
    link: "/mangaka/homunculus",
  },
  {
    id: 25,
    image: DoSPet,
    title: "Do S na Pet",
    episode: "Episódio 01",
    studio: "Nur",
    date: "28 de Novembro",
    link: "/mangaka/homunculus",
  },
  {
    id: 26,
    image: Nagachichi,
    title: "Nagachichi Nagai-san: The Animation",
    episode: "Episódio 01",
    studio: "Pink Pineapple",
    date: "28 de Novembro",
    link: "/mangaka/homunculus",
  },
  {
    id: 27,
    image: HGishi02,
    title: "H na Gishi Series: The Animation",
    episode: "Episódio 06",
    studio: "Showten",
    date: "19 de Dezembro",
    link: "/mangaka/homunculus",
  },
  {
    id: 28,
    image: Nagachichi02,
    title: "Nagachichi Nagai-san: The Animation",
    episode: "Episódio 02",
    studio: "Pink Pineapple",
    date: "19 de Dezembro",
    link: "/mangaka/homunculus",
  },
];

const months = ["Setembro", "Outubro", "Novembro", "Dezembro"];

function CalendarPage() {
  const currentMonth = "Novembro";
  const [activeMonth, setActiveMonth] = useState(currentMonth);

  const getCalendarByMonth = (month: string) =>
    mockCalendar.filter((item) => item.date.includes(month));

  return (
    <section className="min-h-screen flex flex-col items-center mt-8 mb-16">
      <article className="grid grid-cols-10 w-full">
        <div className="col-start-2 col-span-8 py-4 rounded-lg bg-pink-700 shadow-lg mb-8">
          <h1 className="text-center text-white text-2xl">
            Calendário Hentai 2025
          </h1>
        </div>

        {/* Botões dos meses */}
        <div className="col-start-2 col-span-8 flex justify-center flex-wrap gap-4 mb-6">
          {months.map((month) => (
            <button
              key={month}
              className={`px-4 py-2 rounded font-semibold ${
                activeMonth === month
                  ? "bg-blue-600 text-white"
                  : "bg-pink-400 text-white hover:bg-pink-600 transition"
              }`}
              onClick={() => setActiveMonth(month)}
            >
              {month}
            </button>
          ))}
        </div>

        {/* Conteúdo do mês ativo */}
        <div className="col-start-2 col-span-8 flex flex-row justify-center flex-wrap mt-6 mb-10 gap-8">
          {getCalendarByMonth(activeMonth).map((calendar) => (
            <div key={calendar.id} className="flex flex-col">
              <div className="mb-2">
                <Image
                  className="w-64 h-96 rounded-lg mb-2 shadow-lg select-none pointer-events-none"
                  src={calendar.image}
                  alt={calendar.title}
                  width={200}
                  height={300}
                  unoptimized
                />
                <h3 className="flex flex-row items-center gap-2 mb-1">
                  <TbDeviceTv size={22} />
                  <span className="titleOverflow">{calendar.title}</span>
                </h3>
                <h3 className="flex flex-row items-center gap-2 mb-1">
                  <PiMonitorPlay size={22} />
                  <span className="titleOverflow">{calendar.episode}</span>
                </h3>
                <h3 className="flex flex-row items-center gap-2 mb-1">
                  <MdVideoLabel size={22} />
                  <span className="titleOverflow">{calendar.studio}</span>
                </h3>
                <h3 className="flex flex-row items-center gap-2">
                  <IoCalendarOutline size={20} />
                  <span className="titleOverflow ml-[2px]">
                    {calendar.date}
                  </span>
                </h3>
              </div>

              <Link
                className="bg-blue-800 hover:bg-blue-600 transition-all ease-in duration-200 text-white p-2 rounded px-14 w-64 shadow-lg text-center"
                href={calendar.link}
              >
                + Detalhes
              </Link>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}

export default CalendarPage;
