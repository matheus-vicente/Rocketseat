import "./globals.css";

import { Roboto } from "next/font/google";

import { Sidebar } from "@/components/Sidebar";

const roboto = Roboto({ weight: ["400", "500", "700"], subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <body className={roboto.className}>
        <div className="grid min-h-screen grid-cols-app">
          <Sidebar />

          <main className="px-4 pb-12 pt-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
