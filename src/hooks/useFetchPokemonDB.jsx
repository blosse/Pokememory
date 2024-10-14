import { useState, useEffect } from "react";

// Hook for fetching the Pokedex from PokeAPI

const useFetchPokemonDB = () => {
  const [pokeDB, setPokeDB] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://pokeapi.co/api/v2/pokemon?limit=151",
        );
        if (!response.ok) {
          throw new Error("Network response was not OK");
        }
        const data = await response.json();
        console.log("fetched data:", data.results);
        setPokeDB(data.results);
      } catch (error) {
        console.log("Error when fetching pokeDB:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  return { pokeDB, loading, error };
};

export default useFetchPokemonDB;
