import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PokemonList from "./components/PokemonList";
import PokemonDetails from "./components/PokemonDetails";

const App: React.FC = () => {
  return (
    <Router>
      <div className="bg-gray-100 min-h-screen p-6">
        <Routes>
          <Route path="/" element={<PokemonList />} />
          <Route path="/pokemon/:id" element={<PokemonDetails />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
