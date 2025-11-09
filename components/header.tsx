import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { UserNav } from "@/components/user-nav";

export async function Header() {
  const session = await getServerSession(authOptions);

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-2xl font-semibold text-white">
          Verified<span className="text-brand-400">Picks</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-slate-300">
          <Link href="/cappers">Browse Cappers</Link>
          <Link href="/dashboard">Dashboard</Link>
          {session?.user?.role === "ADMIN" && <Link href="/admin">Admin</Link>}
          <UserNav session={session} />
        </nav>
      </div>
    </header>
  );
}
