"use client";
import { useState, useEffect } from "react";

export default function Scoreboard({ players }) {
  const [scores, setScores] = useState({});
  const [rounds, setRounds] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const [showFinalScores, setShowFinalScores] = useState(false);
  const [winner, setWinner] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("current"); // "current", "history", or "summary"

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
    setActiveTab("summary");

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
      setActiveTab("current");
      localStorage.removeItem("rounds");
    }
  };

  // Calculate total scores for each player
  const getTotalScore = (player) => {
    return rounds.reduce((sum, round) => sum + Number(round[player] || 0), 0);
  };

  // Function to determine the row background color
  const getRowClass = (player) => {
    if (!showFinalScores) return "";

    const playerScore = getTotalScore(player);
    const minScore = Math.min(...players.map((p) => getTotalScore(p)));

    return playerScore === minScore ? "bg-green-100 dark:bg-green-900" : "";
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="bg-[var(--card-bg)] rounded-lg shadow-md p-4 md:p-6">
        <h1 className="text-2xl md:text-3xl font-bold text-[var(--accent)] mb-4 text-center">
          Scoreboard
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Mobile tab navigation */}
        <div className="flex border-b mb-4 md:hidden">
          <button
            className={`flex-1 py-2 text-center text-sm font-medium ${
              activeTab === "current"
                ? "border-b-2 border-[var(--accent)] text-[var(--accent)]"
                : ""
            }`}
            onClick={() => setActiveTab("current")}
          >
            Current Round
          </button>
          <button
            className={`flex-1 py-2 text-center text-sm font-medium ${
              activeTab === "history"
                ? "border-b-2 border-[var(--accent)] text-[var(--accent)]"
                : ""
            }`}
            onClick={() => setActiveTab("history")}
            disabled={rounds.length === 0}
          >
            History
          </button>
          <button
            className={`flex-1 py-2 text-center text-sm font-medium ${
              activeTab === "summary"
                ? "border-b-2 border-[var(--accent)] text-[var(--accent)]"
                : ""
            }`}
            onClick={() => setActiveTab("summary")}
          >
            Summary
          </button>
        </div>

        {/* Desktop view (full table) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full bg-[var(--background)] rounded-lg overflow-hidden">
            <thead className="bg-[var(--accent)] text-white">
              <tr>
                <th className="py-3 px-4 text-left">Player</th>
                {rounds.map((_, index) => (
                  <th key={index} className="py-3 px-4 text-center">
                    Round {index + 1}
                  </th>
                ))}
                <th className="py-3 px-4 text-center">Current</th>
                {showFinalScores && (
                  <th className="py-3 px-4 text-center">Total</th>
                )}
              </tr>
            </thead>
            <tbody>
              {players.map((player, playerIndex) => (
                <tr
                  key={player}
                  className={`${getRowClass(player)} ${
                    playerIndex % 2 === 0 ? "bg-opacity-50" : ""
                  } border-b`}
                >
                  <td className="py-3 px-4 font-medium">{player}</td>
                  {rounds.map((round, index) => (
                    <td key={index} className="py-3 px-4 text-center">
                      {round[player]}
                    </td>
                  ))}
                  <td className="py-3 px-4 text-center">
                    <input
                      type="number"
                      value={scores[player] || ""}
                      onChange={(e) =>
                        handleScoreChange(player, e.target.value)
                      }
                      disabled={gameFinished}
                      className="w-20 p-2 border rounded-md text-center focus:outline-none focus:ring-2 focus:ring-[var(--accent)] bg-[var(--background)]"
                    />
                  </td>
                  {showFinalScores && (
                    <td className="py-3 px-4 text-center font-bold">
                      {getTotalScore(player)}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile view - Current Round */}
        {activeTab === "current" && (
          <div className="md:hidden">
            <div className="bg-[var(--background)] rounded-lg overflow-hidden">
              {players.map((player, index) => (
                <div
                  key={player}
                  className={`p-3 ${
                    index % 2 === 0 ? "bg-opacity-75" : ""
                  } border-b flex justify-between items-center`}
                >
                  <div className="font-medium">{player}</div>
                  <input
                    type="number"
                    value={scores[player] || ""}
                    onChange={(e) => handleScoreChange(player, e.target.value)}
                    disabled={gameFinished}
                    className="w-20 p-2 border rounded-md text-center focus:outline-none focus:ring-2 focus:ring-[var(--accent)] bg-[var(--background)]"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mobile view - History */}
        {activeTab === "history" && (
          <div className="md:hidden">
            {rounds.length > 0 ? (
              rounds.map((round, roundIndex) => (
                <div key={roundIndex} className="mb-4">
                  <h3 className="font-medium text-sm text-[var(--accent)] mb-2">
                    Round {roundIndex + 1}
                  </h3>
                  <div className="bg-[var(--background)] rounded-lg overflow-hidden">
                    {players.map((player, playerIndex) => (
                      <div
                        key={player}
                        className={`p-3 ${
                          playerIndex % 2 === 0 ? "bg-opacity-75" : ""
                        } border-b flex justify-between items-center`}
                      >
                        <div className="font-medium">{player}</div>
                        <div>{round[player]}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-gray-500">
                No rounds played yet
              </div>
            )}
          </div>
        )}

        {/* Mobile view - Summary */}
        {activeTab === "summary" && (
          <div className="md:hidden">
            <div className="bg-[var(--background)] rounded-lg overflow-hidden">
              {players.map((player, playerIndex) => {
                const total = getTotalScore(player);
                const isWinner =
                  showFinalScores &&
                  total === Math.min(...players.map((p) => getTotalScore(p)));

                return (
                  <div
                    key={player}
                    className={`p-3 ${
                      isWinner
                        ? "bg-green-100 dark:bg-green-900"
                        : playerIndex % 2 === 0
                        ? "bg-opacity-75"
                        : ""
                    } border-b flex justify-between items-center`}
                  >
                    <div className="font-medium flex items-center">
                      {isWinner && <span className="mr-1">🏆</span>}
                      {player}
                    </div>
                    <div className="font-bold">{total}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {gameFinished ? (
          <div className="mt-6 p-4 bg-green-100 dark:bg-green-900 rounded-lg text-center">
            <h2 className="text-xl md:text-2xl font-bold mb-1">
              🏆 Winner: {winner}
            </h2>
            <p className="text-sm opacity-75">Game Complete!</p>
          </div>
        ) : (
          <div className="mt-6 flex flex-wrap gap-3 justify-center">
            <button
              className="bg-[var(--accent)] hover:bg-[var(--accent-dark)] text-white px-5 py-2 rounded-md transition-colors flex-1"
              onClick={startNextRound}
            >
              Next Round
            </button>
            <button
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-md transition-colors flex-1"
              onClick={finishGame}
            >
              Finish Game
            </button>
          </div>
        )}

        {/* <div className="mt-4 flex justify-center">
          <button
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md transition-colors"
            onClick={resetGame}
          >
            Reset Game
          </button>
        </div> */}
      </div>
    </div>
  );
}
