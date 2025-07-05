import React, { useState } from 'react';
import useStockActual from '@hooks/useStockActual.jsx';
import Table from '../components/Table';
import styles from "@styles/categoria.module.css";
import "@styles/formulariotable.css";
import "@styles/stock-actual-table.css";

const StockActual = () => {
  const { stock, loading, error } = useStockActual();
  const [filtroNombre, setFiltroNombre] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroMarca, setFiltroMarca] = useState('');
  const [ordenamiento, setOrdenamiento] = useState('nombre');

  // Filtrar y ordenar el stock
  const stockFiltrado = stock
    .filter(producto => {
      const cumpleFiltroNombre = producto.nombre.toLowerCase().includes(filtroNombre.toLowerCase()) ||
                                (producto.variante && producto.variante.toLowerCase().includes(filtroNombre.toLowerCase()));
      const cumpleFiltroTipo = !filtroTipo || producto.tipo?.nombre === filtroTipo;
      const cumpleFiltroMarca = !filtroMarca || producto.marca?.nombre === filtroMarca;
      
      return cumpleFiltroNombre && cumpleFiltroTipo && cumpleFiltroMarca;
    })
    .sort((a, b) => {
      switch (ordenamiento) {
        case 'cantidad':
          return b.cantidadTotal - a.cantidadTotal;
        case 'precio':
          return b.precioVenta - a.precioVenta;
        case 'tipo':
          return a.tipo?.nombre.localeCompare(b.tipo?.nombre);
        case 'marca':
          return a.marca?.nombre.localeCompare(b.marca?.nombre);
        default:
          return a.nombre.localeCompare(b.nombre);
      }
    });

  // Obtener opciones únicas para filtros
  const tiposUnicos = [...new Set(stock.map(p => p.tipo?.nombre).filter(Boolean))];
  const marcasUnicas = [...new Set(stock.map(p => p.marca?.nombre).filter(Boolean))];

  // Configuración de columnas para la tabla
  const columns = [
    { 
      header: "PRODUCTO", 
      key: "productoCompleto",
      cell: (row) => {
        const nombre = row.nombre || '';
        const variante = row.variante || '';
        return nombre + (variante ? ` - ${variante}` : '');
      }
    },
    { 
      header: "CANTIDAD", 
      key: "cantidadTotal"
    },
    { 
      header: "TIPO MEDIDA", 
      key: "tipoMedida",
      cell: (row) => {
        return row.tipoMedida === 'kilos' ? 'Kilogramos' : 'Unidades';
      }
    },
    { 
      header: "TIPO", 
      key: "tipo",
      cell: (row) => row.tipo?.nombre || 'No especificado'
    },
    { 
      header: "MARCA", 
      key: "marca",
      cell: (row) => row.marca?.nombre || 'No especificado'
    },
    { 
      header: "PRECIO VENTA", 
      key: "precioVenta",
      cell: (row) => `$${Number(row.precioVenta || 0).toLocaleString('es-CL')}`
    },
    { 
      header: "RECEPCIONES", 
      key: "numeroRecepciones"
    }
  ];

  if (loading) return <p>Cargando stock actual...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className={styles["categoria-container"]}>
      <Table 
        data={stockFiltrado}
        columns={columns}
        headerTitle="Stock Actual"
        onCreate={null}
        onEdit={null}
        onDelete={null}
        onView={null}
        showCreateButton={false}
        showEditButton={false}
        showDeleteButton={false}
        showViewButton={false}
        showEditAllButton={false}
        showCalendarButton={false}
        showExcelButton={true}
        entidad="stock-actual"
      />
    </div>
  );
};

export default StockActual;
