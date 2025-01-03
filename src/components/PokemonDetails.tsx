import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Loader from "./Loader";

interface PokemonDetails {
  name: string;
  sprites: {
    front_default: string;
  };
  types: { type: { name: string } }[];
  abilities: { ability: { name: string } }[];
  stats: { base_stat: number; stat: { name: string } }[];
  moves: { move: { name: string } }[];
}

const PokemonDetails: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const [pokemon, setPokemon] = useState<PokemonDetails | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
      .then((response) => response.json())
      .then((data) => setPokemon(data));
    setLoading(false);
  }, [id]);

  if (!pokemon) return <p>Loading...</p>;

  return (
    <>
      {/* Loading Indicator */}
      {loading && <Loader />}

      <div className="container mx-auto">
        <Link to="/" className="text-green-500 hover:underline mb-4 block">
          ← Back
        </Link>
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Breadcrumb */}
          <nav className="text-sm text-gray-500 mb-6">
            <Link to="/" className="text-blue-500 hover:underline">
              Home
            </Link>{" "}
            &gt;{" "}
            <Link to="/" className="text-blue-500 hover:underline">
              Pokémon List
            </Link>{" "}
            &gt; <span className="capitalize">{pokemon.name}</span>
          </nav>
          <div className="text-center">
            <img
              src={pokemon.sprites.front_default}
              alt={pokemon.name}
              className="mx-auto w-40 h-40"
            />
          </div>
          <div className="bg-orange-300 p-4 mt-4 rounded-lg">
            <p>
              <strong>Name:</strong> {pokemon.name}
            </p>
            <p>
              <strong>Type:</strong>{" "}
              {pokemon.types.map((type) => type.type.name).join(", ")}
            </p>
            <p>
              <strong>Stats:</strong>{" "}
              {pokemon.stats
                .map((stat) => `${stat.stat.name}: ${stat.base_stat}`)
                .join(", ")}
            </p>
            <p>
              <strong>Abilities:</strong>{" "}
              {pokemon.abilities
                .map((ability) => ability.ability.name)
                .join(", ")}
            </p>

            <p>
              <strong>Moves:</strong>{" "}
              {pokemon.moves
                .slice(0, 5)
                .map((move) => move.move.name)
                .join(", ")}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default PokemonDetails;
