"use client";
import { useEffect, useState } from "react";
import { Trophy, ArrowLeft } from "lucide-react";

type Entry = { name: string; score: number; total: number; date: string };

export default function Leaderboard({ onBack }: { onBack: () => void }) {
  const [entries, setEntries] = useState<Entry[]>([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("geoduel_leaderboard") || "[]");
    setEntries(data);
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 text-white px-4 py-12">
      <div className="max-w-xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-zinc-500 hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-3xl font-black flex items-center gap-3">
            <Trophy className="text-yellow-400" size={28} /> LEADERBOARD
          </h2>
        </div>

        {entries.length === 0 ? (
          <div className="text-center py-16 text-zinc-600">
            <Trophy size={48} className="mx-auto mb-3 opacity-30" />
            <p>No scores yet. Play a game!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {entries.map((entry, i) => (
              <div
                key={i}
                className={`flex items-center gap-4 p-4 rounded-xl border ${
                  i === 0 ? "bg-yellow-500/10 border-yellow-500/30" :
                  i === 1 ? "bg-zinc-400/10 border-zinc-400/30" :
                  i === 2 ? "bg-orange-700/10 border-orange-700/30" :
                  "bg-zinc-900 border-zinc-800"
                }`}
              >
                <span className={`text-2xl font-black w-8 text-center ${
                  i === 0 ? "text-yellow-400" : i === 1 ? "text-zinc-400" : i === 2 ? "text-orange-600" : "text-zinc-600"
                }`}>
                  {i + 1}
                </span>
                <div className="flex-1">
                  <p className="font-bold">{entry.name}</p>
                  <p className="text-zinc-500 text-sm">{new Date(entry.date).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-emerald-400">{entry.score}</p>
                  <p className="text-zinc-500 text-xs">/ {entry.total}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}