import axios from "axios";
import { PaginationType, PokemonLink } from "./types";
import { RefObject } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

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
export const downloadPokemonDetails = ({
  ref,
  name,
  pokemonImage,
}: {
  ref: RefObject<HTMLDivElement>;
  name: string;
  pokemonImage: string;
}) => {
  const img = new Image();
  img.onload = () => {
    if (!ref.current) {
      return;
    }

    html2canvas(ref.current, {
      // options for testing
      allowTaint: true,
      useCORS: true,
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      pdf.addImage(imgData, "PNG", 0, 0, 210, 297);
      pdf.save(`${name}.pdf`);
    });
  };
  img.src = pokemonImage;
};
