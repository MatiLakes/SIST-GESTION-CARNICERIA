import React, { useState } from "react";
import "@styles/materialTable.css";
import Navbar2 from "../components/Navbar2";
import { AiTwotoneDelete } from "react-icons/ai";
import { MdOutlineEdit } from "react-icons/md";
import { IoAddSharp } from "react-icons/io5";
const Table = ({ data, columns, headerTitle, onCreate, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState(data);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(8);  // Número de filas por página
  const [pageInput, setPageInput] = useState(currentPage); // Valor del input de la página

  // Filtrar los datos según el término de búsqueda
  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredData(
      data.filter((row) =>
        columns.some((col) =>
          String(row[col.key]).toLowerCase().includes(term)
        )
      )
    );
    setCurrentPage(1); // Resetear la página cuando cambie el término de búsqueda
  };

  // Calcular los datos visibles para la página actual
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);

  // Función para cambiar la página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Función para manejar la entrada de la página en el buscador
  const handlePageInputChange = (event) => {
    const page = Math.max(1, Math.min(event.target.value, Math.ceil(filteredData.length / rowsPerPage)));
    setPageInput(page);
  };

  const goToPage = () => {
    paginate(pageInput);
  };

  // Total de páginas
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  return (
    <div>
      <Navbar2 />
      <div className="table-container">
        {/* Título dinámico con la clase 'table-titulo' */}
        <h1 className="table-titulo">{headerTitle}</h1>

        {/* Contenedor para el buscador y el botón */}
        <div className="search-and-create-container">
          {/* Buscador */}
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Buscar"
            className="search-input"
          />

          {/* Botón Crear que llama la función onCreate pasada desde Categorias.js */}
          <button
            onClick={onCreate}
            className="create-button-table"
          >
           <IoAddSharp />  Crear
          </button>
        </div>

        {/* Tabla */}
        <table>
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key}>{col.header}</th>
              ))}
              <th style={{ textAlign: "right" }}>Acciones</th> {/* Alinea "Acciones" a la derecha */}
            </tr>
          </thead>
          <tbody>
            {currentRows.length > 0 ? (
              currentRows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map((col) => (
                    <td key={col.key}>{row[col.key]}</td>
                  ))}
                  <td>
                    {/* Botones de Acción: Editar y Eliminar */}
                    <div className="acciones-table-container">
                      <button onClick={() => onEdit(row)} className="acciones-table edit-button">
                        <MdOutlineEdit />
                      </button>
                      <button onClick={() => onDelete(row)} className="acciones-table delete-button">
                        <AiTwotoneDelete />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + 1} className="no-results">
                  No se encontraron resultados.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="paginacion-table">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Anterior
            </button>

            {/* Buscador de página */}
            <div className="page-input-container">
              <input
                type="number"
                value={pageInput}
                onChange={handlePageInputChange}
                min={1}
                max={totalPages}
                className="page-input"
              />
              <button onClick={goToPage} className="go-to-page-button">
                Ir
              </button>
            </div>

            {/* Botones de páginas */}
            <span> de {totalPages} páginas </span>

            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Table;
