import { Navigate } from 'react-router-dom';

export const PrivateRoute = ({ component: Component }) => {
    const rol = localStorage.getItem('rol');

    // Verifica si hay un rol en localStorage
    if (!rol) {
        return <Navigate to="/login" />; // Redirige al login si no hay rol
    }

    return <Component />; // Renderiza el componente si hay rol
};
