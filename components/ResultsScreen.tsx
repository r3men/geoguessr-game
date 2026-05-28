"use client";
import { useEffect } from "react";
import { Trophy, Brain, Check, X } from "lucide-react";
import type { RoundResult } from "@/app/game/page";

type Props = {
  results: RoundResult[];
  playerName: string;
  onPlayAgain: () => void;
  onLeaderboard: () => void;
};

export default function ResultsScreen({ results, playerName, onPlayAgain, onLeaderboard }: Props) {
  const userScore = results.filter((r) => r.userCorrect).length;
  const aiScore = results.filter((r) => r.aiCorrect).length;
  const total = results.length;
  const userWon = userScore > aiScore;
  const tied = userScore === aiScore;

  useEffect(() => {
    // Save to leaderboard in localStorage
    const entry = { name: playerName, score: userScore, total, date: new Date().toISOString() };
    const existing = JSON.parse(localStorage.getItem("geoduel_leaderboard") || "[]");
    existing.push(entry);
    existing.sort((a: any, b: any) => b.score - a.score);
    localStorage.setItem("geoduel_leaderboard", JSON.stringify(existing.slice(0, 20)));
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 text-white px-4 py-12">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <p className="text-5xl">{userWon ? "🎉" : tied ? "🤝" : "🤖"}</p>
          <h2 className="text-4xl font-black">
            {userWon ? "YOU WIN!" : tied ? "IT'S A TIE!" : "AI WINS!"}
          </h2>
          <p className="text-zinc-400">{tied ? "Great minds think alike" : userWon ? "You outsmarted the neural network" : "The AI got you this time"}</p>
        </div>

        {/* Score comparison */}
        <div className="grid grid-cols-2 gap-4">
          <div className={`rounded-2xl p-6 text-center border-2 ${userWon ? "border-emerald-500 bg-emerald-500/10" : "border-zinc-700 bg-zinc-900"}`}>
            <p className="text-zinc-400 text-sm uppercase tracking-widest mb-2">You</p>
            <p className="text-6xl font-black text-emerald-400">{userScore}</p>
            <p className="text-zinc-500 text-sm mt-1">/ {total} correct</p>
          </div>
          <div className={`rounded-2xl p-6 text-center border-2 ${!userWon && !tied ? "border-blue-500 bg-blue-500/10" : "border-zinc-700 bg-zinc-900"}`}>
            <div className="flex items-center justify-center gap-2 text-zinc-400 text-sm uppercase tracking-widest mb-2">
              <Brain size={14} /> AI
            </div>
            <p className="text-6xl font-black text-blue-400">{aiScore}</p>
            <p className="text-zinc-500 text-sm mt-1">/ {total} correct</p>
          </div>
        </div>

        {/* Round breakdown */}
        <div className="space-y-3">
          <h3 className="font-bold text-zinc-300">Round Breakdown</h3>
          {results.map((r, i) => (
            <div key={i} className="bg-zinc-900 rounded-xl p-4 border border-zinc-800 flex gap-4">
              <div className="flex flex-col gap-1 flex-shrink-0">
                <img src={r.imageUrl} className="w-24 h-16 object-cover rounded-lg" />
                {r.saliencyImage && (
                  <div className="relative">
                    <img src={r.saliencyImage} className="w-24 h-16 object-cover rounded-lg" />
                    <span className="absolute bottom-1 left-1 text-white text-xs bg-black/60 px-1 rounded">
                      AI focus
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-zinc-400 mb-2">
                  Answer: <span className="text-white font-bold">{r.correctCountry}</span>
                </p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className={`flex items-center gap-2 ${r.userCorrect ? "text-emerald-400" : "text-red-400"}`}>
                    {r.userCorrect ? <Check size={14} /> : <X size={14} />}
                    <span>You: {r.userGuess}</span>
                  </div>
                  <div className={`flex items-center gap-2 ${r.aiCorrect ? "text-blue-400" : "text-red-400"}`}>
                    {r.aiCorrect ? <Check size={14} /> : <X size={14} />}
                    <span>AI: {r.aiGuess} ({(r.aiConfidence * 100).toFixed(0)}%)</span>
                  </div>
                </div>
                {/* AI confidence bars */}
                <div className="mt-2 space-y-1">
                  {Object.entries(r.aiProbabilities)
                    .sort(([, a], [, b]) => b - a)
                    .map(([country, prob]) => (
                      <div key={country} className="flex items-center gap-2">
                        <span className="text-xs text-zinc-500 w-24 truncate">{country}</span>
                        <div className="flex-1 bg-zinc-800 rounded-full h-1.5">
                          <div
                            className="bg-blue-500 h-1.5 rounded-full transition-all"
                            style={{ width: `${prob * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-zinc-500 w-8 text-right">{(prob * 100).toFixed(0)}%</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button onClick={onPlayAgain} className="bg-emerald-500 hover:bg-emerald-400 text-black font-black py-4 rounded-xl transition-all">
            PLAY AGAIN
          </button>
          <button onClick={onLeaderboard} className="bg-zinc-800 hover:bg-zinc-700 py-4 rounded-xl transition-all flex items-center justify-center gap-2">
            <Trophy size={18} className="text-yellow-400" /> LEADERBOARD
          </button>
        </div>
      </div>
    </main>
  );
}