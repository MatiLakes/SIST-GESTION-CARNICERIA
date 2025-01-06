import React, { useState } from "react";
import "@styles/materialTable.css";
import Navbar2 from "../components/Navbar2";
import { AiTwotoneDelete } from "react-icons/ai";
import { MdOutlineEdit } from "react-icons/md";
import { IoAddSharp } from "react-icons/io5";
import { FaRegEye } from "react-icons/fa";
import { FcCalendar } from "react-icons/fc";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Table = ({
  data,
  columns,
  headerTitle,
  onCreate,
  onEdit,
  onDelete,
  onView,
  showCreateButton = true,
  showEditButton = true,
  showDeleteButton = true,
  showEditAllButton = true,
  showViewButton = true,
  customFormat = null, // Nueva prop para formatear datos de forma personalizada
  showCalendarButton = true, // Prop para controlar la visibilidad del botón de calendario
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState(data);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(8);
  const [pageInput, setPageInput] = useState(currentPage);
  const [editAll, setEditAll] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false); // Estado para manejar la visibilidad del calendario
  const [showClearButton, setShowClearButton] = useState(false); // Estado para manejar la visibilidad del botón "Mostrar Todo"

  // Manejo del filtro de búsqueda
  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    
    setFilteredData(
      data.filter((row) =>
        columns.some((col) =>
          searchInObject(row[col.key], term) // Función que buscará en los objetos
        )
      )
    );
    
    setCurrentPage(1);
  };

  // Función para realizar la búsqueda recursiva en objetos
  const searchInObject = (value, term) => {
    if (typeof value === "object" && value !== null) {
      return Object.values(value).some((v) => searchInObject(v, term)); // Recurre en objetos
    } else {
      return String(value).toLowerCase().includes(term); // Comparación normal en valores primitivos
    }
  };



// Filtrar datos por fecha
const handleDateChange = (date) => {
  setSelectedDate(date);
  if (date) {
    // Convierte la fecha seleccionada en formato ISO y extrae solo la parte de la fecha
    const selectedDateString = date.toISOString().split('T')[0];

    // Filtra los datos, comparando solo la parte de la fecha (yyyy-MM-dd)
    const filteredByDate = data.filter((row) => {
      // Define un arreglo con las propiedades de fecha de cada fila
      const datesToCheck = [
        row.fechaLlegada,
        row.fecha_llegada,
        row.fecha_vencimiento,
        row.otraFecha // Añadir otras fechas si es necesario
      ];

      // Recorre las fechas y verifica si alguna de ellas es válida y coincide con la fecha seleccionada
      return datesToCheck.some(date => {
        // Verifica si la fecha es válida antes de convertirla
        const parsedDate = new Date(date);
        return !isNaN(parsedDate) && parsedDate.toISOString().split('T')[0] === selectedDateString;
      });
    });

    setFilteredData(filteredByDate);
  } else {
    setFilteredData(data); // Mostrar todos los datos si no hay fecha seleccionada
  }
  setCurrentPage(1); // Resetear a la primera página cuando se aplica un filtro de fecha
};

const handleClearDateFilter = () => {
  setSelectedDate(null);
  setFilteredData(data); // Mostrar todos los datos
  setShowClearButton(false); // Ocultar el botón "Mostrar Todo"
  setShowDatePicker(false); // Ocultar el calendario
};

  // Manejo de cambios en las celdas de la tabla
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

  const formatData = (value) => {
    // Usa la función personalizada si está definida, de lo contrario usa la genérica
    return customFormat ? customFormat(value) : formatObject(value);
  };

  // Paginación de la tabla
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
          <div className="date-filter-container">
            {showCalendarButton && (
              <button
                onClick={() => {
                  setShowDatePicker((prev) => !prev);
                  setShowClearButton((prev) => !prev); // Alternar la visibilidad del botón "Mostrar Todo"
                }}
                className="calendar-icon-button"
              >
                <FcCalendar /> {/* Icono de calendario */}
              </button>
            )}
            {showDatePicker && (
              <div className="calendar-overlay">
                <DatePicker
                  selected={selectedDate}
                  onChange={handleDateChange}
                  dateFormat="yyyy/MM/dd"
                  className="date-picker"
                  inline
                />
              </div>
            )}
            {showClearButton && (
              <button
                onClick={handleClearDateFilter}
                className="clear-date-filter-button"
              >
                Mostrar Todo
              </button>
            )}
          </div>
          <div className="buttons-container">
            {showCreateButton && (
              <button onClick={onCreate} className="create-button-table">
                <IoAddSharp /> Crear
              </button>
            )}
            {showEditAllButton && (
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
                // Verifica que row no sea null
                if (row) {
                  return (
                    <tr key={rowIndex}>
                      {columns.map((col) => {
                        const cellValue = row[col.key];
                        return (
                          <td key={col.key}>
                            {editAll && (col.key === "precio" || col.key === "cantidad") ? (
                              <input
                                type="text"
                                value={cellValue || ""}
                                onChange={(e) =>
                                  handleCellChange(e.target.value, rowIndex, col.key)
                                }
                              />
                            ) : (
                              formatData(cellValue || "No disponible")
                            )}
                          </td>
                        );
                      })}
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
                          {showViewButton && (
                            <button
                              onClick={() => onView(row)}
                              className="acciones-table view-button"
                            >
                              <FaRegEye />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                }
                return null; // Si row es null, no renderiza esta fila
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
              className="pagina-button"
            >
              Anterior
            </button>
            <input
              type="number"
              value={pageInput}
              onChange={handlePageInputChange}
              onBlur={goToPage}
              className="page-input"
              min="1"
              max={totalPages}
            />
            <span>de {totalPages}</span>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="pagina-button"
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





