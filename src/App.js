import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Index from './paginas/InicioCliente';
import BarraNormal from "./componentes/barras/Barra_Normal";
import Footer from './Footer/footer';
import FormularioRegistro from './componentes/cliente/RegistroCliente';
import Login from './componentes/login';
import BarraCliente from "./componentes/barras/BarraCliente"
import Index1 from './paginas/dashboard-cliente';
function App() {
  return (
    <Router>
      <BarraNormal/>
      <Routes>
        {/* Define una ruta para mostrar los blogs */}
        <Route path='/' element={<Index />} />
        <Route path='/Footer' element={<Footer />} />
        <Route path="/RegistroCliente" element={<FormularioRegistro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/BarraCliente" element={<BarraCliente />} />
        <Route path="/DashboardCliente" element={<Index1 />} />

      </Routes>
    </Router>
  );
}

export default App;
