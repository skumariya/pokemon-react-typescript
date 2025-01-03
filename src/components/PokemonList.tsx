import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
import Loader from "./Loader";
import Card from "./Card";

interface Pokemon {
  name: string;
  url: string;
  id: number;
  image: string;
}

interface PokemonType {
  name: string;
  url: string;
}

const PokemonList: React.FC = () => {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [filteredPokemon, setFilteredPokemon] = useState<Pokemon[]>([]);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [types, setTypes] = useState<PokemonType[]>([]);
  const [offset, setOffset] = useState(3);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchPokemon = async (limit = 3) => {
    setLoading(true);
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`
    );
    const data = await response.json();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pokemonWithImages = data.results.map((poke: any, index: number) => {
      const id = offset + index + 1;
      return {
        ...poke,
        id,
        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
      };
    });

    setPokemon((prev) => [...prev, ...pokemonWithImages]);
    setFilteredPokemon((prev) => [...prev, ...pokemonWithImages]);
    setHasMore(data.next !== null);
    setLoading(false);
  };

  const fetchTypes = async () => {
    const response = await fetch(`https://pokeapi.co/api/v2/type`);
    const data = await response.json();
    setTypes(data.results);
  };

  useEffect(() => {
    fetchPokemon(3);
    fetchTypes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadMorePokemon = () => {
    if (!loading && hasMore) {
      setOffset((prevOffset) => prevOffset + 20);
    }
  };

  useEffect(() => {
    if (offset > 0) {
      fetchPokemon();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offset]);

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 200 &&
      !loading &&
      hasMore
    ) {
      loadMorePokemon();
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [loading, hasMore]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    filterPokemon(value, selectedType);
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedType(value);
    filterPokemon(search, value);
  };

  const filterPokemon = async (searchTerm: string, type: string) => {
    let filtered = pokemon.filter((poke) =>
      poke.name.toLowerCase().includes(searchTerm)
    );

    if (type) {
      const response = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
      const data = await response.json();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const typePokemon = data.pokemon.map((p: any) => p.pokemon.name);
      filtered = filtered.filter((poke) => typePokemon.includes(poke.name));
    }

    setFilteredPokemon(filtered);
  };

  return (
    <div className="container mx-auto px-4">
      {/* Filters */}

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        {/* Type Selector */}
        <select
          value={selectedType}
          onChange={handleTypeChange}
          className="w-full md:w-auto px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
        >
          <option value="">All Types</option>
          {types.map((type, index) => (
            <option key={index} value={type.name}>
              {type.name.charAt(0).toUpperCase() + type.name.slice(1)}
            </option>
          ))}
        </select>
        {/* Search Input */}
        <input
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="Search Pokémon"
          className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
        />
      </div>

      {/* Pokémon Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
        {filteredPokemon.map((poke) => (
          <Card
            key={poke.id}
            name={poke.name}
            image={poke.image}
            detailsLink={`/pokemon/${poke.id}`}
          />
        ))}
      </div>

      {/* Loading Indicator */}
      {loading && <Loader />}

      {/* End of List Message */}
      {!hasMore && !loading && filteredPokemon.length === pokemon.length && (
        <div className="text-center mt-6">
          <p className="text-gray-600">You've caught them all!</p>
        </div>
      )}

      {/* No Results Found */}
      {!loading && filteredPokemon.length === 0 && (
        <div className="text-center mt-6">
          <p className="text-gray-600">No Pokémon found.</p>
        </div>
      )}
    </div>
  );
};

export default PokemonList;
