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
  showSearchInput = true, // Nueva prop para controlar la visibilidad del campo de búsqueda
  entidad = "", // Nueva prop para identificar la entidad
  customFormat = null, // Nueva prop para formatear datos de forma personalizada
  createButtonText = "Crear", // Nueva prop para personalizar el texto del botón crear
  createButtonIcon = <IoAddSharp />, // Nueva prop para personalizar el icono del botón crear
  searchableFields = [], // Nueva prop para definir campos específicos para búsqueda
}) => {  const [searchTerm, setSearchTerm] = useState("");  const [filteredData, setFilteredData] = useState(() => {
    // Verificar que hay columnas y data antes de ordenar
    if (columns.length === 0 || data.length === 0) {
      return data || [];
    }

    return [...data].sort((a, b) => {
      // Verificar que la primera columna existe y tiene la propiedad key
      if (!columns[0] || !columns[0].key) {
        return 0; // No ordenar si no hay una clave válida
      }

      // Identificar si la columna es una fecha
      const isDateColumn = columns[0].key.toLowerCase().includes('fecha');
      
      if (isDateColumn) {
        // Ordenar fechas de más reciente a más antigua
        const dateA = a[columns[0].key] ? new Date(a[columns[0].key]) : new Date(0);
        const dateB = b[columns[0].key] ? new Date(b[columns[0].key]) : new Date(0);
        return dateB - dateA;
      } else {
        // Ordenar texto alfabéticamente, con manejo seguro de valores
        const valueA = a && columns[0].key in a ? 
          (typeof a[columns[0].key] === 'object' ? 
            (a[columns[0].key]?.nombre?.toLowerCase() || '') : 
            String(a[columns[0].key] || '').toLowerCase()) : 
          '';
          
        const valueB = b && columns[0].key in b ? 
          (typeof b[columns[0].key] === 'object' ? 
            (b[columns[0].key]?.nombre?.toLowerCase() || '') : 
            String(b[columns[0].key] || '').toLowerCase()) : 
          '';
          
        return valueA.localeCompare(valueB);
      }
    });
  });
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
  const searchInValue = (value, term, columnKey = '', row = null) => {
    if (value == null) return false;
    
    // Búsqueda especial para cantidadPerdida (permite buscar número y unidad)
    if (columnKey === 'cantidadPerdida') {
      // Si el valor es un número, buscar tanto en el número como en su formato con unidad
      if (typeof value === 'number' || !isNaN(parseFloat(value))) {
        const numValue = typeof value === 'number' ? value : parseFloat(value);
        const numStr = numValue.toString();
        
        // Buscar en el número
        if (numStr.includes(term)) return true;
        
        // Determinar la unidad usando la misma lógica que customFormat
        let unidad = "kg"; // Valor por defecto para carne
        
        if (row) {
          if (row.tipoProductoMerma === "producto" && row.producto) {
            const tipoMedida = row.producto.tipoMedida || "unidades";
            unidad = tipoMedida === "kilos" ? "kg" : "unidades";
          } else if (row.tipoProductoMerma === "subproducto" && row.subproducto) {
            const tipoMedida = row.subproducto.tipoMedida || "unidades";
            unidad = tipoMedida === "kilos" ? "kg" : "unidades";
          }
        }
        
        // Buscar en la versión formateada con unidad (como aparece en la interfaz)
        const formattedValue = `${numValue.toLocaleString('es-CL')} ${unidad}`;
        return formattedValue.toLowerCase().includes(term);
      }
      // Si el valor ya es string (posiblemente formateado), buscar directamente
      return String(value).toLowerCase().includes(term);
    }
    
    // Búsqueda especial para fechas
    if (columnKey === 'fecha' || columnKey === 'fechaVencimiento' || columnKey === 'fechaLlegada' || 
        columnKey === 'fechaEntrega' || columnKey === 'fechaPedido' || columnKey === 'fechaLimite' ||
        columnKey.toLowerCase().includes('fecha')) {
      if (typeof value === 'string') {
        // Formatear la fecha para búsqueda en formato dd-mm-yyyy
        try {
          const dateToUse = value.includes('T') ? value : value + 'T00:00:00';
          const date = new Date(dateToUse);
          if (!isNaN(date.getTime())) {
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            const formattedDate = `${day}-${month}-${year}`;
            
            // Obtener componentes sin padding para búsquedas más inteligentes
            const dayWithoutPadding = String(date.getDate());
            const monthWithoutPadding = String(date.getMonth() + 1);
            const yearString = String(year);
            
            // Si el término es un número, hacer búsqueda más inteligente
            if (/^\d+$/.test(term)) {
              // Para un solo dígito (1-9), buscar coincidencias exactas en día/mes o como parte del año
              if (term.length === 1) {
                return dayWithoutPadding === term || 
                       monthWithoutPadding === term || 
                       yearString.includes(term);
              }
              // Para dos dígitos, buscar en día/mes (con o sin padding) o como parte del año
              else if (term.length === 2) {
                return day === term || 
                       month === term || 
                       dayWithoutPadding === term || 
                       monthWithoutPadding === term ||
                       yearString.includes(term);
              }
              // Para 4 dígitos, buscar coincidencia exacta con año
              else if (term.length === 4) {
                return yearString === term;
              }
              // Para otros números, buscar en fecha formateada
              else {
                return formattedDate.includes(term);
              }
            }
            
            // Para términos no numéricos o formatos de fecha, buscar en fecha formateada
            return formattedDate.includes(term) || value.includes(term);
          }
        } catch (error) {
          // Si falla el formateo, buscar en la cadena original
          return String(value).toLowerCase().includes(term);
        }
      }
      return String(value).toLowerCase().includes(term);
    }
    
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
      
      // Para columnas de costos, precios y cantidades, usar búsqueda más inteligente
      if (columnKey === 'costoUnitario' || columnKey === 'costoTotal' || 
          columnKey === 'precio' || columnKey === 'monto' || columnKey === 'cantidad') {
        // Si el término es completamente numérico
        if (/^\d+\.?\d*$/.test(term)) {
          // Buscar como prefijo (más intuitivo para números)
          // Ejemplo: buscar "200" encuentra "2000" pero no "1200"
          return numStr.startsWith(term);
        }
      }
      
      // Para otros casos o términos no numéricos, usar búsqueda por inclusión
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
      
      // Si hay campos específicos para búsqueda, usar solo esos
      if (searchableFields.length > 0) {
        return searchableFields.some(fieldKey => {
          let value;
          
          // Manejar campos virtuales como 'productoItem'
          if (fieldKey === 'productoItem' && customFormat) {
            value = customFormat(null, fieldKey, row);
          }
          // Manejar propiedades anidadas (como 'personal.nombre')
          else if (fieldKey.includes('.')) {
            value = fieldKey.split('.').reduce((obj, key) => obj?.[key], row);
          }
          // Manejar campos calculados como 'costoTotal'
          else if (fieldKey === 'costoTotal') {
            const cantidad = Number(row.cantidad || 0);
            const costoUnitario = Number(row.costoUnitario || 0);
            value = cantidad * costoUnitario;
          }
          else {
            value = row[fieldKey];
          }
          
          return searchInValue(value, term, fieldKey, row);
        });
      }
      
      // Si no hay campos específicos, buscar en todas las columnas definidas
      return columns.some(col => {
        if (!col.key) return false;
        
        let value;
        // Manejar propiedades anidadas (como 'cliente')
        if (col.key.includes('.')) {
          value = col.key.split('.').reduce((obj, key) => obj?.[key], row);
        } else if (col.key === 'costoTotal') {
          // Calcular el costo total para la búsqueda
          const cantidad = Number(row.cantidad || 0);
          const costoUnitario = Number(row.costoUnitario || 0);
          value = cantidad * costoUnitario;
        } else {
          value = row[col.key];
        }        // Si es un monto, convertirlo a string sin el signo $
        if (col.key === 'monto') {
          return value?.toString().includes(term);
        }

        return searchInValue(value, term, col.key, row);
      });
    });

    setFilteredData(filtered);
    setCurrentPage(1);
  };

  // Filtrar datos por fecha
  const handleDateChange = (date) => {
    setSelectedDate(date);
    if (date) {
      // Usar fecha local para evitar problemas de zona horaria
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const selectedDateString = `${year}-${month}-${day}`;

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
          row.fecha,
          row.fechaRegistro
        ];

        // Recorre las fechas y verifica si alguna de ellas es válida y coincide con la fecha seleccionada
        return datesToCheck.some(dateValue => {
          if (!dateValue) return false;
          
          // Normalizar la fecha para evitar problemas de zona horaria
          let compareDate;
          if (typeof dateValue === 'string') {
            // Si la fecha incluye tiempo, usarla tal como está, sino agregar T00:00:00
            const dateToUse = dateValue.includes('T') ? dateValue : dateValue + 'T00:00:00';
            compareDate = new Date(dateToUse);
          } else {
            compareDate = new Date(dateValue);
          }
          
          if (isNaN(compareDate.getTime())) return false;
          
          // Extraer componentes de fecha local
          const compareYear = compareDate.getFullYear();
          const compareMonth = String(compareDate.getMonth() + 1).padStart(2, '0');
          const compareDay = String(compareDate.getDate()).padStart(2, '0');
          const compareDateString = `${compareYear}-${compareMonth}-${compareDay}`;
          
          return compareDateString === selectedDateString;
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
        return String(obj.nombre);
      }
      // Si es una cadena que contiene id: y nombre:, extraer solo el nombre
      if (typeof obj.toString === 'function') {
        const str = obj.toString();
        if (str.includes('id:') && str.includes('nombre:')) {
          const match = str.match(/nombre:\s*([^,}]+)/);
          if (match) return match[1].trim();
        }
      }
      // Convertir objeto a string seguro
      try {
        return Object.entries(obj)
          .map(([key, value]) => `${key}: ${value}`)
          .join(", ");
      } catch (error) {
        return "Datos no disponibles";
      }
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
    // Asegurar que siempre devolvemos un string
    return obj != null ? String(obj) : "No disponible";
  };  const formatData = (value, key, row = null) => {
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
      const result = customFormat(value, key, row);
      // Asegurar que el resultado sea válido para React
      if (result != null && typeof result === 'object' && !React.isValidElement(result)) {
        return String(result);
      }
      return result;
    }
    
    // De lo contrario, usar formateo genérico
    const result = formatObject(value);
    // Asegurar que el resultado sea válido para React
    if (result != null && typeof result === 'object' && !React.isValidElement(result)) {
      return String(result);
    }
    return result;
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
          {showSearchInput && (
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Buscar"
              className="search-input"
            />
          )}
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
                {createButtonIcon} {createButtonText}
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
              {(showEditButton || showDeleteButton || showViewButton) && (
                <th style={{ textAlign: "right" }}>Acciones</th>
              )}
            </tr>
          </thead>
          <tbody>
            {currentRows.length > 0 ? (
              currentRows.map((row, rowIndex) => {
                if (row) {
                  return (
                    <tr 
                      key={rowIndex} 
                      onClick={() => onView && onView(row)}
                      style={{ cursor: onView ? 'pointer' : 'default' }}
                    >
                      {columns.map((col) => {
                        const cellValue = row[col.key];
                        return (
                          <td key={col.key}>
                            {editAll && (col.key === "precio" || col.key === "cantidad") ? (
                              <input
                                type="text"
                                value={cellValue || ""}
                                onChange={(e) => {
                                  e.stopPropagation(); // Evitar que el clic se propague a la fila
                                  handleCellChange(e.target.value, rowIndex, col.key);
                                }}
                              />
                            ) : (
                              // Si hay una función de celda personalizada, úsala
                              col.cell ? 
                                col.cell(row) :
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
                                  return formatData(value || "No disponible", col.key, row);
                                })() : formatData(cellValue || "No disponible", col.key, row)
                            )}
                          </td>
                        );
                      })}
                      {(showEditButton || showDeleteButton || showViewButton) && (
                        <td onClick={(e) => e.stopPropagation()}>
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
                      )}
                    </tr>
                  );
                }
                return null;
              })
            ) : (
              <tr>
                <td colSpan={columns.length + (showEditButton || showDeleteButton || showViewButton ? 1 : 0)} className="no-results">
                  No se encontraron resultados.
                </td>
              </tr>
            )}
          </tbody>
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
