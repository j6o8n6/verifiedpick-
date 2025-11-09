import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-10 text-sm text-gray-600">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-emerald-500" />
            <span className="font-semibold">VerifiedPicks</span>
          </div>
          <nav className="flex flex-wrap gap-4">
            <Link className="hover:text-black" href="#">
              Responsible Gambling
            </Link>
            <Link className="hover:text-black" href="#">
              FAQ
            </Link>
            <Link className="hover:text-black" href="#">
              Terms
            </Link>
            <Link className="hover:text-black" href="#">
              Privacy
            </Link>
          </nav>
        </div>
        <p className="mt-6 text-xs text-gray-500">
          Picks for informational/entertainment purposes only. No wagering is offered on this site. 21+.
        </p>
      </div>
    </footer>
  );
}
