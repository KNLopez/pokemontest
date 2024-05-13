import React from "react";
import "./App.css";
import { useState } from "react";
import { NavLink } from "react-router-dom";

function Home() {
  const [text, setText] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const isReady = text === "Ready!";
  const showError = text !== "" && !isReady;

  return (
    <div className="App">
      <div className="App-container">
        <div>
          <NavLink to="/pokedex">
            <img
              hidden={!isReady}
              src="https://www.freeiconspng.com/uploads/file-pokeball-png-0.png"
              className="App-logo"
              alt="logo"
            />
          </NavLink>
          <p>Are you ready to be a pokemon master?</p>
          <input
            type="text"
            name="name"
            onChange={handleChange}
            placeholder="Type in Ready!"
          />
          {showError && (
            <span style={{ color: "red" }}>I am not ready yet!</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
