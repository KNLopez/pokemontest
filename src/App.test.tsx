import { act, render, screen } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { MemoryRouter, Router } from "react-router-dom";
import App from "./App";

jest.mock("./Home", () => () => <div>Home</div>);
jest.mock("./Pokedex/PokeDex", () => () => <div>PokeDex</div>);

test("renders App", () => {
  const history = createMemoryHistory();
  render(
    <Router history={history}>
      <App />
    </Router>
  );
});

test("renders Home component on root path", () => {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <App />
    </MemoryRouter>
  );
  expect(screen.getByText(/Home/i)).toBeInTheDocument();
});
