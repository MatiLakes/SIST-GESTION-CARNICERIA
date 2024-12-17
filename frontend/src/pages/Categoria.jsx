// eslint-disable-next-line no-unused-vars
import React, { useEffect } from "react";
import { useGetCategoria } from "@hooks/categoria/useGetCategoria";

const Categorias = () => {
    const { categorias, loading, error } = useGetCategoria();

    useEffect(() => {
        console.log("Categorías obtenidas:", categorias); // Verifica que los datos llegan correctamente
    }, [categorias]);

    if (loading) return <p>Cargando categorías...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h1>Lista de Categorías</h1>
            {categorias.length === 0 ? (
                <p>No hay categorías disponibles.</p>
            ) : (
                <ul>
                    {categorias.map((categoria) => (
                        <li key={categoria.id}>{categoria.nombre}</li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Categorias;
