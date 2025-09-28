"use client";

import Link from "next/link";

function Footer() {
  return (
    <>
      <footer className="bg-pink-900 py-4">
        <section className="flex flex-col">
          <div className="flex flex-col justify-center text-center py-8">
            <span className="mb-2">
              &copy; 2025 - Midara. Todos os direitos dos Mangás são reservados
              aos artistas!
            </span>
            <span>Versão: {`${process.env.NEXT_PUBLIC_APP_VERSION}`}</span>
          </div>
        </section>
      </footer>
    </>
  );
}

export { Footer };
