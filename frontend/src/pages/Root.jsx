import { Outlet } from 'react-router-dom';
import Navbar from '@components/Navbar'; // Navbar principal
import Navbar2 from '@components/Navbar2'; // Navbar secundaria (barra lateral)
import { AuthProvider } from '@context/AuthContext';

function Root() {
    return (
        <AuthProvider>
            <PageRoot />
        </AuthProvider>
    );
}

function PageRoot() {
    return (
        <>
            <Navbar />    {/* Barra de navegación principal */}
            <Navbar2 />   {/* Barra de navegación lateral */}
            <Outlet />
        </>
    );
}

export default Root;
