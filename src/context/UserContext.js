import React, { createContext, useContext, useState } from 'react';

// Crear el contexto
export const UserContext = createContext(); // Cambiar a exportación

// Proveedor del contexto
export const UserProvider = ({ children }) => {
    const [role, setRole] = useState(null); // Estado para el rol
    const [id, setId] = useState(null); // Estado para el ID

    return (
        <UserContext.Provider value={{ role, setRole, id, setId }}>
            {children}
        </UserContext.Provider>
    );
};

// Hook para usar el contexto
export const useUser = () => {
    return useContext(UserContext);
};
