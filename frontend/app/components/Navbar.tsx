"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { name: "Home", href: "/" },
    { name: "Docs", href: "/docs" },
    { name: "Playground", href: "/playground" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-6 py-4">
      <div className="max-w-4xl mx-auto flex items-center justify-between bg-white/40 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-full px-6 py-3">
        <Link href="/" className="font-bold text-gray-900 tracking-tight text-xl">
          Expresskit
        </Link>
        <div className="flex items-center gap-6">
          {links.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`relative text-sm font-medium transition-colors ${
                  isActive ? "text-[#d9482b]" : "text-gray-700 hover:text-gray-900"
                }`}
              >
                {link.name}
                {isActive && (
                  <motion.div
                    layoutId="navbar-active-pill"
                    className="absolute -bottom-2 left-0 right-0 h-0.5 bg-[#d9482b] rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="https://github.com"
            target="_blank"
            className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
          >
            GitHub
          </Link>
        </div>
      </div>
    </nav>
  );
}
