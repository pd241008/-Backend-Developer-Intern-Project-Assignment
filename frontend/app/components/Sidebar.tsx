"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

const navItems = [
  {
    title: "Overview",
    links: [
      { name: "Introduction", href: "/docs#introduction" },
      { name: "System Architecture", href: "/docs#architecture" },
    ],
  },
  {
    title: "Getting Started",
    links: [
      { name: "Quick Start", href: "/docs#getting-started" },
      { name: "Installation", href: "/docs#installation" },
      { name: "Project Structure", href: "/docs#project-structure" },
    ],
  },
  {
    title: "Concepts",
    links: [
      { name: "Core Features", href: "/docs#core-features" },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-[calc(100vh-7rem)] fixed left-0 top-28 overflow-y-auto border-r border-gray-200 bg-white/50 backdrop-blur-md px-6 py-8 hidden md:block">
      <nav className="space-y-8">
        {navItems.map((section) => (
          <div key={section.title}>
            <h4 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wider">{section.title}</h4>
            <ul className="space-y-2">
              {section.links.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className={`group flex items-center justify-between text-sm transition-colors ${
                        isActive
                          ? "text-[#d9482b] font-medium"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      {link.name}
                      {isActive && <ChevronRight size={14} className="text-[#d9482b]" />}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
