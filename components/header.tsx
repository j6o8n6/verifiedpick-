import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { UserNav } from "@/components/user-nav";

export async function Header() {
  const session = await getServerSession(authOptions);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-emerald-500" />
          <Link href="/" className="text-xl font-bold tracking-tight text-gray-900">
            Verified<span className="text-emerald-600">Picks</span>
          </Link>
        </div>
        <nav className="hidden items-center gap-6 text-sm font-medium text-gray-700 md:flex">
          <Link href="/cappers" className="hover:text-black">
            Browse Cappers
          </Link>
          <Link href="/leaderboard" className="hover:text-black">
            Leaderboard
          </Link>
          <Link href="/how-it-works" className="hover:text-black">
            How It Works
          </Link>
          <Link href="/dashboard" className="hover:text-black">
            Dashboard
          </Link>
          {session?.user?.role === "ADMIN" && (
            <Link href="/admin" className="font-semibold text-emerald-700 hover:text-emerald-900">
              Admin
            </Link>
          )}
        </nav>
        <div className="flex items-center gap-3">
          {session ? (
            <UserNav session={session} />
          ) : (
            <>
              <Link
                href="/auth/signin"
                className="rounded-xl border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Sign In
              </Link>
              <Link
                href="/cappers"
                className="rounded-xl bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                Find a Capper
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
