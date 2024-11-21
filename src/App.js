import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect, useContext } from 'react';
import { PrivateRoute } from './context/privaterouter';
import './App.css';
import { UserProvider, UserContext } from './context/UserContext';
import Index from './paginas/InicioCliente';
import BarraNormal from "./componentes/barras/Barra_Normal";
import Footer from './Footer/footer';
import FormularioRegistro from './componentes/cliente/RegistroCliente';
import Login from './componentes/login';
import Index1 from './paginas/dashboard-cliente';
import PerfilUsuario from './componentes/cliente/perfilusuario';
import DashboardAdmin from './paginas/dashboard-administrador';
import BarraAdmin from './componentes/barras/BarraAdministrador';
import BarraCliente from './componentes/barras/BarraCliente';
import RegistroProductos from './componentes/administrador/Productos/RegistrarProductos'
import GestionProductos from './componentes/administrador/Productos/GestionProductos'
import ReservaMesa from "./componentes/cliente/reservas/InicioReservaMesa"
import ReservaLocal from "./componentes/cliente/reservas/reservalocal"
import MisReservas from './componentes/cliente/reservas/reservascliente';
import GestionReservaMesa from './componentes/administrador/reservas/GestionReservasAdmin';
import EditarProductos from './componentes/administrador/Productos/EditarProductos';
import ProductosCliente from './componentes/cliente/Productos/productos';
import Carrito from './componentes/cliente/Pedidos/Carrito';
import FormularioRegiEmp from './componentes/administrador/usuarios/registroempleados';
import ConsultaUsuarios from './componentes/administrador/usuarios/consultausarios';
import DetallesPedido from "./componentes/cliente/Pedidos/DetallesPedido"
import Pedido from './componentes/cliente/Pedidos/verpedido';
import DashboardMesero from './paginas/dashboard-mesero';
import BarraMesero from './componentes/barras/Barra_Mesero';
import GestionPedidos from './componentes/mesero/gestionPedidos';

function App() {
    return (
        <UserProvider>
            <Router>
                <MainContent />
            </Router>
        </UserProvider>
    );
}

const MainContent = () => {
    const { setRole } = useContext(UserContext);
    const location = useLocation(); // Obtiene la ubicación actual

    useEffect(() => {
        const storedRole = localStorage.getItem('rol');
        if (storedRole) {
            setRole(storedRole); // Establece el rol en el contexto si existe
        }
    }, [setRole]);

    const rol = localStorage.getItem('rol');

    // Determina qué barra de navegación mostrar
    const renderNavBar = () => {
        if (location.pathname === '/' ||
            location.pathname === '/Footer' ||
            location.pathname === '/RegistroCliente' ||
            location.pathname === '/login') {
            return <BarraNormal />;
        } else if (rol === 'administrador') {
            return <BarraAdmin />;
        } else if (rol === 'Cliente') {
            return <BarraCliente />;
        }
        else if (rol === 'mesero'){
            return <BarraMesero/>
        }
        return null;
    };

    return (
        <>
            {renderNavBar()} {/* Renderiza la barra de navegación correspondiente */}
            <main>
                <Routes>
                    <Route path='/' element={<Index />} />
                    <Route path="/Footer" element={<Footer />} />
                    <Route path="/RegistroCliente" element={<FormularioRegistro />} />
                    <Route path="/productos" element={<ProductosCliente />} />
                    <Route path="/Carrito" element={<Carrito />} />
                    <Route path="/login" element={rol ? <Navigate to="/DashboardCliente" /> : <Login />} />
                    <Route path="/DashboardCliente" element={<PrivateRoute component={Index1} />} />
                    <Route path="/perfilusuario" element={<PrivateRoute component={PerfilUsuario} />} />
                    <Route path="/DashboardAdmin" element={<PrivateRoute component={DashboardAdmin} />} />
                    <Route path="/RegistrarProductos" element={<PrivateRoute component={RegistroProductos} />} />
                    <Route path="/GestionProductos" element={<PrivateRoute component={GestionProductos} />} />
                    <Route path="/ReservaMesa" element={<PrivateRoute component={ReservaMesa} />} />
                    <Route path="/reservalocal" element={<PrivateRoute component={ReservaLocal} />} />
                    <Route path="/ReservasCliente" element={<PrivateRoute component={MisReservas}/>}/>
                    <Route path="/GestionReservasAdmin" element={<PrivateRoute component={GestionReservaMesa}/>}/>
                    <Route path="/EditarProductos/:id_producto" element={<PrivateRoute component={EditarProductos}/>}/>
                    <Route path="/registroempleados" element={<PrivateRoute component={FormularioRegiEmp}/>}/>
                    <Route path="/consultausarios" element={<PrivateRoute component={ConsultaUsuarios}/>}/>
                    <Route path="/detalles-pedido" element={<PrivateRoute component={DetallesPedido}/>}/>
                    <Route path="/pedidoss" element={<PrivateRoute component={Pedido}/>}/>
                    <Route path="/dashboard-mesero" element={<PrivateRoute component={DashboardMesero}/>}/>
                    <Route path="/pedidos-mesero" element={<PrivateRoute component={GestionPedidos}/>}/>



                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
                <Footer/>
            </main>
        </>
    );
};

export default App;
