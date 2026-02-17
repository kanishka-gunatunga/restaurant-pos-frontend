import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 p-8 dark:bg-zinc-950">
      <main className="flex max-w-2xl flex-col items-center gap-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Restaurant POS
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          Point of Sale system for restaurant operations. Frontend built with Next.js, Tailwind CSS,
          and TypeScript. Backend integration pending.
        </p>
        <div className="flex gap-4">
          <Link
            href="/"
            className="rounded-lg bg-zinc-900 px-6 py-3 font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Get Started
          </Link>
        </div>
      </main>
    </div>
  );
}
