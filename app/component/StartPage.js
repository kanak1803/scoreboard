import { useState } from "react";

export default function StartPage({ onStart }) {
  const [playerName, setPlayerName] = useState("");
  const [players, setPlayers] = useState([]);
  const [error, setError] = useState("");

  const addPlayer = () => {
    if (playerName.trim() === "") {
      setError("Player name cannot be empty.");
      return;
    }

    if (players.includes(playerName.trim())) {
      setError("Player name must be unique.");
      return;
    }

    setPlayers([...players, playerName.trim()]);
    setPlayerName("");
    setError("");
  };

  const removePlayer = (indexToRemove) => {
    setPlayers(players.filter((_, index) => index !== indexToRemove));
  };

  const startGame = () => {
    if (players.length < 2) {
      setError("At least 2 players are required.");
      return;
    }
    onStart(players);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      addPlayer();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 max-w-md mx-auto">
      <div className="w-full bg-[var(--card-bg)] rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-[var(--accent)] mb-6 text-center">
          Add Players
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Enter player name"
            className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] bg-[var(--background)]"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button
            onClick={addPlayer}
            className="bg-[var(--accent)] hover:bg-[var(--accent-dark)] text-white px-4 py-2 rounded-md transition-colors"
          >
            Add
          </button>
        </div>

        {players.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Players:</h2>
            <ul className="bg-[var(--background)] rounded-md overflow-hidden border border-gray-300">
              {players.map((player, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center py-2 px-4 border-b last:border-b-0 border-gray-200"
                >
                  <span>{player}</span>
                  <button
                    onClick={() => removePlayer(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          onClick={startGame}
          disabled={players.length < 2}
          className={`w-full py-3 rounded-md text-white font-medium text-center ${
            players.length < 2
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[var(--accent)] hover:bg-[var(--accent-dark)] transition-colors"
          }`}
        >
          {players.length < 2
            ? "Add at least 2 players"
            : `Start Game with ${players.length} Players`}
        </button>
      </div>
    </div>
  );
}
