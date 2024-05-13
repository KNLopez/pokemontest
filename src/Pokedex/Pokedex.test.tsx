import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route } from "react-router-dom";
import PokeDex from "./PokeDex";
import * as utils from "../utils";

jest.mock("../utils", () => ({
  getPokemonPage: jest.fn(),
  getPokemonDetail: jest.fn(),
}));

describe("PokeDex Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (utils.getPokemonPage as jest.Mock).mockImplementation(
      ({ setPokemons, setPagingation, setIsLoading }) => {
        setPokemons([
          { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" },
        ]);
        setPagingation({
          count: 100,
          next: "",
          previous: "",
          offset: 0,
          limit: 20,
        });
        setIsLoading(false);
      }
    );
  });

  test("renders pokedex title and pagination components", async () => {
    render(
      <MemoryRouter initialEntries={["/1"]}>
        <Route path="/:id">
          <PokeDex />
        </Route>
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText(/welcome to pokedex !/i)).toBeInTheDocument();
      expect(screen.getByTestId("pokemon-list")).toBeInTheDocument();
    });
  });

  test("search functionality filters pokemon list as expected", async () => {
    render(
      <MemoryRouter initialEntries={["/1"]}>
        <Route path="/:id">
          <PokeDex />
        </Route>
      </MemoryRouter>
    );

    const searchInput = await screen.findByPlaceholderText(/search pokemon/i);
    userEvent.type(searchInput, "bulba");

    await waitFor(() => {
      expect(screen.getByText("bulbasaur")).toBeInTheDocument();
    });
  });

  test("no results for incorrect pokemon name in search", async () => {
    render(
      <MemoryRouter initialEntries={["/1"]}>
        <Route path="/:id">
          <PokeDex />
        </Route>
      </MemoryRouter>
    );

    const searchInput = await screen.findByPlaceholderText(/search pokemon/i);
    userEvent.type(searchInput, "unknownPokemon");

    await waitFor(() => {
      expect(screen.queryByText("bulbasaur")).not.toBeInTheDocument();
    });
  });

  test("details of clicked pokemon is displayed", async () => {
    render(
      <MemoryRouter initialEntries={["/1"]}>
        <Route path="/:id">
          <PokeDex />
        </Route>
      </MemoryRouter>
    );

    // Click on the pokemon
    const pokemon = await screen.queryByText("bulbasaur");

    fireEvent.click(pokemon as HTMLElement);
    (utils.getPokemonDetail as jest.Mock).mockImplementation();

    // check if modal is open
    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
  });

  test("handles lack of id param gracefully with default pageIndex", async () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Route path="/:id?">
          <PokeDex />
        </Route>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("bulbasaur")).toBeInTheDocument(); // Default loaded page
    });
  });
});
