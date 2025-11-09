import Link from "next/link";

const features = [
  {
    title: "Verified experts",
    description: "Cappers earn verification through consistent performance reviewed by our integrity team."
  },
  {
    title: "Subscription control",
    description: "Subscribe to daily, weekly, or monthly plans tailored to your bankroll and betting rhythm."
  },
  {
    title: "Transparent analytics",
    description: "Every pick comes with real-time performance tracking—win rate, ROI, and record."
  }
];

export default function HomePage() {
  return (
    <div className="space-y-24">
      <section className="mx-auto max-w-4xl text-center">
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
          The trusted marketplace for serious bettors and elite handicappers.
        </h1>
        <p className="mt-6 text-lg text-slate-300">
          VerifiedPicks brings transparency to sports betting insights with subscription tools, automated payouts, and
          instant access to winning analysis.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/cappers"
            className="rounded-full bg-brand-500 px-6 py-3 text-base font-semibold text-white shadow hover:bg-brand-400"
          >
            Explore cappers
          </Link>
          <Link
            href="/dashboard"
            className="rounded-full border border-slate-700 px-6 py-3 text-base font-semibold text-white hover:border-brand-500"
          >
            Go to dashboard
          </Link>
        </div>
      </section>

      <section className="grid gap-10 md:grid-cols-3">
        {features.map((feature) => (
          <div key={feature.title} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
            <p className="mt-3 text-sm text-slate-300">{feature.description}</p>
          </div>
        ))}
      </section>

      <section className="rounded-2xl border border-brand-500/40 bg-brand-500/10 p-10 text-center">
        <h2 className="text-3xl font-semibold text-white">Built for plug-and-play design systems</h2>
        <p className="mt-4 text-base text-slate-200">
          Our React components are placeholders—drop in your design system and ship a production-grade betting
          marketplace with minimal wiring.
        </p>
        <Link
          href="/cappers"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-white/10 px-6 py-3 text-sm font-semibold text-white hover:bg-white/20"
        >
          View marketplace
        </Link>
      </section>
    </div>
  );
}
