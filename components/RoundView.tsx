"use client";
import { useState } from "react";
import { Brain } from "lucide-react";

type Props = {
  image: { file: File; url: string; country: string };
  roundNumber: number;
  totalRounds: number;
  countries: string[];
  onGuess: (guess: string) => Promise<void>;
};

export default function RoundView({ image, roundNumber, totalRounds, countries, onGuess }: Props) {
  const [selected, setSelected] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!selected || loading) return;
    setLoading(true);
    await onGuess(selected);
    setSelected("");
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white flex flex-col">
      {/* Progress bar */}
      <div className="h-1 bg-zinc-800">
        <div
          className="h-full bg-emerald-500 transition-all duration-500"
          style={{ width: `${(roundNumber / totalRounds) * 100}%` }}
        />
      </div>

      <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full px-4 py-8 gap-6">
        <div className="flex items-center justify-between">
          <p className="text-zinc-400 font-mono text-sm">
            ROUND <span className="text-white font-bold">{roundNumber}</span> / {totalRounds}
          </p>
          <div className="flex items-center gap-2 text-emerald-400 text-sm">
            <Brain size={16} />
            <span className="font-mono">AI THINKING...</span>
          </div>
        </div>

        {/* Image */}
        <div className="rounded-2xl overflow-hidden border border-zinc-800 aspect-video">
          <img src={image.url} className="w-full h-full object-cover" />
        </div>

        {/* Country buttons */}
        <div className="grid grid-cols-2 gap-3">
          {countries.map((country) => (
            <button
              key={country}
              onClick={() => setSelected(country)}
              className={`py-4 px-6 rounded-xl font-bold text-lg transition-all border-2 ${
                selected === country
                  ? "bg-emerald-500 border-emerald-500 text-black scale-105"
                  : "bg-zinc-900 border-zinc-700 hover:border-emerald-500 hover:bg-zinc-800"
              }`}
            >
              {country}
            </button>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={!selected || loading}
          className="w-full bg-white hover:bg-zinc-100 disabled:bg-zinc-800 disabled:text-zinc-600 text-black font-black py-4 rounded-xl transition-all text-lg"
        >
          {loading ? "AI is guessing..." : "SUBMIT GUESS"}
        </button>
      </div>
    </main>
  );
}