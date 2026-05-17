import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Encabezado from "./components/layout/Encabezado";
import Dashboard from "./views/Dashboard";
import Login from "./views/Login";
import Registro from "./views/Registro";
import Juegos from "./views/Juegos";
import Encuestas from "./views/Encuestas";
import Retos from "./views/Retos";
import Ranking from "./views/Ranking";
import AdminPanel from "./views/AdminPanel";
import RutaProtegida from "./components/rutas/RutaProtegida";
import Pagina404 from "./views/Pagina404";

import "./App.css";

const App = () => {
  useEffect(() => {
    document.title = "NewMe - Salud Bucal";
  }, []);

  return (
    <Router>
      <Encabezado />
      
      <main className="container mt-4">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          
          <Route path="/" element={<RutaProtegida><Dashboard /></RutaProtegida>} />
          <Route path="/juegos" element={<RutaProtegida><Juegos /></RutaProtegida>} />
          <Route path="/encuestas" element={<RutaProtegida><Encuestas /></RutaProtegida>} />
          <Route path="/retos" element={<RutaProtegida><Retos /></RutaProtegida>} />
          <Route path="/ranking" element={<RutaProtegida><Ranking /></RutaProtegida>} />
          <Route path="/admin" element={<RutaProtegida><AdminPanel /></RutaProtegida>} />
          
          <Route path="*" element={<Pagina404 />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
