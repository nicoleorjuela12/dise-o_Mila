import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Index from './paginas/InicioCliente';
import BarraNormal from "./componentes/barras/Barra_Normal";
import Footer from './Footer/footer';
import FormularioRegistro from './componentes/cliente/RegistroCliente';

function App() {
  return (
    <Router>
      <BarraNormal/>
      <Routes>
        {/* Define una ruta para mostrar los blogs */}
        <Route path='/' element={<Index />} />
        <Route path='/Footer' element={<Footer />} />
        <Route path="/RegistroCliente" element={<FormularioRegistro />} />
      </Routes>
    </Router>
  );
}

export default App;
