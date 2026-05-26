import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-white px-4">
      <div className="max-w-2xl text-center space-y-8">
        <div className="space-y-2">
          <p className="text-emerald-400 tracking-[0.3em] text-sm uppercase font-mono">
            Human vs Machine
          </p>
          <h1 className="text-7xl font-black tracking-tight">
            GEO<span className="text-emerald-400">DUEL</span>
          </h1>
          <p className="text-zinc-400 text-lg mt-4">
            Upload street view images. Guess the country. Beat the AI.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center py-8">
          {[
            { label: "Upload Images", desc: "Add your own street view photos" },
            { label: "Guess Fast", desc: "Pick the country each round" },
            { label: "Beat the AI", desc: "Outsmart the neural network" },
          ].map((s) => (
            <div key={s.label} className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
              <p className="font-bold text-white">{s.label}</p>
              <p className="text-zinc-500 text-sm mt-1">{s.desc}</p>
            </div>
          ))}
        </div>

        <Link
          href="/game"
          className="inline-block bg-emerald-500 hover:bg-emerald-400 text-black font-black text-lg px-12 py-4 rounded-full transition-all hover:scale-105"
        >
          START GAME
        </Link>
      </div>
    </main>
  );
}