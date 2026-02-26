import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Redline Production — Hampers & Parcel Lebaran 2026",
  description: "Hampers & Parcel Lebaran berkualitas dengan kemasan elegan untuk hadiah bermakna di momen Idul Fitri. Berlokasi di Jember, Jawa Timur.",
  keywords: "parcel lebaran, hampers lebaran, parcel jember, hampers idul fitri, kado lebaran jember",
  openGraph: {
    title: "Redline Production — Hampers & Parcel Lebaran",
    description: "Parcel Lebaran berkualitas dengan kemasan elegan. Tersedia 10 pilihan paket mulai Rp 100.000.",
    locale: "id_ID",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
