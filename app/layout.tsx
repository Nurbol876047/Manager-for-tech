import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";

const inter = Inter({
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Менеджмент-AI | Білім беру жүйесіндегі менеджмент",
  description:
    "Мектеп директорлары мен завучтарға арналған басқарушылық шешім қабылдауды қолдайтын AI-көмекші.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="kk" className={inter.variable}>
      <body className="antialiased">
        <Nav />
        <div className="pb-28 sm:pb-0">{children}</div>
      </body>
    </html>
  );
}
