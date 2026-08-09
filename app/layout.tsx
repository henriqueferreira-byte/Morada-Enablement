import type { Metadata } from "next";
import { Outfit, Lato } from "next/font/google";
import { Toaster } from "@/niemeyer/components";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["400", "500", "600", "700"],
});

const lato = Lato({
  subsets: ["latin"],
  variable: "--font-lato",
  weight: ["300", "400", "700", "900"],
});

export const metadata: Metadata = {
  title: "Hub de Enablement | Morada.ai",
  description: "Plataforma interna de conteúdo e trilhas de aprendizado da Morada.ai.",
  icons: { icon: "/logos/favicon.png" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${outfit.variable} ${lato.variable}`}>
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
