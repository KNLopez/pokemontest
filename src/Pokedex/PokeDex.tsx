import { useState, useEffect } from "react";
import PokemonDetail from "./PokemonDetail";
import { PaginationType, PokemonLink } from "../types";
import Loader from "../components/Loader";
import "./Pokedex.css";
import { getPokemonPage } from "../utils";
import Pagination from "../components/Pagination";
import { useParams } from "react-router-dom";

const POKEMON_URL = "https://pokeapi.co/api/v2/pokemon";
let debounceTimeout: NodeJS.Timeout | null = null;

function PokeDex() {
  const params = useParams<{ id: string }>();
  const pageIndex = parseInt(params.id) - 1 < 0 ? 0 : parseInt(params.id) - 1;

  const [pokemons, setPokemons] = useState<PokemonLink[]>([]);
  const [pagingation, setPagingation] = useState<PaginationType>({
    count: 0,
    next: "",
    previous: "",
    offset: 0,
    limit: 20,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [pokemon, setPokemon] = useState<PokemonLink | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      getPokemonPage({
        url: `${POKEMON_URL}?offset=${pageIndex * +pagingation.limit}&limit=${
          pagingation.limit
        }`,
        setPokemons,
        setPagingation,
        setIsLoading,
      });
    };
    fetchData();
  }, [params, pageIndex, pagingation.limit]);

  const handleKeyUp = (
    e: React.KeyboardEvent<HTMLInputElement> & { target: { value: string } }
  ) => {
    setSearch(e.target.value);
    if (debounceTimeout) clearTimeout(debounceTimeout);
    if (!e.target || !e.target.value) return;

    debounceTimeout = setTimeout(() => {
      setIsLoading(true);
      const fetchData = async () => {
        // we want to search the whole list of pokemons
        // a better approach would be to have the search params in the url
        getPokemonPage({
          url: `${POKEMON_URL}?offset=${0}&limit=${1302}`,
          setPokemons,
          setPagingation,
          setIsLoading,
        });
      };
      fetchData();
    }, 1000);
  };

  const filteredPokemons = pokemons.filter((pokemon) =>
    pokemon.name.includes(search)
  );

  return (
    <div className="App">
      <div className="App-container">
        {isLoading ? (
          <>
            <Loader />
          </>
        ) : (
          <>
            <div>
              <h1>Welcome to pokedex !</h1>
              <input
                type="text"
                onKeyUp={handleKeyUp}
                defaultValue={search}
                placeholder="Search Pokemon"
                className="search"
              />
            </div>
            <div className="pokemon-list" data-testid="pokemon-list">
              {filteredPokemons.map((pokemon: PokemonLink) => (
                <div
                  key={pokemon.name}
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setPokemon(pokemon);
                  }}
                  className="pokemon"
                >
                  <img
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
                      pokemon.url.split("/")[pokemon.url.split("/").length - 2]
                    }.png`}
                    alt=""
                  />
                  {pokemon.name}
                </div>
              ))}
            </div>
            {filteredPokemons.length >= 20 && (
              <Pagination
                limit={pagingation.limit}
                count={pagingation.count}
                key={pageIndex}
                currentPage={pageIndex + 1}
                showPrevious={!!pagingation.previous}
                showNext={!!pagingation.next}
              />
            )}
          </>
        )}
      </div>
      {pokemon && (
        <PokemonDetail
          key={pokemon.name}
          url={pokemon.url}
          onClose={() => setPokemon(null)}
        />
      )}
    </div>
  );
}

export default PokeDex;
