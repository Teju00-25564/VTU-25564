import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders registration page", () => {
  render(<App />);
  const headingElement = screen.getByText(/registration/i);
  expect(headingElement).toBeInTheDocument();
});
