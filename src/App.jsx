import { useState } from "react";
import "./App.css";
import useFetchPokemonDB from "./hooks/useFetchPokemonDB";
import GenerateGrid from "./components/generateGrid";
import PlayerCard from "./components/PlayerCard";
import { GameStateProvider } from "./components/GameState";

function App() {
  const { pokeDB, loading, error } = useFetchPokemonDB();
  var [refresh, setRefresh] = useState(0);

  const refreshGrid = () => {
    setRefresh(refresh + 1);
  };

  if (loading) {
    return <h1>Pokememory is loading...</h1>;
  }
  if (error) {
    console.error(error);
    return <h1>Error fetching Pokémon data :(</h1>;
  }
  return (
    <GameStateProvider>
      <h1>Pokememory!</h1>
      <div className="game-container">
        <PlayerCard pokeDB={pokeDB} pokeNR={5} player={"red"} />
        <div>
          {pokeDB && pokeDB.length > 0 ? (
            <GenerateGrid pokeDB={pokeDB} key={refresh} />
          ) : (
            <h2>No Pokémon data available :(</h2>
          )}
        </div>
        <PlayerCard pokeDB={pokeDB} pokeNR={8} player={"blue"} />
      </div>
      <button onClick={refreshGrid}>New Pokémon please!</button>
    </GameStateProvider>
  );
}

export default App;
