// Component for generating the Pokemon grid
import { useState, useEffect } from "react";
import { useGameState } from "./GameState";

const GenerateGrid = ({ pokeDB }) => {
  const [pokemon, setPokemon] = useState([]);
  const [unown, setUnown] = useState([]);
  const [scrambledPokeList, setScrambledPokeList] = useState([]);
  const [activeCardIndex1, setActiveCardIndex1] = useState(null);
  const [activeCardIndex2, setActiveCardIndex2] = useState(null);
  const [activeCardPokemon1, setActiveCardPokemon1] = useState(null);
  const [activeCardPokemon2, setActiveCardPokemon2] = useState(null);
  const [correctGuessesRed, setCorrectGuessesRed] = useState([]);
  const [correctGuessesBlue, setCorrectGuessesBlue] = useState([]);
  const { gameState, switchTurn, updateScore, resetGame } = useGameState();
  const gridSize = 6;

  const cache = {};

  // Fetch 6 random pokemon for the game
  const fetchRandomPokes = async () => {
    if (!pokeDB || pokeDB.length === 0) {
      console.error("No DB found.");
      return;
    }

    const pokemonList = [];
    const indices = new Set();

    while (pokemonList.length < gridSize) {
      const index = Math.floor(Math.random() * pokeDB.length);
      if (!indices.has(index)) {
        indices.add(index);
        const pokeUrl = pokeDB[index].url;

        // Poke in cache?
        if (cache[pokeUrl]) {
          pokemonList.push(pokeUrl);
        } else {
          try {
            const response = await fetch(pokeDB[index].url);
            const pokemonData = await response.json();
            pokemonList.push(pokemonData);
          } catch (error) {
            console.error("Error fetching Pokémon: ", error);
          }
        }
      }
    }
    setPokemon(pokemonList);
  };

  useEffect(() => {
    fetchRandomPokes();
  }, [pokeDB]);

  // Scramble and double the randomized-pokemon to generate the card order for the memory game
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

  // Fetch unkowns for the "backsides" of the cards
  useEffect(() => {
    const fetchUnkowns = async () => {
      var unowns = [];
      for (let i = 1; i <= gridSize * 2; i++) {
        try {
          const response = await fetch(
            `https://pokeapi.co/api/v2/pokemon-form/${10000 + i}`,
          );
          if (!response.ok) {
            throw new Error("Network response was not OK");
          }
          const data = await response.json();
          unowns.push(data.sprites.front_default);
        } catch (error) {
          console.log("Error when fetching Unown", error);
        }
      }
      for (let i = unowns.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [unowns[i], unowns[j]] = [unowns[j], unowns[i]];
      }
      setUnown(unowns);
    };
    fetchUnkowns();
  }, []);

  // This is gonna be a beast
  const selectCard = (index, poke) => {
    if (
      correctGuessesRed.includes(index) ||
      correctGuessesBlue.includes(index)
    ) {
      console.log("It's already taken dumbass!");
      return;
    }
    // Nothing is selected -> set 1st card
    if (activeCardIndex1 === null) {
      setActiveCardIndex1(index);
      setActiveCardPokemon1(poke);
    }
    // Remove 1st card if clicked again
    else if (activeCardIndex1 === index) {
      // Maybe do some funny animation here
      console.log("You clicked the same card again stupid", index);
    }
    // Select 2nd card
    else {
      setActiveCardPokemon2(poke);
      setActiveCardIndex2(index);
    }
  };

  // Check for a match
  useEffect(() => {
    if (activeCardPokemon1 && activeCardPokemon2) {
      if (activeCardPokemon1 === activeCardPokemon2) {
        console.log("Parabenz! Score for player ", gameState.currentPlayer);
        gameState.score[gameState.currentPlayer]++;
        if (gameState.currentPlayer === "red") {
          setCorrectGuessesRed((prev) => [
            ...prev,
            activeCardIndex1,
            activeCardIndex2,
          ]);
        } else {
          setCorrectGuessesBlue((prev) => [
            ...prev,
            activeCardIndex1,
            activeCardIndex2,
          ]);
        }
      }
      const timeout = setTimeout(() => {
        deselectCards();
      }, 1800);
      return () => clearTimeout(timeout);
    }
  }, [activeCardPokemon1, activeCardPokemon2]);

  const deselectCards = () => {
    console.log(activeCardPokemon1, activeCardPokemon2);
    setActiveCardIndex1(null);
    setActiveCardIndex2(null);
    setActiveCardPokemon1(null);
    setActiveCardPokemon2(null);
    switchTurn();
  };

  const setCardClassName = (index) => {
    if (correctGuessesBlue.includes(index)) {
      return "card blue";
    }
    if (correctGuessesRed.includes(index)) {
      return "card red";
    }
    if (index === activeCardIndex1) {
      return "card active";
    }
    if (index === activeCardIndex2) {
      return "card active";
    } else {
      return "card";
    }
  };

  return (
    <div className="pokemon-grid-container">
      {scrambledPokeList.map((poke, index) => (
        <div
          key={`${poke.name}-${index}`}
          id={poke.name}
          className={setCardClassName(index)}
          onClick={() => selectCard(index, poke.name)}
        >
          <h3>
            {activeCardIndex1 === index || activeCardIndex2 === index
              ? poke.name
              : "???"}
          </h3>
          <img
            src={
              activeCardIndex1 === index || activeCardIndex2 === index
                ? poke.sprites.front_default
                : unown[index]
            }
            alt={poke.name}
          />
        </div>
      ))}
    </div>
  );
};

export default GenerateGrid;
