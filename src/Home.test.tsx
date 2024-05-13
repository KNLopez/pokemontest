import { fireEvent, render, screen } from "@testing-library/react";
import Home from "./Home";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";

describe("Home Component", () => {
  test("renders Home component", () => {
    const history = createMemoryHistory();

    render(
      <Router history={history}>
        <Home />
      </Router>
    );
    const linkElement = screen.getByText(
      /Are you ready to be a pokemon master?/i
    );
    expect(linkElement).toBeInTheDocument();

    const img = screen.getByAltText("logo");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute(
      "src",
      "https://www.freeiconspng.com/uploads/file-pokeball-png-0.png"
    );
    expect(img).toHaveAttribute("class", "App-logo");
    expect(img).not.toBeVisible();
  });

  test("Check form validation on home component", () => {
    const history = createMemoryHistory();

    render(
      <Router history={history}>
        <Home />
      </Router>
    );

    // get input by name
    const input = screen.getByPlaceholderText(/Type in Ready!/i);
    expect(input).toBeInTheDocument();

    const errorMessage = screen.queryByText(/I am not ready yet!/i);
    expect(errorMessage).not.toBeInTheDocument();

    input.focus();
    //
    fireEvent.change(input, { target: { value: "Not Ready" } });
    input.blur();

    const errorVisible = screen.queryByText(/I am not ready yet!/i);
    expect(errorVisible).toBeInTheDocument();

    input.focus();
    fireEvent.change(input, { target: { value: "Ready!" } });
    input.blur();

    const errorHidden = screen.queryByText(/I am not ready yet!/i);
    expect(errorHidden).not.toBeInTheDocument();

    // image should be visible
    const img = screen.getByAltText("logo");
    expect(img).toBeVisible();

    // click on image
    fireEvent.click(img);
    expect(history.location.pathname).toBe("/pokedex");
  });
});
