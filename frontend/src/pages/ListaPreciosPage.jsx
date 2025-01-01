import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useFetchListas from "@hooks/listas/useFetchListas";
import "@styles/ListaPreciosPage.css";

const ListaPreciosPage = () => {
  const { listas, loading, error } = useFetchListas(); // Hook para obtener las listas
  const [seleccionada, setSeleccionada] = useState(null); // Estado para la lista seleccionada
  const navigate = useNavigate();

  // Navegar a la página de creación de listas
  const handleCrearLista = () => {
    navigate("/crear-lista");
  };

  // Seleccionar una lista de la barra lateral
  const handleSeleccionarLista = (lista) => {
    setSeleccionada(lista);
  };

  if (loading) return <p>Cargando...</p>; // Mostrar mientras se cargan los datos
  if (error) return <p>Error: {error}</p>; // Mostrar si hay un error

  return (
    <div className="lista-precios-page">
      {/* Barra lateral */}
      <div className="sidebar">
        <button onClick={handleCrearLista}>Crear Lista de Precios</button>
        <ul>
          {listas.map((lista) => (
            <li
              key={lista.id}
              onClick={() => handleSeleccionarLista(lista)}
              className={seleccionada?.id === lista.id ? "active" : ""}
            >
              {lista.nombreLista}
            </li>
          ))}
        </ul>
      </div>

      {/* Detalles de la lista seleccionada */}
      <div className="detalle">
        {seleccionada ? (
          <div>
            <h2>Lista: {seleccionada.nombreLista}</h2>
            <table>
              <thead>
                <tr>
                  <th>Producto/Servicio</th>
                  <th>Precio</th>
                  <th>Cantidad</th>
                </tr>
              </thead>
              <tbody>
                {seleccionada.cortes.map((corte, index) => (
                  <tr key={index}>
                    <td>{corte.nombre}</td>
                    <td>{corte.precio}</td>
                    <td>{corte.cantidad}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>Selecciona una lista de precios para ver los detalles</p>
        )}
      </div>
    </div>
  );
};

export default ListaPreciosPage;
