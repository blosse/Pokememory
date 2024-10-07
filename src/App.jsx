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

  // Fetch list of Pokémon from PokeAPI
  useEffect(() => {
    fetchPokeDb();
  }, []);

  const fetchRandomPokes = async () => {
    if (!pokeDb) return;

    const pokemonList = [];
    const indices = new Set();

    while (pokemonList.length < 12) {
      const index = Math.floor(Math.random() * 151);
      if (!indices.has(index)) {
        try {
          const response = await fetch(pokeDb.results[index].url);
          const pokemonData = await response.json();
          pokemonList.push(pokemonData);
        } catch (error) {
          console.error("Error fetching Pokémon: ", error);
        }
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

  return (
    <>
      <h1>Pokememory!</h1>
      <button onClick={fetchRandomPokes}>Show me Pokémon!</button>
      <div>{createPokeGrid()}</div>
    </>
  );
}

export default App;
