import { render, fireEvent } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import Pagination from "./Pagination";

test("renders Pagination and checks navigation", () => {
  const history = createMemoryHistory();
  const { getByText, getByRole } = render(
    <Router history={history}>
      <Pagination
        limit={10}
        count={100}
        currentPage={1}
        showPrevious={false}
        showNext={true}
      />
    </Router>
  );

  // Check if Next link navigates to correct page
  fireEvent.click(getByText("Next"));
  expect(history.location.pathname).toBe("/pokedex/2");

  // Check if input field changes the page
  const input = getByRole("textbox");
  fireEvent.keyUp(input, { key: "Enter", target: { value: "5" } });
  expect(history.location.pathname).toBe("/pokedex/5");
});
