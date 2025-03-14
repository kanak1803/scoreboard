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
    <div className="min-h-screen flex flex-col items-center justify-center p-4 w-full">
      <div className="w-full max-w-md bg-[var(--card-bg)] rounded-lg shadow-md p-4 sm:p-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--accent)] mb-4 sm:mb-6 text-center">
          Add Players
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2 mb-4 sm:mb-6">
          <input
            type="text"
            placeholder="Enter player name"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] bg-[var(--background)]"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button
            onClick={addPlayer}
            className="w-full sm:w-auto bg-[var(--accent)] hover:bg-[var(--accent-dark)] text-white px-4 py-2 rounded-md transition-colors"
          >
            Add
          </button>
        </div>

        {players.length > 0 && (
          <div className="mb-4 sm:mb-6">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">Players:</h2>
              <span className="text-sm text-gray-500">
                {players.length} added
              </span>
            </div>
            <ul className="bg-[var(--background)] rounded-md overflow-hidden border border-gray-300 max-h-60 overflow-y-auto">
              {players.map((player, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center py-2 px-3 border-b last:border-b-0 border-gray-200"
                >
                  <span className="truncate mr-2">{player}</span>
                  <button
                    onClick={() => removePlayer(index)}
                    className="text-red-500 hover:text-red-700 p-1"
                    aria-label={`Remove ${player}`}
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
