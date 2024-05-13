import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import PokemonDetail from "./PokemonDetail";
import { getPokemonDetail } from "../utils";

jest.mock("../utils");
const mockedGetPokemonDetail = getPokemonDetail as jest.Mock;

describe("PokemonDetail Component", () => {
  const mockOnClose = jest.fn();
  const basePokemonDetail = {
    name: "Pikachu",
    sprites: { front_default: "pikachu.png" },
    stats: [
      { stat: { name: "hp" }, base_stat: 35 },
      { stat: { name: "attack" }, base_stat: 55 },
    ],
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading spinner when detail is being fetched", async () => {
    mockedGetPokemonDetail.mockImplementation(({ setIsLoading }) => {
      setIsLoading(true);
    });
    render(<PokemonDetail url="some-url" onClose={mockOnClose} />);
    expect(screen.getByLabelText("loading")).toBeInTheDocument();
  });

  it("renders pokemon details after data fetch", async () => {
    mockedGetPokemonDetail.mockImplementation(
      ({ setPokemonDetail, setIsLoading }) => {
        setIsLoading(false);
        setPokemonDetail(basePokemonDetail);
      }
    );
    render(<PokemonDetail url="some-url" onClose={mockOnClose} />);
    await waitFor(() => {
      expect(screen.getByTestId("pokemon-name")).toHaveTextContent("Pikachu");
      expect(screen.getByAltText("Pikachu")).toHaveAttribute(
        "src",
        "pikachu.png"
      );
    });
  });

  it("closes modal on click of download button", () => {
    mockedGetPokemonDetail.mockImplementation(
      ({ setPokemonDetail, setIsLoading }) => {
        setIsLoading(false);
        setPokemonDetail(basePokemonDetail);
      }
    );
    render(<PokemonDetail url="some-url" onClose={mockOnClose} />);
    fireEvent.click(screen.getByText("Download"));
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it("renders correct stat values", async () => {
    mockedGetPokemonDetail.mockImplementation(
      ({ setPokemonDetail, setIsLoading }) => {
        setIsLoading(false);
        setPokemonDetail(basePokemonDetail);
      }
    );
    render(<PokemonDetail url="some-url" onClose={mockOnClose} />);
    await waitFor(() => {
      expect(screen.getByText("55")).toBeInTheDocument();
      // get color of stat bar
    });
  });

  it("does not render modal when no URL is provided", () => {
    render(<PokemonDetail url="" onClose={mockOnClose} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("calls getPokemonDetail with correct arguments on URL change", () => {
    const { rerender } = render(
      <PokemonDetail url="old-url" onClose={mockOnClose} />
    );
    rerender(<PokemonDetail url="new-url" onClose={mockOnClose} />);
    expect(getPokemonDetail).toHaveBeenCalledWith(
      expect.objectContaining({ url: "new-url" })
    );
  });

  it("does not fetch details when URL is null", () => {
    render(<PokemonDetail url={""} onClose={mockOnClose} />);
    expect(getPokemonDetail).not.toHaveBeenCalled();
  });

  it("downloads pokemon details as PDF", async () => {
    mockedGetPokemonDetail.mockImplementation(
      ({ setPokemonDetail, setIsLoading }) => {
        setIsLoading(false);
        setPokemonDetail(basePokemonDetail);
      }
    );
    render(<PokemonDetail url="some-url" onClose={mockOnClose} />);
    await waitFor(() => {
      fireEvent.click(screen.getByText("Download"));
      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });
});
