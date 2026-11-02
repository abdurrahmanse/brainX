"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Overview" },
  { href: "/design", label: "Design system" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Admin" className="flex flex-col gap-1 p-4">
      {links.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          aria-current={pathname === href ? "page" : undefined}
          className="block border-2 border-transparent px-3 py-2 hover:border-fg aria-[current=page]:bg-fg aria-[current=page]:text-bg"
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
