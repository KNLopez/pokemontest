import axios from "axios";
import { PaginationType, PokemonLink } from "./types";

export const getPokemonPage = async ({
  url,
  setPokemons,
  setPagingation,
  setIsLoading,
}: {
  url: string;
  setPokemons: React.Dispatch<React.SetStateAction<PokemonLink[]>>;
  setPagingation: React.Dispatch<React.SetStateAction<PaginationType>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  try {
    axios.get(url).then((response) => {
      const offset = response.data.next?.split("offset=")[1].split("&")[0];
      const limit = 20;
      setPokemons(response.data.results);
      setPagingation({
        count: response.data.count,
        next: response.data.next,
        previous: response.data.previous,
        offset,
        limit,
      });
    });
  } catch (error) {
    console.log(error);
  } finally {
    setIsLoading(false);
  }
};

export const getPokemonDetail = async ({
  url,
  setPokemonDetail,
  setIsLoading,
}: {
  url: string;
  setPokemonDetail: React.Dispatch<React.SetStateAction<any>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  try {
    setIsLoading(true);
    axios.get(url).then((response) => {
      setPokemonDetail(response.data);
      setIsLoading(false);
    });
  } catch (error) {
    console.log(error);
  }
};
