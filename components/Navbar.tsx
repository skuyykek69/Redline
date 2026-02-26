"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";

const navLinks = [
  { href: "/", label: "Beranda" },
  { href: "/catalog", label: "Katalog" },
  { href: "/order", label: "Pesan" },
  { href: "/testimonials", label: "Testimoni" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { totalItems } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur-sm shadow-sm" : "bg-transparent"
      }`}
    >
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-full overflow-hidden border border-accent/20 flex-shrink-0 bg-accent/10">
            <Image
              src="/logo.png"
              alt="Redline Production"
              width={36}
              height={36}
              className="w-full h-full object-cover"
            />
          </div>
          <span className="font-display text-lg font-semibold text-neutral-900">
            Redline<span className="text-accent"> Production</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                pathname === link.href
                  ? "bg-accent text-white"
                  : "text-neutral-600 hover:text-accent hover:bg-accent/5"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/order" className="ml-1 relative p-2 rounded-full hover:bg-neutral-100 transition-colors">
            <svg className="w-5 h-5 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-accent text-white text-xs rounded-full flex items-center justify-center font-semibold">
                {totalItems > 9 ? "9+" : totalItems}
              </span>
            )}
          </Link>
          <Link href="/order" className="ml-2 btn-primary text-sm py-2">
            Pesan Sekarang
          </Link>
        </div>

        <div className="md:hidden flex items-center gap-1">
          <Link href="/order" className="relative p-2 rounded-full hover:bg-neutral-100 transition-colors">
            <svg className="w-5 h-5 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-accent text-white text-xs rounded-full flex items-center justify-center font-semibold">
                {totalItems > 9 ? "9+" : totalItems}
              </span>
            )}
          </Link>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-9 h-9 flex flex-col justify-center items-center gap-1.5 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <span className={`w-5 h-0.5 bg-neutral-700 transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`w-5 h-0.5 bg-neutral-700 transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`w-5 h-0.5 bg-neutral-700 transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </nav>

      <div className={`md:hidden transition-all duration-300 overflow-hidden ${menuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="bg-white border-t border-neutral-100 px-4 py-4 flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                pathname === link.href ? "bg-accent/10 text-accent" : "text-neutral-600 hover:bg-neutral-50"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/order" onClick={() => setMenuOpen(false)} className="mt-2 btn-primary text-sm justify-center">
            🛒 Keranjang {totalItems > 0 && `(${totalItems})`}
          </Link>
        </div>
      </div>
    </header>
  );
}
