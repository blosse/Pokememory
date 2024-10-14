// Component for generating the Pokemon grid
import { useState, useEffect } from "react";

const GenerateGrid = ({ pokeDB }) => {
  const [pokemon, setPokemon] = useState([]);
  const [scrambledPokeList, setScrambledPokeList] = useState([]);
  const [activeCardIndex, setActiveCardIndex] = useState(null);

  useEffect(() => {
    const fetchRandomPokes = async () => {
      if (!pokeDB || pokeDB.length === 0) {
        console.error("No DB found.");
        return;
      }

      const pokemonList = [];
      const indices = new Set();

      while (pokemonList.length < 6) {
        const index = Math.floor(Math.random() * pokeDB.length);
        if (!indices.has(index)) {
          indices.add(index);
          try {
            const response = await fetch(pokeDB[index].url);
            const pokemonData = await response.json();
            pokemonList.push(pokemonData);
          } catch (error) {
            console.error("Error fetching Pokémon: ", error);
          }
        }
      }
      setPokemon(pokemonList);
    };

    fetchRandomPokes();
  }, [pokeDB]);

  useEffect(() => {
    if (pokemon.length > 0) {
      const intermediate = [];
      pokemon.forEach((poke) => {
        intermediate.push(poke, poke);
      });
      for (let i = intermediate.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [intermediate[i], intermediate[j]] = [intermediate[j], intermediate[i]];
      }
      setScrambledPokeList(intermediate);
    }
  }, [pokemon]);

  const selectCard = (index) => {
    if (activeCardIndex === index) {
      setActiveCardIndex(null);
    } else {
      setActiveCardIndex(index);
    }
  };

  return (
    <div className="pokemon-grid-container">
      {scrambledPokeList.map((poke, index) => (
        <div
          key={`${poke.name}-${index}`}
          className={`card ${activeCardIndex === index ? "active" : ""}`}
          onClick={() => selectCard(index)}
        >
          <h3>{poke.name}</h3>
          <img src={poke.sprites.front_default} alt={poke.name} />
        </div>
      ))}
    </div>
  );
};

export default GenerateGrid;
