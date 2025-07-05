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
  const { createError, editError, handleCreateError, handleEditError } = useErrorHandlerRecepcionStock();
  const { notificaciones } = useGetNotificaciones();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentRecepcion, setCurrentRecepcion] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [recepcionToDelete, setRecepcionToDelete] = useState(null);
  const [formatoFecha, setFormatoFecha] = useState("dd/MM/yyyy");
  const [productosVencimiento, setProductosVencimiento] = useState([]);
  const [notificacionMostrada, setNotificacionMostrada] = useState(false);

  useEffect(() => {
    fetchProductos();
  }, []);
  
  // Efecto para mostrar las notificaciones de productos próximos a vencer
  useEffect(() => {
    if (notificaciones && notificaciones.length > 0 && !notificacionMostrada) {
      // Filtrar solo notificaciones de productos por vencer
      const prodNotificaciones = notificaciones.filter(n => n.tipo === 'producto_vencimiento');
      
      if (prodNotificaciones.length > 0) {
        setProductosVencimiento(prodNotificaciones);
        
        // Mostrar notificación solo una vez por sesión
        if (!notificacionMostrada) {
          // Crear mensaje para Swal
          const productosHoy = prodNotificaciones.filter(n => n.mensaje.includes('vence hoy')).length;
          const productosProximos = prodNotificaciones.length - productosHoy;
          
          let mensaje = '';
          if (productosHoy > 0) {
            mensaje += `Hay ${productosHoy} producto(s) que vencen hoy.\n`;
          }
          if (productosProximos > 0) {
            mensaje += `Hay ${productosProximos} producto(s) que vencerán próximamente.`;
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
    }
  }, [notificaciones, notificacionMostrada]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    // Evitar errores con fechas inválidas
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        console.log('Fecha inválida recibida:', dateString);
        return '';
      }
      
      const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
      return date.toLocaleDateString('es-ES', options);
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
      
      const fechaVenc = new Date(fechaStr);
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
        return `$${(cantidad * costoUnitario).toFixed(2)}`;
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
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const openEditModal = (recepcion) => {
    setCurrentRecepcion(recepcion);
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
    const formData = new FormData(event.target);
    
    // Asegurarse de que la fecha tenga el formato correcto ISO
    const fechaVencimiento = formData.get("fechaVencimiento");
    console.log("Fecha de vencimiento recibida del formulario:", fechaVencimiento);
    
    const newRecepcion = {
      productoId: parseInt(formData.get("productoId"), 10),
      cantidad: parseInt(formData.get("cantidad"), 10),
      costoUnitario: parseFloat(formData.get("costoUnitario")),
      fechaVencimiento: fechaVencimiento // Ya viene en formato YYYY-MM-DD del input type="date"
    };

    // Usar el hook de validación de errores
    const hasErrors = handleCreateError(newRecepcion);
    
    if (!hasErrors) {
      try {
        await create(newRecepcion);
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
    const formData = new FormData(event.target);

    // Obtener la fecha de vencimiento y registrarla para depuración
    const fechaVencimiento = formData.get("fechaVencimiento");
    console.log("Fecha de vencimiento (edición):", fechaVencimiento);

    const updatedRecepcion = {
      productoId: parseInt(formData.get("productoId"), 10),
      cantidad: parseInt(formData.get("cantidad"), 10),
      costoUnitario: parseFloat(formData.get("costoUnitario")),
      fechaVencimiento: fechaVencimiento // Ya viene en formato YYYY-MM-DD del input type="date"
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

  const renderProductosAVencer = () => {
    if (productosVencimiento.length === 0) return null;
    
    // Separar notificaciones por tipo: vencidos, vence hoy, y próximos a vencer
    const vencidos = productosVencimiento.filter(n => n.mensaje.includes('venció'));
    const venceHoy = productosVencimiento.filter(n => n.mensaje.includes('vence hoy'));
    const proximos = productosVencimiento.filter(n => 
      !n.mensaje.includes('venció') && !n.mensaje.includes('vence hoy')
    );
    
    return (
      <div className="productos-vencimiento-alerta">
        <h3>
          <i className="fas fa-exclamation-triangle"></i> 
          Productos por vencimiento ({productosVencimiento.length})
        </h3>
        
        <ul className="productos-vencimiento-lista">
          {vencidos.length > 0 && (
            <li className="vencimiento-categoria">
              <strong>Productos vencidos ({vencidos.length})</strong>
            </li>
          )}
          {vencidos.map((notif, index) => (
            <li 
              key={`vencido-${index}`} 
              className="producto-vencimiento-item vence-expirado"
            >
              {notif.mensaje}
            </li>
          ))}
          
          {venceHoy.length > 0 && (
            <li className="vencimiento-categoria">
              <strong>Vencen hoy ({venceHoy.length})</strong>
            </li>
          )}
          {venceHoy.map((notif, index) => (
            <li 
              key={`hoy-${index}`} 
              className="producto-vencimiento-item vence-hoy"
            >
              {notif.mensaje}
            </li>
          ))}
          
          {proximos.length > 0 && (
            <li className="vencimiento-categoria">
              <strong>Próximos a vencer ({proximos.length})</strong>
            </li>
          )}
          {proximos.map((notif, index) => (
            <li 
              key={`proximo-${index}`} 
              className="producto-vencimiento-item vence-pronto"
            >
              {notif.mensaje}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className={styles["categoria-container"]}>
      {/* Panel de alertas de vencimiento */}
      {productosVencimiento.length > 0 && renderProductosAVencer()}
      
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
        <form onSubmit={handleCreateRecepcion} className="modal-crear-formulario">
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
                required
                className="formulario-input"
              >
                <option value="">Seleccione un producto</option>
                {productos.map((producto) => (
                  <option key={producto.id} value={producto.id}>
                    {producto.nombre} {producto.variante}
                  </option>
                ))}
              </select>
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
                min="1"
                required
              />
            </div>
          </div>

          <div className="formulario-grupo">
            <label className="formulario-etiqueta">Costo Unitario:</label>
            <div className="input-container">
              <input
                type="number"
                step="0.01"
                name="costoUnitario"
                id="costoUnitario"
                className="formulario-input"
                min="0.01"
                required
              />
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
                min={new Date().toISOString().split('T')[0]}
                required
              />
              <small className="campo-ayuda">Formato: YYYY-MM-DD</small>
            </div>
          </div>

          {createError && <p className="error-mensaje">{createError}</p>}
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
          <form onSubmit={handleEditRecepcion} className="modal-crear-formulario">
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
                  defaultValue={currentRecepcion.producto.id}
                  required
                  className="formulario-input"
                >
                  <option value="">Seleccione un producto</option>
                  {productos.map((producto) => (
                    <option key={producto.id} value={producto.id}>
                      {producto.nombre} {producto.variante}
                    </option>
                  ))}
                </select>
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
                  min="1"
                  defaultValue={currentRecepcion.cantidad}
                  required
                />
              </div>
            </div>

            <div className="formulario-grupo">
              <label className="formulario-etiqueta">Costo Unitario:</label>
              <div className="input-container">
                <input
                  type="number"
                  step="0.01"
                  name="costoUnitario"
                  id="costoUnitario"
                  className="formulario-input"
                  min="0.01"
                  defaultValue={currentRecepcion.costoUnitario}
                  required
                />
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
                  defaultValue={currentRecepcion.fechaVencimiento ? 
                    new Date(currentRecepcion.fechaVencimiento).toISOString().split('T')[0] : ''}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
                <small className="campo-ayuda">Formato: YYYY-MM-DD</small>
              </div>
            </div>

            {editError && <p className="error-mensaje">{editError}</p>}
          </form>
        )}
      </Modal>

      {/* Modal para confirmar eliminación */}
      <Modal
        isOpen={isDeleteModalOpen}
        onRequestClose={handleDeleteModalClose}
        contentLabel="Confirmar Eliminación"
        ariaHideApp={false}
        className="modal-confirmar"
        overlayClassName="modal-overlay"
        closeTimeoutMS={300}
      >
        <div className="modal-confirmar-contenido">
          <h2>Confirmar Eliminación</h2>
          <p>¿Está seguro de que desea eliminar esta recepción de stock?</p>
          <div className="modal-confirmar-botones">
            <button 
              onClick={handleDeleteModalClose}
              className="boton-cancelar"
            >
              Cancelar
            </button>
            <button 
              onClick={confirmDelete}
              className="boton-eliminar"
            >
              Eliminar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default RecepcionStock;
