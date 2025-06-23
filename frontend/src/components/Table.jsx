import React, { useState } from "react";
import "@styles/materialTable.css";
import { AiTwotoneDelete } from "react-icons/ai";
import { MdOutlineEdit } from "react-icons/md";
import { IoAddSharp } from "react-icons/io5";
import { FaRegEye } from "react-icons/fa";
import { FaFileExcel } from "react-icons/fa6"; // Importar ícono de Excel
import 'bootstrap-icons/font/bootstrap-icons.css'; // Importación de Bootstrap Icons
import DatePicker, { registerLocale } from "react-datepicker";
import { es } from 'date-fns/locale'; // <-- Idioma español
import "react-datepicker/dist/react-datepicker.css";
import { descargarExcel } from "@services/excel.service";

// Registra el idioma español
registerLocale('es', es);

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
  showCalendarButton = true, // Prop para controlar la visibilidad del botón de calendario
  showExcelButton = true, // Nueva prop para controlar la visibilidad del botón de exportar a Excel
  entidad = "", // Nueva prop para identificar la entidad
  customFormat = null, // Nueva prop para formatear datos de forma personalizada
}) => {  const [searchTerm, setSearchTerm] = useState("");  const [filteredData, setFilteredData] = useState(data.sort((a, b) => {
    // Identificar si la columna es una fecha
    const isDateColumn = columns[0].key.toLowerCase().includes('fecha');
    
    if (isDateColumn) {
      // Ordenar fechas de más reciente a más antigua
      const dateA = a[columns[0].key] ? new Date(a[columns[0].key]) : new Date(0);
      const dateB = b[columns[0].key] ? new Date(b[columns[0].key]) : new Date(0);
      return dateB - dateA;
    } else {
      // Ordenar texto alfabéticamente
      const valueA = typeof a[columns[0].key] === 'object' ? a[columns[0].key]?.nombre?.toLowerCase() || '' : String(a[columns[0].key] || '').toLowerCase();
      const valueB = typeof b[columns[0].key] === 'object' ? b[columns[0].key]?.nombre?.toLowerCase() || '' : String(b[columns[0].key] || '').toLowerCase();
      return valueA.localeCompare(valueB);
    }
  }));
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(7);
  const [pageInput, setPageInput] = useState(currentPage);
  const [editAll, setEditAll] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);  const [showDatePicker, setShowDatePicker] = useState(false); // Estado para manejar la visibilidad del calendario
  const [showClearButton, setShowClearButton] = useState(false); // Estado para manejar la visibilidad del botón "Mostrar Todo"
  const [sortConfig, setSortConfig] = useState({
    key: columns[0]?.key || '',
    direction: 'asc'
  });

  // Función para verificar si una cadena contiene solo caracteres especiales
  const containsOnlySpecialChars = (str) => {
    return /^[^a-zA-Z0-9áéíóúñÁÉÍÓÚÑ]+$/.test(str);
  };
  // Función para normalizar RUT (quitar puntos y guión)
  const normalizeRut = (rut) => {
    if (!rut) return '';
    return String(rut).replace(/[.\-]/g, '').toLowerCase();
  };

  // Función para buscar en un valor específico
  const searchInValue = (value, term, columnKey = '') => {
    if (value == null) return false;
    
    // Búsqueda especial para RUTs
    if (columnKey === 'rut' || (typeof value === 'string' && /^[0-9]{1,2}\.?[0-9]{3}\.?[0-9]{3}-?[0-9kK]?$/.test(value))) {
      const normalizedValue = normalizeRut(value);
      const normalizedTerm = normalizeRut(term);
      
      // Buscar tanto en formato normalizado como en formato original
      return normalizedValue.includes(normalizedTerm) || String(value).toLowerCase().includes(term);
    }
    
    // Para números
    if (typeof value === 'number') {
      const numStr = value.toString();
      return numStr.includes(term);
    }

    // Para objetos (como cliente)
    if (typeof value === 'object' && value !== null) {
      if (value.id) { // Para objetos cliente
        if (value.razonSocial) {
          return value.razonSocial.toLowerCase().includes(term);
        }
        if (value.nombres || value.apellidos) {
          const fullName = `${value.nombres || ''} ${value.apellidos || ''}`.toLowerCase();
          return fullName.includes(term);
        }
      }
      // Buscar en todos los valores del objeto
      return Object.values(value).some(v => 
        v !== null && String(v).toLowerCase().includes(term)
      );
    }

    // Para strings
    return String(value).toLowerCase().includes(term);
  };

  // Manejo del filtro de búsqueda
  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase().trim();
    setSearchTerm(event.target.value);

    if (!term) {
      setFilteredData(data);
      setCurrentPage(1);
      return;
    }

    const filtered = data.filter(row => {
      if (!row) return false;
      
      // Buscar en todas las columnas definidas
      return columns.some(col => {
        if (!col.key) return false;
        
        let value;
        // Manejar propiedades anidadas (como 'cliente')
        if (col.key.includes('.')) {
          value = col.key.split('.').reduce((obj, key) => obj?.[key], row);
        } else {
          value = row[col.key];
        }        // Si es un monto, convertirlo a string sin el signo $
        if (col.key === 'monto') {
          return value?.toString().includes(term);
        }

        return searchInValue(value, term, col.key);
      });
    });

    setFilteredData(filtered);
    setCurrentPage(1);
  };

  // Filtrar datos por fecha
  const handleDateChange = (date) => {
    setSelectedDate(date);
    if (date) {
      // Convierte la fecha seleccionada en formato ISO y extrae solo la parte de la fecha
      const selectedDateString = date.toISOString().split('T')[0];

      // Filtra los datos, comparando solo la parte de la fecha (yyyy-MM-dd)
      let filteredByDate = data.filter((row) => {
        // Define un arreglo con las propiedades de fecha de cada fila
        const datesToCheck = [
          row.fechaLlegada,
          row.fecha_llegada,
          row.fecha_vencimiento,
          row.fechaVencimiento,
          row.fechaFaena,
          row.fechaEntrega,
          row.fechaPedido,
          row.fechaLimite,
          row.fecha_entrega,
          row.fecha
        ];

        // Recorre las fechas y verifica si alguna de ellas es válida y coincide con la fecha seleccionada
        return datesToCheck.some(date => {
          // Verifica si la fecha es válida antes de convertirla
          const parsedDate = new Date(date);
          return !isNaN(parsedDate) && parsedDate.toISOString().split('T')[0] === selectedDateString;
        });
      });      // Ordenar por fecha más reciente primero
      filteredByDate = filteredByDate.sort((a, b) => {
        const isDateColumn = columns[0].key.toLowerCase().includes('fecha');
        if (isDateColumn) {
          const dateA = a[columns[0].key] ? new Date(a[columns[0].key]) : new Date(0);
          const dateB = b[columns[0].key] ? new Date(b[columns[0].key]) : new Date(0);
          return dateB - dateA;
        } else {
          const valueA = typeof a[columns[0].key] === 'object' ? a[columns[0].key]?.nombre?.toLowerCase() || '' : String(a[columns[0].key] || '').toLowerCase();
          const valueB = typeof b[columns[0].key] === 'object' ? b[columns[0].key]?.nombre?.toLowerCase() || '' : String(b[columns[0].key] || '').toLowerCase();
          return valueA.localeCompare(valueB);
        }
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
  };  const formatObject = (obj) => {
    if (Array.isArray(obj)) {
      return obj.map((item, index) => (
        <div key={index}>
          {item.tipo}: {item.numero}
        </div>
      ));
    } else if (typeof obj === "object" && obj !== null) {
      // Si el objeto tiene una propiedad nombre, mostrar solo el nombre
      if (obj.nombre !== undefined) {
        return obj.nombre;
      }
      // Si es una cadena que contiene id: y nombre:, extraer solo el nombre
      if (typeof obj.toString === 'function') {
        const str = obj.toString();
        if (str.includes('id:') && str.includes('nombre:')) {
          const match = str.match(/nombre:\s*([^,}]+)/);
          if (match) return match[1].trim();
        }
      }
      return Object.entries(obj)
        .map(([key, value]) => `${key}: ${value}`)
        .join(", ");
    } else if (typeof obj === "boolean") {
      return obj ? "Sí" : "No";
    } else if (typeof obj === "string" && obj.match(/^\d{4}-\d{2}-\d{2}$/)) {
      // Detectar fechas en formato YYYY-MM-DD y convertirlas a DD/MM/YYYY
      const fecha = new Date(obj + 'T00:00:00');
      if (!isNaN(fecha.getTime())) {
        return fecha.toLocaleDateString('es-CL', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
      }
    }
    return obj || "No disponible";
  };  const formatData = (value, key) => {
    // Verificar si es una fecha en formato YYYY-MM-DD y formatearla primero
    if (typeof value === "string" && value.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const fecha = new Date(value + 'T00:00:00');
      if (!isNaN(fecha.getTime())) {
        return fecha.toLocaleDateString('es-CL', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
      }
    }
    
    // Si hay función personalizada, aplicarla para valores que no son fechas
    if (customFormat) {
      return customFormat(value, key);
    }
    
    // De lo contrario, usar formateo genérico
    return formatObject(value);
  };

  // Paginación de la tabla
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);
  const paginate = (pageNumber) => {
    // Asegurarse de que el número de página esté dentro de los límites
    const validPage = Math.max(1, Math.min(pageNumber, totalPages));
    setCurrentPage(validPage);
    setPageInput(validPage);
  };

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
                <i className="bi bi-calendar3 calendar-icon"></i> {/* Icono de calendario de Bootstrap */}
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
                  locale="es"
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
          <div className="buttons-container">            {showCreateButton && (
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
        <table>          <thead>
            <tr>
              {columns.map((col) => (
                <th 
                  key={col.key}
                  onClick={() => {
                    const newDirection = sortConfig.key === col.key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
                    setSortConfig({ key: col.key, direction: newDirection });                    const sortedData = [...filteredData].sort((a, b) => {
                      // Identificar si la columna es una fecha
                      const isDateColumn = col.key.toLowerCase().includes('fecha');
                      
                      if (isDateColumn) {
                        // Ordenar fechas
                        const dateA = a[col.key] ? new Date(a[col.key]) : new Date(0);
                        const dateB = b[col.key] ? new Date(b[col.key]) : new Date(0);
                        return newDirection === 'asc' ? dateA - dateB : dateB - dateA;
                      } else {
                        // Ordenar texto
                        const valueA = typeof a[col.key] === 'object' ? a[col.key]?.nombre?.toLowerCase() || '' : String(a[col.key] || '').toLowerCase();
                        const valueB = typeof b[col.key] === 'object' ? b[col.key]?.nombre?.toLowerCase() || '' : String(b[col.key] || '').toLowerCase();
                        return newDirection === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
                      }
                    });
                    setFilteredData(sortedData);
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  {col.header} {sortConfig.key === col.key && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
              ))}
              <th style={{ textAlign: "right" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentRows.length > 0 ? (
              currentRows.map((row, rowIndex) => {
                if (row) {
                  return (                    <tr 
                      key={rowIndex} 
                      onClick={() => onView && onView(row)}
                      style={{ cursor: onView ? 'pointer' : 'default' }}
                    >
                      {columns.map((col) => {
                        const cellValue = row[col.key];
                        return (
                          <td key={col.key}>                            {editAll && (col.key === "precio" || col.key === "cantidad") ? (
                              <input
                                type="text"
                                value={cellValue || ""}
                                onChange={(e) => {
                                  e.stopPropagation(); // Evitar que el clic se propague a la fila
                                  handleCellChange(e.target.value, rowIndex, col.key);
                                }}
                              />                            ) : (
                              // Manejar propiedades anidadas como "personal.nombre"
                              col.key.includes('.') ? 
                                (() => {
                                  const keys = col.key.split('.');
                                  let value = row;
                                  // Navegar por el objeto siguiendo la cadena de claves
                                  for (const key of keys) {
                                    if (value && typeof value === 'object') {
                                      value = value[key];
                                    } else {
                                      value = undefined;
                                      break;
                                    }
                                  }
                                  return formatData(value || "No disponible", col.key);
                                })() : formatData(cellValue || "No disponible", col.key)
                            )}
                          </td>
                        );
                      })}                      <td onClick={(e) => e.stopPropagation()}>
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
                return null;
              })
            ) : (
              <tr>
                <td colSpan={columns.length + 1} className="no-results">
                  No se encontraron resultados.
                </td>
              </tr>
            )}          </tbody>
        </table>
        <div className="paginacion-table">          {showExcelButton && entidad && (
            <button 
              onClick={() => descargarExcel(entidad)} 
              className="excel-button-table"
            >
              Exportar Excel
            </button>
          )}
          {totalPages > 1 && (
            <div className="pagination-buttons">
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
    </div>
  );
};

export default Table;
