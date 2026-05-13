import { Login } from "../components/auth/Login";

export default function HomePage() {
  return (
    <div
      className="relative min-h-screen overflow-hidden bg-slate-950 text-white"
      style={{
        backgroundImage:
          "linear-gradient(rgba(2, 6, 23, 0.72), rgba(2, 6, 23, 0.72)), url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-linear-to-br from-black/50 via-slate-950/10 to-emerald-950/40" />

      <div className="relative z-10 mx-auto grid min-h-screen max-w-6xl items-center gap-10 px-4 py-10 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <div className="max-w-2xl space-y-6">
          <p className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-white/80 backdrop-blur">
            Restaurant back office
          </p>
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
            One place to manage orders, inventory, and operations.
          </h1>
          <p className="max-w-xl text-base leading-7 text-white/80 sm:text-lg">
            Sign in to access the admin dashboard, monitor branch inventory, and keep your POS workflow moving.
          </p>
        </div>

        <div className="flex justify-center lg:justify-end">
          <div className="w-full max-w-md rounded-3xl border border-white/15 bg-white/10 p-4 shadow-2xl backdrop-blur-xl sm:p-6">
            <Login />
          </div>
        </div>
      </div>
    </div>
  );
}