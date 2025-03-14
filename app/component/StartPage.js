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

  const startGame = () => {
    if (players.length < 2) {
      setError("At least 2 players are required.");
      return;
    }
    onStart(players);
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold text-accent mb-4">Add Players</h1>
      {error && <p className="text-red-500">{error}</p>}

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Enter player name"
          className="border p-2"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
        />
        <button
          onClick={addPlayer}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </div>

      <ul className="mt-4">
        {players.map((player, index) => (
          <li key={index} className="text-white">
            {player}
          </li>
        ))}
      </ul>

      <button
        onClick={startGame}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Start Game
      </button>
    </div>
  );
}
