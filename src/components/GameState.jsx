// This component tracks the state of the game
import { createContext, useContext, useState } from "react";

const GameStateContext = createContext();

export const GameStateProvider = ({ children }) => {
  const [gameState, setGameState] = useState({
    currentPlayer: "red",
    score: { red: 0, blue: 0 },
    gameActive: true,
  });

  const switchTurn = () => {
    setGameState((prevState) => ({
      ...prevState,
      currentPlayer: prevState.currentPlayer === "red" ? "blue" : "red",
    }));
  };

  const updateScore = (player, points) => {
    setGameState((prevState) => ({
      ...prevState,
      score: { ...prevState.score, [player]: prevState.score + points },
    }));
  };

  const resetGame = () => {
    setGameState({
      currentPlayer: "red",
      score: { red: 0, blue: 0 },
      gameActive: true,
    });
  };
  return (
    <GameStateContext.Provider
      value={{
        gameState,
        switchTurn,
        updateScore,
        resetGame,
      }}
    >
      {children}
    </GameStateContext.Provider>
  );
};

export const useGameState = () => {
  return useContext(GameStateContext);
};
