import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [pokeDb, setPokeDb] = useState(null);
  const [pokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scrambledPokeList, setScrambledPokeList] = useState([]);

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
    if (!pokeDb) return console.error("No DB found.");
    console.log("There should be a DB?");
    const pokemonList = [];
    const indices = new Set();

    while (pokemonList.length < 6) {
      const index = Math.floor(Math.random() * 151);
      if (!indices.has(index)) {
        indices.add(index);
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

  // Fetch list of Pokémon from PokeAPI
  useEffect(() => {
    fetchPokeDb();
  }, []);

  useEffect(() => {
    setPokemon([]);
    if (pokemon.length > 0) {
      var intermediate = new Array();
      pokemon.forEach((poke) => {
        if (intermediate.length == 0) {
          intermediate.push(poke);
          intermediate.push(poke);
        } else {
          var index = Math.floor(Math.random() * intermediate.length);
          intermediate = [
            ...intermediate.slice(0, index),
            poke,
            ...intermediate.slice(index),
          ];
          index = Math.floor(Math.random() * intermediate.length);
          intermediate = [
            ...intermediate.slice(0, index),
            poke,
            ...intermediate.slice(index),
          ];
        }
      });
      setScrambledPokeList([...intermediate]);
    }
  }, [pokemon]);

  const createPokeGrid = () => {
    if (loading) {
      return <div>Loading...</div>;
    }

    return (
      <div className="pokemon-grid-container">
        {scrambledPokeList.map((poke, index) => (
          <div key={`${poke.name}-${index}`} className="card">
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
