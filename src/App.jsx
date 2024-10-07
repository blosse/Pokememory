import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [pokeDb, setPokeDb] = useState(null);
  const [pokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPokeDb = async () => {
    try {
      const response = await fetch(
        "https://pokeapi.co/api/v2/pokemon?limit=151",
      );
      const data = await response.json();
      setPokeDb(data);
      setLoading(false);
    } catch (error) {
      console.log("Error fetching Pokémon DB: ", error);
    }
  };

  const fetchRandomPokes = async () => {
    var pokemonList = [];
    var pokemon = null;
    if (!pokeDb) return;
    while (pokemonList.length < 18) {
      const index = Math.floor(Math.random() * 151);
      try {
        const response = await fetch(pokeDb.results[index].url);
        pokemon = await response.json();
        pokemonList.push(pokemon);
      } catch (error) {
        console.error("Error fetching Pokémon: ", error);
      }
    }
    setPokemon(pokemonList);
  };

  const createPokeGrid = () => {
    if (loading) {
      return <div>Loading...</div>;
    }
    return (
      <div className="pokemon-grid-container">
        {pokemon.map((poke) => (
          <div key={poke.name} className="card">
            <h3>{poke.name}</h3>
            <img src={poke.sprites.front_default} alt={poke.name} />
          </div>
        ))}
      </div>
    );
  };

  // Fetch list of Pokémon from PokeAPI
  useEffect(() => {
    fetchPokeDb();
  }, []);

  return (
    <>
      <h1>Pokememory!</h1>
      <button onClick={fetchRandomPokes}>Show me a Pokémon!</button>
      <div>{createPokeGrid()}</div>
    </>
  );
}

export default App;
