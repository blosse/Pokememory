// Component to generate the player "cards"
import { useState } from "react";
import { useGameState } from "./GameState";

const PlayerCard = ({ pokeDB, pokeNR, player }) => {
  const [pokemonImg, setPokemonImg] = useState(null);
  const { gameState, switchTurn, updateScore, resetGame } = useGameState();
  // Fetch pokemon profile pic
  const fetchPokeImg = async () => {
    try {
      const response = await fetch(pokeDB[pokeNR].url);
      const data = await response.json();
      setPokemonImg(data.sprites.front_default);
    } catch (error) {
      console.error("Error fetching Pokémon: ", error);
    }
  };
  fetchPokeImg();

  return (
    <div
      className={
        gameState.currentPlayer === player
          ? `player-${player} active`
          : `player-${player}`
      }
    >
      <img src={pokemonImg} />
      <h2>Player {player === "red" ? 1 : 2}</h2>
      <h1>{gameState.score[player]}</h1>
    </div>
  );
};

export default PlayerCard;
