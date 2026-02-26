"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white text-sm font-bold group-hover:scale-110 transition-transform">
            R
          </div>
          <span className="font-display text-lg font-semibold text-neutral-900">
            Redline<span className="text-accent"> Production</span>
          </span>
        </Link>

        {/* Desktop Nav */}
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
          <Link
            href="/order"
            className="ml-2 btn-primary text-sm py-2"
          >
            Pesan Sekarang
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden w-9 h-9 flex flex-col justify-center items-center gap-1.5 rounded-lg hover:bg-neutral-100 transition-colors"
          aria-label="Toggle menu"
        >
          <span className={`w-5 h-0.5 bg-neutral-700 transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`w-5 h-0.5 bg-neutral-700 transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`w-5 h-0.5 bg-neutral-700 transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </nav>

      {/* Mobile Menu */}
      <div className={`md:hidden transition-all duration-300 overflow-hidden ${menuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="bg-white border-t border-neutral-100 px-4 py-4 flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                pathname === link.href
                  ? "bg-accent/10 text-accent"
                  : "text-neutral-600 hover:bg-neutral-50"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/order"
            onClick={() => setMenuOpen(false)}
            className="mt-2 btn-primary text-sm justify-center"
          >
            Pesan Sekarang
          </Link>
        </div>
      </div>
    </header>
  );
}
