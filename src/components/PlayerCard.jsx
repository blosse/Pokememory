// Component to generate the player "cards"
import { useState } from "react";
import { useGameState } from "./GameState";

const PlayerCard = ({ pokeDB, pokeNR, player }) => {
  const [pokemonImg, setPokemonImg] = useState(null);
  const { gameState, switchturn, updateScore, resetGame } = useGameState();
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

  // This is prob a pretty stupid way of doing this
  var playerColor = "player-card-blue";
  var playerScore = gameState.score.blue;
  var playerNr = 2;
  if (player == "red") {
    playerColor = "player-card-red";
    playerScore = gameState.score.red;
    playerNr = 1;
  }

  return (
    <div className={playerColor}>
      <img src={pokemonImg} />
      <h2>Player {playerNr}</h2>
      <h1>{playerScore}</h1>
    </div>
  );
};

export default PlayerCard;
