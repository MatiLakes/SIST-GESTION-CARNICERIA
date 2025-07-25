import React, { useState, useEffect, useCallback } from "react";
import useGetRecepcionesStock from "@hooks/recepcionStock/useGetRecepcionesStock.jsx";
import useCreateRecepcionStock from "@hooks/recepcionStock/useCreateRecepcionStock.jsx";
import useDeleteRecepcionStock from "@hooks/recepcionStock/useDeleteRecepcionStock.jsx";
import useEditRecepcionStock from "@hooks/recepcionStock/useEditRecepcionStock.jsx";
import useGetProductosForRecepcion from "@hooks/recepcionStock/useGetProductosForRecepcion.jsx";
import { useErrorHandlerRecepcionStock } from "@hooks/recepcionStock/useErrorHandlerRecepcionStock.jsx";
import useGetNotificaciones from "@hooks/notificacion/useGetNotificaciones.jsx";
import Table from "../components/Table";
import Modal from "react-modal";
import styles from "@styles/categoria.module.css";
import "@styles/formulariotable.css";
import "@styles/modalDetalles.css";
import "@styles/modalCrear.css";
import "@styles/modalConfirmar.css";
import "@styles/utilidades.css";
import "@styles/notificaciones.css";
import Swal from "sweetalert2";

const RecepcionStock = () => {
  const { recepciones, loading, fetchRecepciones } = useGetRecepcionesStock();
  const { productos, fetchProductos } = useGetProductosForRecepcion();
  const { create } = useCreateRecepcionStock(fetchRecepciones);
  const { remove } = useDeleteRecepcionStock(fetchRecepciones);
  const { edit } = useEditRecepcionStock(fetchRecepciones);
  const { createErrors, editErrors, handleCreateError, handleEditError, clearCreateErrors, clearEditErrors } = useErrorHandlerRecepcionStock();
  const { notificaciones } = useGetNotificaciones();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentRecepcion, setCurrentRecepcion] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [recepcionToDelete, setRecepcionToDelete] = useState(null);
  const [formatoFecha, setFormatoFecha] = useState("dd/MM/yyyy");
  const [notificacionMostrada, setNotificacionMostrada] = useState(false);
  
  // Estado para el formulario de crear
  const [newRecepcion, setNewRecepcion] = useState({
    productoId: '',
    cantidad: '',
    costoUnitario: '',
    fechaVencimiento: ''
  });

  useEffect(() => {
    fetchProductos();
  }, []);

  // Efecto para mostrar notificación emergente de productos próximos a vencer
  useEffect(() => {
    if (notificaciones && notificaciones.length > 0 && !notificacionMostrada) {
      // Filtrar solo notificaciones de productos por vencer
      const prodNotificaciones = notificaciones.filter(n => n.tipo === 'producto_vencimiento');
      
      if (prodNotificaciones.length > 0) {
        // Mostrar notificación solo una vez por sesión
        const productosHoy = prodNotificaciones.filter(n => n.mensaje.includes('vence hoy')).length;
        const productosProximos = prodNotificaciones.length - productosHoy;
        
        let mensaje = '';
        if (productosHoy > 0 && productosProximos > 0) {
          mensaje = `Hay ${productosHoy} producto(s) que vencen hoy y ${productosProximos} que vencerán próximamente.`;
        } else if (productosHoy > 0) {
          mensaje = `Hay ${productosHoy} producto(s) que vencen hoy.`;
        } else {
          mensaje = `Hay ${productosProximos} producto(s) que vencerán próximamente.`;
        }
        
        Swal.fire({
          title: '¡Atención: Productos próximos a vencer!',
          text: mensaje,
          icon: 'warning',
          confirmButtonColor: '#d33',
          confirmButtonText: 'Revisar'
        });
        
        setNotificacionMostrada(true);
      }
    }
  }, [notificaciones, notificacionMostrada]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    // Evitar errores con fechas inválidas
    try {
      // Si la fecha ya incluye tiempo, usarla tal como está, sino agregar T00:00:00
      const dateToUse = dateString.includes('T') ? dateString : dateString + 'T00:00:00';
      const date = new Date(dateToUse);
      if (isNaN(date.getTime())) {
        console.log('Fecha inválida recibida:', dateString);
        return '';
      }
      
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    } catch (error) {
      console.error('Error al formatear fecha:', error);
      return '';
    }
  };

  // Verificar si una fecha está próxima a vencer (hoy o en los próximos 7 días) o ya venció
  const checkFechaVencimiento = useCallback((fechaStr) => {
    if (!fechaStr) return { isExpiring: false, expiresInDays: null };
    
    try {
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0); // Normalizar al inicio del día
      
      // Si la fecha ya incluye tiempo, usarla tal como está, sino agregar T00:00:00
      const dateToUse = fechaStr.includes('T') ? fechaStr : fechaStr + 'T00:00:00';
      const fechaVenc = new Date(dateToUse);
      fechaVenc.setHours(0, 0, 0, 0); // Normalizar al inicio del día
      
      // Calcular la diferencia en días
      const diferenciaDias = Math.ceil((fechaVenc - hoy) / (1000 * 60 * 60 * 24));
      
      // Si es negativo, ya venció
      if (diferenciaDias < 0) {
        return { 
          isExpiring: true, 
          isExpired: true, 
          expiresInDays: diferenciaDias, 
          message: `Venció hace ${Math.abs(diferenciaDias)} día(s)`
        };
      }
      // Si es hoy
      else if (diferenciaDias === 0) {
        return { 
          isExpiring: true, 
          isToday: true, 
          expiresInDays: 0,
          message: `¡Vence HOY!`
        };
      }
      // Si es dentro de 7 días
      else if (diferenciaDias <= 7) {
        return { 
          isExpiring: true, 
          expiresInDays: diferenciaDias,
          message: `Vence en ${diferenciaDias} día(s)`
        };
      }
      
      return { isExpiring: false, expiresInDays: diferenciaDias };
    } catch (error) {
      console.error('Error al verificar fecha de vencimiento:', error);
      return { isExpiring: false, expiresInDays: null, error: true };
    }
  }, []);

  // Función para formatear precios sin decimales innecesarios
  const formatPrice = (value) => {
    const num = Number(value || 0);
    // Si es un número entero, no mostrar decimales
    if (num % 1 === 0) {
      return `$${num}`;
    }
    // Si tiene decimales, mostrar hasta 2 decimales
    return `$${num.toFixed(2)}`;
  };

  // Configuración de columnas para la tabla
  const columns = [
    { 
      header: "ID", 
      accessor: "id",
      key: "id"
    },
    { 
      header: "Producto", 
      key: "producto",
      cell: (row) => {
        // Manejo robusto de productos
        if (row.producto && typeof row.producto === 'object') {
          const nombre = row.producto.nombre || '';
          const variante = row.producto.variante || '';
          return nombre + (variante ? ` ${variante}` : '');
        }
        return "Producto no disponible";
      }
    },
    { 
      header: "Cantidad", 
      accessor: "cantidad", 
      key: "cantidad" 
    },
    { 
      header: "Costo Unitario", 
      key: "costoUnitario",
      cell: (row) => `$${Number(row.costoUnitario || 0).toFixed(2)}`
    },
    { 
      header: "Costo Total", 
      key: "costoTotal",
      cell: (row) => {
        const cantidad = Number(row.cantidad || 0);
        const costoUnitario = Number(row.costoUnitario || 0);
        return formatPrice(cantidad * costoUnitario);
      }
    },
    { 
      header: "Fecha", 
      key: "fecha",
      cell: (row) => row.fecha ? formatDate(row.fecha) : ''
    },
    { 
      header: "Fecha Vencimiento", 
      key: "fechaVencimiento",
      cell: (row) => {
        console.log("Fecha vencimiento en celda:", row.fechaVencimiento);
        
        // Si no hay fecha de vencimiento, simplemente mostrar un texto
        if (!row.fechaVencimiento) return 'No especificada';
        
        // Usar la función helper para verificar el estado de vencimiento
        const { isExpiring, isToday, isExpired } = checkFechaVencimiento(row.fechaVencimiento);
        
        // Formatear la fecha para mostrar
        const fechaFormateada = formatDate(row.fechaVencimiento);
        
        // Determinar la clase CSS basada en el estado de vencimiento
        let className = '';
        let prefix = '';
        
        if (isExpired) {
          className = 'vence-expirado';
          prefix = '⚠️ VENCIDO: ';
        } else if (isToday) {
          className = 'vence-hoy';
          prefix = '⚠️ HOY: ';
        } else if (isExpiring) {
          className = 'vence-pronto';
        }
        
        // Devolver el elemento con la clase CSS apropiada
        return (
          <span className={className}>
            {prefix}{fechaFormateada}
          </span>
        );
      }
    },
  ];

  // Funciones para abrir/cerrar modales
  const openModal = () => {
    // Reset form when opening modal
    setNewRecepcion({
      productoId: '',
      cantidad: '',
      costoUnitario: '',
      fechaVencimiento: ''
    });
    clearCreateErrors();
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);

  const openEditModal = (recepcion) => {
    setCurrentRecepcion(recepcion);
    clearEditErrors();
    setIsEditModalOpen(true);
  };
  const closeEditModal = () => setIsEditModalOpen(false);

  const handleDeleteModalOpen = (recepcion) => {
    setRecepcionToDelete(recepcion);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
    setRecepcionToDelete(null);
  };

  // Handlers para los formularios
  const handleCreateChange = (e) => {
    const { name, value } = e.target;
    setNewRecepcion(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setCurrentRecepcion(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Función para confirmar eliminación
  const confirmDelete = async () => {
    if (recepcionToDelete) {
      try {
        await remove(recepcionToDelete.id);
        handleDeleteModalClose();
        Swal.fire({
          icon: "success",
          title: "¡Eliminado!",
          text: "La recepción de stock ha sido eliminada correctamente.",
          confirmButtonColor: "#000000"
        });
      } catch (error) {
        console.error("Error al eliminar recepción de stock:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo eliminar la recepción de stock.",
          confirmButtonColor: "#000000"
        });
      }
    }
  };

  // Función para crear una nueva recepción de stock
  const handleCreateRecepcion = async (event) => {
    event.preventDefault();
    
    // Crear el objeto con los datos del estado
    const newRecepcionData = {
      productoId: parseInt(newRecepcion.productoId, 10),
      cantidad: parseFloat(newRecepcion.cantidad),
      costoUnitario: parseInt(newRecepcion.costoUnitario, 10),
      fechaVencimiento: newRecepcion.fechaVencimiento
    };

    // Usar el hook de validación de errores
    const hasErrors = handleCreateError(newRecepcionData);
    
    if (!hasErrors) {
      try {
        await create(newRecepcionData);
        closeModal();
        Swal.fire({
          icon: "success",
          title: "¡Éxito!",
          text: "Recepción de stock creada correctamente.",
          confirmButtonColor: "#000000"
        });
      } catch (error) {
        console.error("Error al crear la recepción de stock:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo crear la recepción de stock.",
          confirmButtonColor: "#000000"
        });
      }
    }
  };

  // Función para editar una recepción de stock existente
  const handleEditRecepcion = async (event) => {
    event.preventDefault();

    // Crear el objeto con los datos del estado actualizado
    const updatedRecepcion = {
      productoId: parseInt(currentRecepcion.productoId, 10),
      cantidad: parseFloat(currentRecepcion.cantidad),
      costoUnitario: parseInt(currentRecepcion.costoUnitario, 10),
      fechaVencimiento: currentRecepcion.fechaVencimiento
    };

    // Usar el hook de validación de errores
    const hasErrors = handleEditError(updatedRecepcion);
    
    if (!hasErrors) {
      try {
        await edit(currentRecepcion.id, updatedRecepcion);
        closeEditModal();
        Swal.fire({
          icon: "success",
          title: "¡Éxito!",
          text: "Recepción de stock actualizada correctamente.",
          confirmButtonColor: "#000000"
        });
      } catch (error) {
        console.error("Error al editar recepción de stock:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo actualizar la recepción de stock.",
          confirmButtonColor: "#000000"
        });
      }
    }
  };

  // Funciones para acciones en la tabla
  const actions = [
    {
      icon: <i className="fas fa-edit text-blue-500"></i>,
      tooltip: "Editar",
      onClick: (row) => openEditModal(row),
    },
    {
      icon: <i className="fas fa-trash text-red-500"></i>,
      tooltip: "Eliminar",
      onClick: (row) => handleDeleteModalOpen(row),
    },
  ];

  return (
    <div className={styles["categoria-container"]}>
      {loading ? (
        <div className="loading-container">
          <p>Cargando datos...</p>
        </div>
      ) : (
        <Table
            data={recepciones || []} // Asegurar que nunca sea null/undefined
            columns={columns}
            headerTitle="Recepciones de Stock"
            onCreate={openModal}
            onEdit={openEditModal}
            onDelete={handleDeleteModalOpen}
            showEditAllButton={false}
            showViewButton={false}
            showCalendarButton={true}
            showExcelButton={true}
            entidad="recepcion-stock"
            customFormat={(value, key, row) => {
              if (key === "costoUnitario") {
                return `$${parseFloat(value || 0).toLocaleString('es-CL')}`;
              }
              if (key === "producto") {
                if (row.producto && typeof row.producto === 'object') {
                  const nombre = row.producto.nombre || 'Sin nombre';
                  const variante = row.producto.variante || '';
                  return `${nombre}${variante ? ` ${variante}` : ''}`;
                } else if (typeof row.producto === 'string') {
                  return row.producto;
                }
                return 'Producto no disponible';
              }
              if (key === "fecha") {
                return value ? formatDate(value) : '';
              }
              if (key === "fechaVencimiento") {
                // Si no hay fecha de vencimiento, simplemente mostrar un texto
                if (!value) return 'No especificada';
                
                // Usar la función helper para verificar el estado de vencimiento
                const { isExpiring, isToday, isExpired } = checkFechaVencimiento(value);
                
                // Formatear la fecha para mostrar
                const fechaFormateada = formatDate(value);
                
                // Determinar la clase CSS y prefijo basados en el estado de vencimiento
                if (isExpired) {
                  return <span className="vence-expirado">⚠️ VENCIDO: {fechaFormateada}</span>;
                } else if (isToday) {
                  return <span className="vence-hoy">⚠️ HOY: {fechaFormateada}</span>;
                } else if (isExpiring) {
                  return <span className="vence-pronto">{fechaFormateada}</span>;
                }
                
                return fechaFormateada;
              }
              return value;
            }}
          />
      )}

      {/* Modal para crear nueva recepción de stock */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Crear Recepción de Stock"
        ariaHideApp={false}
        className="modal-crear"
        overlayClassName="modal-overlay"
        closeTimeoutMS={300}
      >
        <form onSubmit={handleCreateRecepcion} className="modal-crear-formulario" noValidate>
          <div className="modal-crear-header">
            <h2 className="modal-crear-titulo">Crear Nueva Recepción de Stock</h2>
            <button type="button" onClick={closeModal} className="modal-crear-cerrar">×</button>
            <button type="submit" className="modal-boton-crear">Guardar</button>
          </div>
          
          <div className="formulario-grupo">
            <label className="formulario-etiqueta">Producto:</label>
            <div className="input-container">
              <select
                name="productoId"
                id="productoId"
                value={newRecepcion.productoId}
                onChange={handleCreateChange}
                className="formulario-input"
              >
                <option value="">Seleccione un producto</option>
                {productos.map((producto) => (
                  <option key={producto.id} value={producto.id}>
                    {producto.nombre} {producto.variante}
                  </option>
                ))}
              </select>
              {createErrors.productoId && (
                <span className="error-message">{createErrors.productoId}</span>
              )}
            </div>
          </div>

          <div className="formulario-grupo">
            <label className="formulario-etiqueta">Cantidad:</label>
            <div className="input-container">
              <input
                type="number"
                name="cantidad"
                id="cantidad"
                className="formulario-input"
                value={newRecepcion.cantidad}
                onChange={handleCreateChange}
                placeholder="Ingrese la cantidad"
              />
              {createErrors.cantidad && (
                <span className="error-message">{createErrors.cantidad}</span>
              )}
            </div>
          </div>

          <div className="formulario-grupo">
            <label className="formulario-etiqueta">Costo Unitario:</label>
            <div className="input-container">
              <input
                type="number"
                name="costoUnitario"
                id="costoUnitario"
                className="formulario-input"
                value={newRecepcion.costoUnitario}
                onChange={handleCreateChange}
                placeholder="Ingrese el costo unitario"
              />
              {createErrors.costoUnitario && (
                <span className="error-message">{createErrors.costoUnitario}</span>
              )}
            </div>
          </div>

          <div className="formulario-grupo">
            <label className="formulario-etiqueta">Fecha de Vencimiento:</label>
            <div className="input-container">
              <input
                type="date"
                name="fechaVencimiento"
                id="fechaVencimiento"
                className="formulario-input"
                value={newRecepcion.fechaVencimiento}
                onChange={handleCreateChange}
              />
              {createErrors.fechaVencimiento && (
                <span className="error-message">{createErrors.fechaVencimiento}</span>
              )}
            </div>
          </div>

        </form>
      </Modal>

      {/* Modal para editar recepción de stock */}
      <Modal
        isOpen={isEditModalOpen}
        onRequestClose={closeEditModal}
        contentLabel="Editar Recepción de Stock"
        ariaHideApp={false}
        className="modal-crear"
        overlayClassName="modal-overlay"
        closeTimeoutMS={300}
      >
        {currentRecepcion && (
          <form onSubmit={handleEditRecepcion} className="modal-crear-formulario" noValidate>
            <div className="modal-crear-header">
              <h2 className="modal-crear-titulo">Editar Recepción de Stock</h2>
              <button type="button" onClick={closeEditModal} className="modal-crear-cerrar">×</button>
              <button type="submit" className="modal-boton-crear">Actualizar</button>
            </div>
            
            <div className="formulario-grupo">
              <label className="formulario-etiqueta">Producto:</label>
              <div className="input-container">
                <select
                  name="productoId"
                  id="productoId"
                  value={currentRecepcion.producto?.id || ''}
                  onChange={handleEditChange}
                  className="formulario-input"
                >
                  <option value="">Seleccione un producto</option>
                  {productos.map((producto) => (
                    <option key={producto.id} value={producto.id}>
                      {producto.nombre} {producto.variante}
                    </option>
                  ))}
                </select>
                {editErrors.productoId && (
                  <span className="error-message">{editErrors.productoId}</span>
                )}
              </div>
            </div>

            <div className="formulario-grupo">
              <label className="formulario-etiqueta">Cantidad:</label>
              <div className="input-container">
                <input
                  type="number"
                  name="cantidad"
                  id="cantidad"
                  className="formulario-input"
                  value={currentRecepcion.cantidad}
                  onChange={handleEditChange}
                  placeholder="Ingrese la cantidad"
                />
                {editErrors.cantidad && (
                  <span className="error-message">{editErrors.cantidad}</span>
                )}
              </div>
            </div>

            <div className="formulario-grupo">
              <label className="formulario-etiqueta">Costo Unitario:</label>
              <div className="input-container">
                <input
                  type="number"
                  name="costoUnitario"
                  id="costoUnitario"
                  className="formulario-input"
                  value={currentRecepcion.costoUnitario}
                  onChange={handleEditChange}
                  placeholder="Ingrese el costo unitario"
                />
                {editErrors.costoUnitario && (
                  <span className="error-message">{editErrors.costoUnitario}</span>
                )}
              </div>
            </div>

            <div className="formulario-grupo">
              <label className="formulario-etiqueta">Fecha de Vencimiento:</label>
              <div className="input-container">
                <input
                  type="date"
                  name="fechaVencimiento"
                  id="fechaVencimiento"
                  className="formulario-input"
                  value={currentRecepcion.fechaVencimiento ? 
                    new Date(currentRecepcion.fechaVencimiento).toISOString().split('T')[0] : ''}
                  onChange={handleEditChange}
                />
                {editErrors.fechaVencimiento && (
                  <span className="error-message">{editErrors.fechaVencimiento}</span>
                )}
              </div>
            </div>

          </form>
        )}
      </Modal>

      {/* Modal de Eliminación */}
      <Modal
        isOpen={isDeleteModalOpen}
        onRequestClose={handleDeleteModalClose}
        contentLabel="Confirmar Eliminación"
        ariaHideApp={false}
        className="formulario-table-modal-form"
        overlayClassName="formulario-table-overlay"
        style={{ content: { maxWidth: '400px' } }}
      >
        <h2 className="formulario-table-modal-title">Confirmar Eliminación</h2>
        <p>¿Estás seguro de que deseas eliminar esta recepción de stock?</p>
        {recepcionToDelete && (
          <div style={{ margin: '20px 0', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
            <p><strong>Producto:</strong> {recepcionToDelete.producto?.nombre} {recepcionToDelete.producto?.variante}</p>
            <p><strong>Cantidad:</strong> {recepcionToDelete.cantidad}</p>
            <p><strong>Costo Unitario:</strong> ${recepcionToDelete.costoUnitario}</p>
          </div>
        )}
        <div className="formulario-table-form-actions">
          <button 
            onClick={confirmDelete}
            className="formulario-table-btn-confirm"
            style={{ backgroundColor: '#dc3545' }}
          >
            Eliminar
          </button>
          <button
            onClick={handleDeleteModalClose}
            className="formulario-table-btn-cancel"
          >
            Cancelar
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default RecepcionStock;