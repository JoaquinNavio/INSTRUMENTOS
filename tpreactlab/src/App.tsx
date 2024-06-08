import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Nav from './components/Nav';
import DondeEstamos from './components/DondeEstamos/DondeEstamos';
import Instrumento from './components/Instrumento/instrumento';
import Detalle from "./components/Detalle/Detalle";
import Editar from "./components/Editar/Editar";
import AñadirInstrumento from "./components/AñadirInstrumento/AñadirInstrumento";
import Home from "./components/Home/Home";
import { useState } from "react";
import Carrito from "./components/Carrito/Carrito";
import './App.css';
import Login from "./components/Login/Login";
import { RutaPrivada } from "./assets/controlAcceso/RutaPrivada";
import RolUsuario from "./assets/controlAcceso/RolUsuario";
import Charts from "./components/Charts/Charts";

const AppContent = ({ carrito, setCarrito }) => {
  const location = useLocation();
  return (
    <>
      {location.pathname !== '/login' && (
        <div className="nav-container">
          <Nav />
          {carrito.length > 0 && <Carrito carrito={carrito} setCarrito={setCarrito}/>}
        </div>
      )}
      <div className="content-container">
        <Routes>
          <Route path='/login' element={<Login setCarrito={setCarrito} />} />
          <Route path="/" element={<Home />} />
          <Route path="/DondeEstamos" element={<DondeEstamos />} />
          <Route path="/Instrumentos" element={<RutaPrivada><Instrumento carrito={carrito} setCarrito={setCarrito} /> </RutaPrivada>} />
          <Route path='/Detalle/:id' element={<RutaPrivada><Detalle carrito={carrito} setCarrito={setCarrito} /></RutaPrivada>} />
          

          <Route element={<RolUsuario rol={"admin"} />}>
            <Route path="/Editar/:id" element={<Editar />} />
        </Route>
          <Route element={<RolUsuario rol={"admin"} />}>
            <Route path="/Añadir" element={<AñadirInstrumento />} />
        </Route>
        <Route element={<RolUsuario rol={"admin"} />}>
            <Route path="/charts" element={<Charts></Charts>} />
        </Route>
        </Routes>
      </div>
    </>
  );
};

function App() {
  const [carrito, setCarrito] = useState([]);

  return (
    <Router>
      <div className="app-container">
        <AppContent carrito={carrito} setCarrito={setCarrito} />
      </div>
    </Router>
  );
}

export default App;
