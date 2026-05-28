"use client";
import { useState, useRef } from "react";
import { Upload, ChevronRight, Trophy, Brain } from "lucide-react";
import RoundView from "@/components/RoundView";
import ResultsScreen from "@/components/ResultsScreen";
import Leaderboard from "@/components/Leaderboard";

export type RoundResult = {
  imageUrl: string;
  userGuess: string;
  aiGuess: string;
  aiConfidence: number;
  aiProbabilities: Record<string, number>;
  correctCountry: string;
  userCorrect: boolean;
  aiCorrect: boolean;
  saliencyImage: string;
};

const COUNTRIES = ["United States", "Japan", "Brazil", "Russia"];
const API_URL = process.env.NEXT_PUBLIC_API_URL!;

type Screen = "upload" | "playing" | "results" | "leaderboard";

export default function GamePage() {
  const [screen, setScreen] = useState<Screen>("upload");
  const [images, setImages] = useState<{ file: File; url: string; country: string }[]>([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [results, setResults] = useState<RoundResult[]>([]);
  const [playerName, setPlayerName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList) => {
    const newImages = Array.from(files).map((file) => ({
      file,
      url: URL.createObjectURL(file),
      country: "",
    }));
    setImages((prev) => [...prev, ...newImages]);
  };

  const setCountry = (idx: number, country: string) => {
    setImages((prev) =>
      prev.map((img, i) => (i === idx ? { ...img, country } : img))
    );
  };

  const removeImage = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const startGame = () => {
    if (images.length === 0 || images.some((img) => !img.country)) return;
    setCurrentRound(0);
    setResults([]);
    setScreen("playing");
  };

  const handleRoundComplete = async (userGuess: string) => {
    const current = images[currentRound];
    const formData = new FormData();
    formData.append("file", current.file);

    const res = await fetch(`${API_URL}/predict`, { method: "POST", body: formData });
    const data = await res.json();

    const result: RoundResult = {
      imageUrl: current.url,
      userGuess,
      aiGuess: data.prediction,
      aiConfidence: data.confidence,
      aiProbabilities: data.probabilities,
      correctCountry: current.country,
      userCorrect: userGuess === current.country,
      aiCorrect: data.prediction === current.country,
      saliencyImage: data.saliency_image,
    };

    const newResults = [...results, result];
    setResults(newResults);

    if (currentRound + 1 >= images.length) {
      setScreen("results");
    } else {
      setCurrentRound((r) => r + 1);
    }
  };

  // Upload screen
  if (screen === "upload") {
    return (
      <main className="min-h-screen bg-zinc-950 text-white px-4 py-12">
        <div className="max-w-3xl mx-auto space-y-8">
          <div>
            <h1 className="text-4xl font-black">
              GEO<span className="text-emerald-400">DUEL</span>
            </h1>
            <p className="text-zinc-400 mt-1">Upload images from <span className="text-emerald-400 font-bold">USA, Japan, Brazil or Russia</span> only</p>
          </div>

          {/* Name input */}
          <input
            type="text"
            placeholder="Enter your name for the leaderboard"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
          />

          {/* Drop zone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
            className="border-2 border-dashed border-zinc-700 hover:border-emerald-500 rounded-2xl p-12 text-center cursor-pointer transition-colors"
          >
            <Upload className="mx-auto mb-3 text-zinc-500" size={32} />
            <p className="text-zinc-400">Drop images here or click to upload</p>
            <p className="text-zinc-600 text-sm mt-1">JPG, PNG, WEBP supported</p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files && handleFiles(e.target.files)}
            />
          </div>

          {/* Image list */}
          {images.length > 0 && (
            <div className="space-y-3">
              <p className="text-zinc-400 text-sm">{images.length} image{images.length > 1 ? "s" : ""} — assign the correct country for each:</p>
              {images.map((img, idx) => (
                <div key={idx} className="flex items-center gap-4 bg-zinc-900 rounded-xl p-3 border border-zinc-800">
                  <img src={img.url} className="w-20 h-14 object-cover rounded-lg" />
                  <div className="flex-1">
                    <select
                      value={img.country}
                      onChange={(e) => setCountry(idx, e.target.value)}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="">Select correct country...</option>
                      {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <button onClick={() => removeImage(idx)} className="text-zinc-600 hover:text-red-400 transition-colors text-xl leading-none">×</button>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={startGame}
              disabled={images.length === 0 || images.some((i) => !i.country) || !playerName}
              className="flex-1 bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-800 disabled:text-zinc-600 text-black font-black py-4 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              START {images.length > 0 ? `${images.length} ROUNDS` : "GAME"}
              <ChevronRight size={20} />
            </button>
            <button
              onClick={() => setScreen("leaderboard")}
              className="bg-zinc-800 hover:bg-zinc-700 px-6 py-4 rounded-xl transition-colors flex items-center gap-2"
            >
              <Trophy size={18} className="text-yellow-400" />
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (screen === "playing") {
    return (
      <RoundView
        image={images[currentRound]}
        roundNumber={currentRound + 1}
        totalRounds={images.length}
        countries={COUNTRIES}
        onGuess={handleRoundComplete}
      />
    );
  }

  if (screen === "results") {
    return (
      <ResultsScreen
        results={results}
        playerName={playerName}
        onPlayAgain={() => { setImages([]); setScreen("upload"); }}
        onLeaderboard={() => setScreen("leaderboard")}
      />
    );
  }

  return <Leaderboard onBack={() => setScreen("upload")} />;
}