import { render } from "@testing-library/react";
import Loader from "./Loader";

test("renders Loader with correct image", () => {
  const { getByAltText } = render(<Loader />);
  const img = getByAltText("loading");
  expect(img).toBeInTheDocument();
  expect(img).toHaveAttribute(
    "src",
    "https://www.freeiconspng.com/uploads/file-pokeball-png-0.png"
  );
  expect(img).toHaveAttribute("class", "App-logo");
});
