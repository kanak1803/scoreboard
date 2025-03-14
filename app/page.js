"use client";
import { useState, useEffect } from "react";
import StartPage from "./component/StartPage";
import Scoreboard from "./component/Scoreboard";
import { Loader } from "lucide-react";

export default function Home() {
  const [gameStarted, setGameStarted] = useState(false);
  const [players, setPlayers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load players from localStorage when the app starts
  useEffect(() => {
    try {
      const savedRounds = JSON.parse(localStorage.getItem("rounds"));
      if (savedRounds && savedRounds.length > 0) {
        const savedPlayers = Object.keys(savedRounds[0]).filter(
          (key) => !["roundNumber", "date", "timestamp"].includes(key)
        ); // Filter out any non-player keys

        if (savedPlayers.length > 0) {
          setPlayers(savedPlayers);
          setGameStarted(true);
        }
      }
    } catch (error) {
      console.error("Error loading saved game:", error);
      localStorage.removeItem("rounds"); // Clear potentially corrupted data
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleGameStart = (playerList) => {
    setPlayers(playerList);
    setGameStarted(true);
  };

  const handleBackToStart = () => {
    // This function allows returning to the start page
    const confirmReset = window.confirm(
      "Are you sure you want to start new game?"
    );
    if (confirmReset) {
      localStorage.removeItem("rounds");
      setGameStarted(false);
      setPlayers([]);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="text-[var(--accent)] text-xl">
          <Loader size={90} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col">
      <header className="bg-[var(--card-bg)] shadow-sm py-3 px-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-[var(--accent)]">
            Sattori Score Tracker
          </h1>
          {gameStarted && (
            <button
              onClick={handleBackToStart}
              className="px-3 py-1.5 rounded-md bg-[var(--card-bg)] border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white transition-colors flex items-center gap-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4"
              >
                <path
                  fillRule="evenodd"
                  d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm1.23-3.723a.75.75 0 00.219-.53V2.929a.75.75 0 00-1.5 0V5.36l-.31-.31A7 7 0 003.239 8.188a.75.75 0 101.448.389A5.5 5.5 0 0113.89 6.11l.311.31h-2.432a.75.75 0 000 1.5h4.243a.75.75 0 00.53-.219z"
                  clipRule="evenodd"
                />
              </svg>
              New Game
            </button>
          )}
        </div>
      </header>

      <main className="flex-grow">
        {!gameStarted ? (
          <StartPage onStart={handleGameStart} />
        ) : (
          <Scoreboard players={players} onBack={handleBackToStart} />
        )}
      </main>

      <footer className="bg-[var(--card-bg)] py-3 px-4 mt-auto">
        <div className="max-w-4xl mx-auto text-center text-sm text-gray-500">
          Score Tracker App made for sattories &copy; {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
}
