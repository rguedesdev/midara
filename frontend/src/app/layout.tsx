import "./globals.css";
import { ThemeProvider } from "../components/ThemeProvider";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";

import { Toaster } from "react-hot-toast";

// Components
import { Navbar } from "../components/Navbar";
import { Footer } from "@/components/Footer";

// Context
import { UserProvider } from "@/context/UserContext";

const poppins = Poppins({ subsets: ["latin"], weight: "400" });

export const metadata = {
  title: "Midara Hentai | Mangás e Doujinshis Hentai em Português",
  description:
    "O melhor site de Mangás Hentai em quesito qualidade. Selecionamos os melhores Mangás e Doujinshis Hentais dos melhores mangakas, tudo com tradução em português.",
  alternates: {
    canonical: "https://www.midara.ink",
  },
  openGraph: {
    title: "Midara Hentai",
    description:
      "Mangás e Doujinshis Hentais em português com alta qualidade e conteúdo atualizado.",
    url: "https://www.midara.ink",
    siteName: "Midara Hentai",
    locale: "pt_BR",
    type: "website",
  },
  icons: {
    icon: "/favicon.png",
  },
};

interface IPropsChildren {
  children: React.ReactNode;
}

export default function RootLayout({ children }: IPropsChildren) {
  return (
    <html lang="pt-BR">
      <head>
        <link
          href="https://cdn.jsdelivr.net/npm/daisyui@3.7.7/dist/full.css"
          rel="stylesheet"
          type="text/css"
        />
        <meta
          name="6a97888e-site-verification"
          content="d56467611a43ab4fb67895f46c433c64"
        ></meta>
      </head>
      <body className={poppins.className}>
        <ThemeProvider>
          <UserProvider>
            <Navbar />
            <Toaster
              position="bottom-center"
              reverseOrder={false}
              toastOptions={{ duration: 2000 }}
            />
            {children}
            <Footer />
          </UserProvider>
        </ThemeProvider>
        <script src="https://cdn.tailwindcss.com"></script>
      </body>
    </html>
  );
}
