import { useState } from "react";
import "./App.css";
import useFetchPokemonDB from "./hooks/useFetchPokemonDB";
import GenerateGrid from "./components/generateGrid";

function App() {
  const { pokeDB, loading, error } = useFetchPokemonDB();
  var [regenGrid, setRegenGrid] = useState(0);

  const updateGrid = () => {
    setRegenGrid(regenGrid + 1);
    console.log("Updating grid! New value is:", regenGrid);
  };

  if (loading) {
    return <h1>Pokememory is loading...</h1>;
  }
  if (error) {
    console.error(error);
    return <h1>Error fetching Pokémon data :(</h1>;
  }
  console.log("PokeDB in app: ", pokeDB);
  return (
    <>
      <h1>Pokememory!</h1>
      <div>
        {pokeDB && pokeDB.length > 0 ? (
          <GenerateGrid pokeDB={pokeDB} key={regenGrid} />
        ) : (
          <h2>No Pokémon data available :(</h2>
        )}
      </div>
      <button onClick={updateGrid}>New Pokémon please!</button>
    </>
  );
}

export default App;
