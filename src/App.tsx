import "./App.css";
import Home from "./Home";
import { Route, BrowserRouter, Redirect } from "react-router-dom";
import PokeDex from "./Pokedex/PokeDex";

function App() {
  return (
    <BrowserRouter>
      <Route exact path="/" component={Home} />
      <Route
        exact
        path="/pokedex"
        render={() => <Redirect to="/pokedex/1" />}
      />
      <Route exact path="/pokedex/:id" component={PokeDex} />
    </BrowserRouter>
  );
}

export default App;
