"use client";
import { useState, useEffect } from "react";

export default function Scoreboard({ players }) {
  const [scores, setScores] = useState({});
  const [rounds, setRounds] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const [showFinalScores, setShowFinalScores] = useState(false);
  const [winner, setWinner] = useState("");
  const [error, setError] = useState("");

  // Load scores from localStorage on component mount
  useEffect(() => {
    const savedRounds = JSON.parse(localStorage.getItem("rounds")) || [];
    setRounds(savedRounds);
  }, []);

  // Save scores to localStorage whenever rounds change
  useEffect(() => {
    if (rounds.length > 0) {
      localStorage.setItem("rounds", JSON.stringify(rounds));
    }
  }, [rounds]);

  const handleScoreChange = (player, value) => {
    setScores((prev) => ({ ...prev, [player]: value }));
  };

  const startNextRound = () => {
    if (
      players.some(
        (player) => scores[player] === undefined || scores[player] === ""
      )
    ) {
      setError("All players must enter their scores before proceeding.");
      return;
    }

    const newRounds = [...rounds, scores]; // Create a new rounds array
    setRounds(newRounds); // Update state
    setScores({}); // Clear current scores
    setError("");
  };

  const finishGame = () => {
    if (
      players.some(
        (player) => scores[player] === undefined || scores[player] === ""
      )
    ) {
      setError("All players must enter their scores before finishing.");
      return;
    }

    const finalRounds = [...rounds, scores];
    setRounds(finalRounds);
    setGameFinished(true);
    setShowFinalScores(true);
    setError("");

    // Calculate Winner
    const totalScores = players.map((player) => ({
      player,
      total: finalRounds.reduce(
        (sum, round) => sum + Number(round[player] || 0),
        0
      ),
    }));

    const minScore = Math.min(...totalScores.map((p) => p.total));
    const winners = totalScores
      .filter((p) => p.total === minScore)
      .map((p) => p.player);

    setWinner(
      winners.length === 1 ? winners[0] : `Tie between ${winners.join(", ")}`
    );
  };

  const resetGame = () => {
    const confirmReset = window.confirm(
      "Are you sure you want to reset the game?"
    );
    if (confirmReset) {
      setRounds([]);
      setScores({});
      setGameFinished(false);
      setShowFinalScores(false);
      setWinner("");
      setError("");
      localStorage.removeItem("rounds");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Scoreboard</h1>
      {error && <p className="text-red-500">{error}</p>}

      <table className="table-auto w-full border border-gray-500">
        <thead>
          <tr>
            <th className="border p-2">Player</th>
            {rounds.map((_, index) => (
              <th key={index} className="border p-2">
                Round {index + 1}
              </th>
            ))}
            <th className="border p-2">Current</th>
            {showFinalScores && <th className="border p-2">Total</th>}
          </tr>
        </thead>
        <tbody>
          {players.map((player) => (
            <tr key={player}>
              <td className="border p-2">{player}</td>
              {rounds.map((round, index) => (
                <td key={index} className="border p-2">
                  {round[player]}
                </td>
              ))}
              <td className="border p-2">
                <input
                  type="number"
                  value={scores[player] || ""}
                  onChange={(e) => handleScoreChange(player, e.target.value)}
                  className="w-16 p-1 border rounded"
                />
              </td>
              {showFinalScores && (
                <td className="border p-2 font-bold">
                  {rounds.reduce(
                    (sum, round) => sum + Number(round[player] || 0),
                    0
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {!gameFinished ? (
        <div className="mt-4 flex gap-2">
          <button
            className="bg-blue-500 text-white p-2 rounded"
            onClick={startNextRound}
          >
            Next Round
          </button>
          <button
            className="bg-red-500 text-white p-2 rounded"
            onClick={finishGame}
          >
            Finish Game
          </button>
        </div>
      ) : (
        <div className="mt-4">
          <h2 className="text-green-500 text-xl">🏆 Winner: {winner}</h2>
        </div>
      )}

      <button
        className="bg-gray-500 text-white p-2 mt-4 rounded"
        onClick={resetGame}
      >
        Reset Game
      </button>
    </div>
  );
}
