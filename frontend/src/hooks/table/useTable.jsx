import { useEffect, useRef, useState } from 'react';
import { TabulatorFull as Tabulator } from 'tabulator-tables';
import "tabulator-tables/dist/css/tabulator.min.css";
import '@styles/table.css';  // Agrega tu archivo de estilos CSS

function useTable({ data, columns, filter, dataToFilter, initialSortName, onSelectionChange }) {
  const tableRef = useRef(null);
  const [table, setTable] = useState(null);
  const [isTableBuilt, setIsTableBuilt] = useState(false);

  // Este hook se encarga de inicializar la tabla cuando se monta el componente.
  useEffect(() => {
    if (tableRef.current) {
      const updatedColumns = [
        {
          formatter: "rowSelection", // Para seleccionar filas
          titleFormatter: false,
          hozAlign: "center",
          headerSort: false,
          cellClick: function (e, cell) {
            cell.getRow().toggleSelect(); // Alterna la selección de la fila
          }
        },
        ...columns // Asegura que las columnas pasadas desde props se conserven
      ];

      const tabulatorTable = new Tabulator(tableRef.current, {
        data: [], // Datos iniciales vacíos
        columns: updatedColumns, // Las columnas definidas
        layout: "fitColumns", // Ajusta las columnas para que se ajusten al tamaño de la pantalla
        responsiveLayout: "collapse", // Colapsa las columnas en pantallas pequeñas
        pagination: true, // Habilita la paginación
        paginationSize: 6, // Número de filas por página
        selectableRows: 1, // Permite seleccionar una fila a la vez
        rowHeight: 46, // Altura de cada fila
        langs: {
          "default": {
            "pagination": {
              "first": "Primero",
              "prev": "Anterior",
              "next": "Siguiente",
              "last": "Último"
            }
          }
        },
        initialSort: [
          { column: initialSortName, dir: "asc" } // Orden inicial según la columna especificada
        ]
      });

      // Configuración para el evento de cambio de selección
      tabulatorTable.on("rowSelectionChanged", function (selectedData) {
        if (onSelectionChange) {
          onSelectionChange(selectedData); // Llama al callback con las filas seleccionadas
        }
      });

      // Actualiza el estado cuando la tabla se ha construido
      tabulatorTable.on("tableBuilt", function () {
        setIsTableBuilt(true);
      });

      // Guarda la instancia de Tabulator en el estado
      setTable(tabulatorTable);

      return () => {
        // Limpiar la tabla al desmontar el componente
        tabulatorTable.destroy();
        setIsTableBuilt(false);
        setTable(null);
      };
    }
  }, []);

  // Este hook se encarga de actualizar los datos de la tabla cuando cambian
  useEffect(() => {
    if (table && isTableBuilt) {
      table.replaceData(data); // Actualiza los datos de la tabla
    }
  }, [data, table, isTableBuilt]);

  // Este hook maneja los cambios en el filtro
  useEffect(() => {
    if (table && isTableBuilt) {
      if (filter) {
        table.setFilter(dataToFilter, "like", filter); // Aplica el filtro
      } else {
        table.clearFilter(); // Si no hay filtro, lo limpia
      }
      table.redraw(); // Redibuja la tabla con los cambios
    }
  }, [filter, table, dataToFilter, isTableBuilt]);

  return { tableRef };
}

export default useTable;
