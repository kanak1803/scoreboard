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
    localStorage.removeItem("rounds");
    setGameStarted(false);
    setPlayers([]);
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
              className="text-sm text-gray-500 hover:text-[var(--accent)] transition-colors"
            >
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
