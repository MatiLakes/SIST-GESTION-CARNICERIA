import React, { useState } from "react";
import "@styles/materialTable.css";
import Navbar2 from "../components/Navbar2";
import { AiTwotoneDelete } from "react-icons/ai";
import { MdOutlineEdit } from "react-icons/md";
import { IoAddSharp } from "react-icons/io5";
import { FaRegEye } from "react-icons/fa";


const Table = ({
  data,
  columns,
  headerTitle,
  onCreate,
  onEdit,
  onDelete,
  onView,  // Nueva prop para manejar la acción de ver
  showCreateButton = true,
  showEditButton = true,
  showDeleteButton = true,
  showEditAllButton = true,
  showViewButton = true, // Agregamos un control para mostrar el botón de ver
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState(data);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(8);
  const [pageInput, setPageInput] = useState(currentPage);
  const [editAll, setEditAll] = useState(false);

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
    setCurrentPage(1);
  };

  const handleCellChange = (value, rowIndex, columnKey) => {
    const updatedData = [...filteredData];
    updatedData[rowIndex][columnKey] = value;
    setFilteredData(updatedData);
  };

  const formatObject = (obj) => {
    if (Array.isArray(obj)) {
      return obj.map((item, index) => (
        <div key={index}>
          {item.tipo}: {item.numero}
        </div>
      ));
    } else if (typeof obj === "object" && obj !== null) {
      return Object.entries(obj)
        .map(([key, value]) => `${key}: ${value}`)
        .join(", ");
    } else if (typeof obj === "boolean") {
      return obj ? "Sí" : "No";
    }
    return obj || "No disponible";
  };

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handlePageInputChange = (event) => {
    const page = Math.max(
      1,
      Math.min(event.target.value, Math.ceil(filteredData.length / rowsPerPage))
    );
    setPageInput(page);
  };

  const goToPage = () => {
    paginate(pageInput);
  };

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  return (
    <div>
      <Navbar2 />
      <div className="table-container">
        <h1 className="table-titulo">{headerTitle}</h1>
        <div className="search-and-create-container">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Buscar"
            className="search-input"
          />
          <div className="buttons-container">
            {showCreateButton && (
              <button onClick={onCreate} className="create-button-table">
                <IoAddSharp /> Crear
              </button>
            )}
            {showEditAllButton && ( // Solo mostramos el botón si showEditAllButton es true
              <button
                onClick={() => setEditAll((prev) => !prev)}
                className="edit-all-button"
              >
                <MdOutlineEdit /> {editAll ? "Guardar Edición" : "Editar Todo"}
              </button>
            )}
          </div>
        </div>
        <table>
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key}>{col.header}</th>
              ))}
              <th style={{ textAlign: "right" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentRows.length > 0 ? (
              currentRows.map((row, rowIndex) => {
                if (row !== null && row !== undefined) {
                  return (
                    <tr key={rowIndex}>
                      {columns.map((col) => (
                        <td key={col.key}>
                          {editAll && (col.key === "precio" || col.key === "cantidad") ? (
                            <input
                              type="text"
                              value={row[col.key]}
                              onChange={(e) =>
                                handleCellChange(e.target.value, rowIndex, col.key)
                              }
                            />
                          ) : (
                            formatObject(row[col.key])
                          )}
                        </td>
                      ))}
                      <td>
                        <div className="acciones-table-container">
                          {showEditButton && (
                            <button
                              onClick={() => onEdit(row)}
                              className="acciones-table edit-button"
                            >
                              <MdOutlineEdit />
                            </button>
                          )}
                          {showDeleteButton && (
                            <button
                              onClick={() => onDelete(row)}
                              className="acciones-table delete-button"
                            >
                              <AiTwotoneDelete />
                            </button>
                          )}
                          {showViewButton && (  // Agregamos el ícono de ver
                            <button
                              onClick={() => onView(row)}  // Ejecutamos la acción de ver
                              className="acciones-table view-button"
                            >
                              <FaRegEye />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                } else {
                  return null; // Si row es null o undefined, no lo renderizamos
                }
              })
            ) : (
              <tr>
                <td colSpan={columns.length + 1} className="no-results">
                  No se encontraron resultados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {totalPages > 1 && (
          <div className="paginacion-table">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Anterior
            </button>
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

