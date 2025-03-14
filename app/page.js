"use client";
import { useState, useEffect } from "react";
import StartPage from "./component/StartPage";
import Scoreboard from "./component/Scoreboard";

export default function Home() {
  const [gameStarted, setGameStarted] = useState(false);
  const [players, setPlayers] = useState([]);

  // Load players from localStorage when the app starts
  useEffect(() => {
    const savedRounds = JSON.parse(localStorage.getItem("rounds"));
    if (savedRounds && savedRounds.length > 0) {
      const savedPlayers = Object.keys(savedRounds[0]); // Get player names from first round object
      setPlayers(savedPlayers);
      setGameStarted(true);
    }
  }, []);

  return (
    <>
      {!gameStarted ? (
        <StartPage
          onStart={(playerList) => {
            setPlayers(playerList);
            setGameStarted(true);
          }}
        />
      ) : (
        <Scoreboard players={players} />
      )}
    </>
  );
}
