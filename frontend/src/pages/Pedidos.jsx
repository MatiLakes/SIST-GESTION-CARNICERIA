import React, { useState } from "react";
import { MdOutlineEdit } from "react-icons/md";
import useGetPedidos from "@hooks/pedidos/useGetPedidos.jsx";
import useCreatePedido from "@hooks/pedidos/useCreatePedido.jsx";
import useDeletePedido from "@hooks/pedidos/useDeletePedido.jsx";
import useEditPedido from "@hooks/pedidos/useEditPedido.jsx";
import { useErrorHandlerPedido } from "@hooks/pedidos/useErrorHandlerPedido.jsx";
import Table from "../components/Table";
import Modal from "react-modal";
import Swal from "sweetalert2";
import stylesPedido from "@styles/Pedido.module.css";
import "@styles/formulariotable.css";
import "@styles/modalDetalles.css";
import "@styles/modalCrear.css";
import styles from "@styles/categoria.module.css";

const Pedidos = () => {
  const { pedidos, loading, fetchPedidos } = useGetPedidos();
  const { create } = useCreatePedido(fetchPedidos);
  const { remove } = useDeletePedido(fetchPedidos);
  const { edit } = useEditPedido(fetchPedidos);
  const { createError, editError, handleCreateError, handleEditError } = useErrorHandlerPedido();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentPedido, setCurrentPedido] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [pedidoToView, setPedidoToView] = useState(null);  const openModal = () => setIsModalOpen(true);
  
  const closeModal = () => setIsModalOpen(false);

  const handleViewClick = (pedido) => {
    setPedidoToView(pedido);
    setIsViewModalOpen(true);
  };

  const handleViewModalClose = () => {
    setIsViewModalOpen(false);
    setPedidoToView(null);
  };

  const handleDeleteModalOpen = (pedido) => {
    setCurrentPedido(pedido);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
    setCurrentPedido(null);
  };

  const confirmDelete = async () => {
    if (!currentPedido) return;

    try {
      await remove(currentPedido.id);
      handleDeleteModalClose();

      // Mostrar alerta de éxito después de eliminar
      Swal.fire({
        title: "¡Eliminado!",
        text: "El pedido ha sido eliminado exitosamente",
        icon: "success",
        confirmButtonColor: "#000000"
      });
    } catch (error) {
      console.error("Error al eliminar pedido:", error);
      // Mostrar alerta de error
      Swal.fire({
        title: "Error",
        text: "No se pudo eliminar el pedido",
        icon: "error",
        confirmButtonColor: "#000000"
      });
    }
  };
  const handleCreatePedido = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const newPedido = {
      cliente_nombre: formData.get("cliente"),
      carnicero_nombre: formData.get("carnicero"),
      telefono_cliente: formData.get("telefono"),
      productos: formData.get("productos"),
      fecha_entrega: formData.get("fechaEntrega"),
    };

    // Validar antes de enviar
    const hasErrors = handleCreateError(newPedido);
    if (hasErrors) {
      return;
    }

    try {
      await create(newPedido);
      closeModal();
      // Mostrar alerta de éxito
      Swal.fire({
        title: '¡Éxito!',
        text: 'El pedido ha sido creado exitosamente',
        icon: 'success',
        confirmButtonColor: '#000000',
      });
    } catch (error) {
      console.error("Error al crear el pedido:", error);
      // Mostrar alerta de error
      Swal.fire({
        title: 'Error',
        text: 'No se pudo crear el pedido',
        icon: 'error',
        confirmButtonColor: '#000000',
      });
    }
  };  const handleEditPedido = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const updatedPedido = {
      cliente_nombre: formData.get("cliente"),
      carnicero_nombre: formData.get("carnicero"),
      telefono_cliente: formData.get("telefono"),
      productos: formData.get("productos"),
      fecha_entrega: formData.get("fechaEntrega"),
    };

    // Validar antes de enviar
    const hasErrors = handleEditError(updatedPedido);
    if (hasErrors) {
      return;
    }    try {
      await edit(currentPedido.id, updatedPedido);
      setIsEditModalOpen(false);
      // Mostrar alerta de éxito
      Swal.fire({
        title: "¡Éxito!",
        text: "El pedido ha sido actualizado correctamente",
        icon: "success",
        confirmButtonColor: "#000000"
      });
    } catch (error) {
      console.error("Error al editar pedido:", error);
      // Mostrar alerta de error
      Swal.fire({
        title: "Error",
        text: "No se pudo actualizar el pedido",
        icon: "error",
        confirmButtonColor: "#000000"
      });
    }
  };

  if (loading) return <p>Cargando pedidos...</p>;

  const columns = [
    { header: "Cliente", key: "cliente_nombre" },
    { header: "Carnicero", key: "carnicero_nombre" },
    { header: "Teléfono", key: "telefono_cliente" },
    { header: "Fecha Entrega", key: "fecha_entrega" }
  ];

  return (
    <div className={styles["categoria-container"]}>
      <Table 
        data={pedidos}
        columns={columns}
        headerTitle="Pedidos"
        onCreate={openModal}        onEdit={(pedido) => {
          setCurrentPedido(pedido);
          setIsEditModalOpen(true);
        }}
        onDelete={handleDeleteModalOpen}
        onView={handleViewClick}
        showEditAllButton={false}
        showViewButton={true}
        entidad="pedidos"
      />      {/* Modal de Creación */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Crear Pedido"
        ariaHideApp={false}
        className="modal-crear"
        overlayClassName="modal-overlay"
        closeTimeoutMS={300}
      >
        <form onSubmit={handleCreatePedido} className="modal-crear-formulario">
          <div className="modal-crear-header">
            <h2 className="modal-crear-titulo">Crear Nuevo Pedido</h2>
            <button type="button" onClick={closeModal} className="modal-crear-cerrar">×</button>
            <button type="submit" className="modal-boton-crear">Guardar</button>
          </div>          <div className="formulario-grupo">
            <label className="formulario-etiqueta">Nombre del Cliente:</label>
            <div className="input-container">
              <input
                type="text"
                id="cliente"
                name="cliente"
                required
                className={`formulario-input ${createError && createError.errors?.some(error => error.field === 'cliente_nombre') ? 'input-error' : ''}`}
              />
              {createError && createError.errors?.map((error, index) => (
                error.field === 'cliente_nombre' && (
                  <div key={index} className="error-message">
                    {error.message}
                  </div>
                )
              ))}
            </div>
          </div>          <div className="formulario-grupo">
            <label className="formulario-etiqueta">Nombre del Carnicero:</label>
            <div className="input-container">
              <input
                type="text"
                id="carnicero"
                name="carnicero"
                required
                className={`formulario-input ${createError && createError.errors?.some(error => error.field === 'carnicero_nombre') ? 'input-error' : ''}`}
              />
              {createError && createError.errors?.map((error, index) => (
                error.field === 'carnicero_nombre' && (
                  <div key={index} className="error-message">
                    {error.message}
                  </div>
                )
              ))}
            </div>
          </div>          <div className="formulario-grupo">
            <label className="formulario-etiqueta">Teléfono:</label>
            <div className="input-container">
              <input
                type="tel"
                id="telefono"
                name="telefono"
                required
                className={`formulario-input ${createError && createError.errors?.some(error => error.field === 'telefono_cliente') ? 'input-error' : ''}`}
              />
              {createError && createError.errors?.map((error, index) => (
                error.field === 'telefono_cliente' && (
                  <div key={index} className="error-message">
                    {error.message}
                  </div>
                )
              ))}
            </div>
          </div>          <div className="formulario-grupo">
            <label className="formulario-etiqueta">Productos:</label>
            <div className="input-container">
              <textarea
                id="productos"
                name="productos"
                required
                className={`formulario-input ${createError && createError.errors?.some(error => error.field === 'productos') ? 'input-error' : ''}`}
                rows="4"
              ></textarea>
              {createError && createError.errors?.map((error, index) => (
                error.field === 'productos' && (
                  <div key={index} className="error-message">
                    {error.message}
                  </div>
                )
              ))}
            </div>
          </div>          <div className="formulario-grupo">
            <label className="formulario-etiqueta">Fecha de Entrega:</label>
            <div className="input-container">
              <input
                type="date"
                id="fechaEntrega"
                name="fechaEntrega"
                required
                className={`formulario-input ${createError && createError.errors?.some(error => error.field === 'fecha_entrega') ? 'input-error' : ''}`}
              />
              {createError && createError.errors?.map((error, index) => (
                error.field === 'fecha_entrega' && (
                  <div key={index} className="error-message">
                    {error.message}
                  </div>
                )
              ))}
            </div>
          </div>
        </form>
      </Modal>      {/* Modal de Edición */}
      <Modal
        isOpen={isEditModalOpen}
        onRequestClose={() => setIsEditModalOpen(false)}
        contentLabel="Editar Pedido"
        ariaHideApp={false}
        className="modal-crear"
        overlayClassName="modal-overlay"
        closeTimeoutMS={300}
      >
        {currentPedido && (
          <form onSubmit={handleEditPedido} className="modal-crear-formulario">
            <div className="modal-crear-header">
              <h2 className="modal-crear-titulo">Editar Pedido</h2>
              <button type="button" onClick={() => setIsEditModalOpen(false)} className="modal-crear-cerrar">×</button>
              <button type="submit" className="modal-boton-crear">Guardar</button>
            </div>            <div className="formulario-grupo">
              <label className="formulario-etiqueta">Nombre del Cliente:</label>
              <div className="input-container">
                <input
                  type="text"
                  id="cliente"
                  name="cliente"
                  defaultValue={currentPedido.cliente_nombre}
                  required
                  className={`formulario-input ${editError && editError.errors?.some(error => error.field === 'cliente_nombre') ? 'input-error' : ''}`}
                />
                {editError && editError.errors?.map((error, index) => (
                  error.field === 'cliente_nombre' && (
                    <div key={index} className="error-message">
                      {error.message}
                    </div>
                  )
                ))}
              </div>
            </div>            <div className="formulario-grupo">
              <label className="formulario-etiqueta">Nombre del Carnicero:</label>
              <div className="input-container">
                <input
                  type="text"
                  id="carnicero"
                  name="carnicero"
                  defaultValue={currentPedido.carnicero_nombre}
                  required
                  className={`formulario-input ${editError && editError.errors?.some(error => error.field === 'carnicero_nombre') ? 'input-error' : ''}`}
                />
                {editError && editError.errors?.map((error, index) => (
                  error.field === 'carnicero_nombre' && (
                    <div key={index} className="error-message">
                      {error.message}
                    </div>
                  )
                ))}
              </div>
            </div>            <div className="formulario-grupo">
              <label className="formulario-etiqueta">Teléfono:</label>
              <div className="input-container">
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  defaultValue={currentPedido.telefono_cliente}
                  required
                  className={`formulario-input ${editError && editError.errors?.some(error => error.field === 'telefono_cliente') ? 'input-error' : ''}`}
                />
                {editError && editError.errors?.map((error, index) => (
                  error.field === 'telefono_cliente' && (
                    <div key={index} className="error-message">
                      {error.message}
                    </div>
                  )
                ))}
              </div>
            </div>            <div className="formulario-grupo">
              <label className="formulario-etiqueta">Productos:</label>
              <div className="input-container">
                <textarea
                  id="productos"
                  name="productos"
                  defaultValue={currentPedido.productos}
                  required
                  className={`formulario-input ${editError && editError.errors?.some(error => error.field === 'productos') ? 'input-error' : ''}`}
                  rows="4"
                ></textarea>
                {editError && editError.errors?.map((error, index) => (
                  error.field === 'productos' && (
                    <div key={index} className="error-message">
                      {error.message}
                    </div>
                  )
                ))}
              </div>
            </div>            <div className="formulario-grupo">
              <label className="formulario-etiqueta">Fecha de Entrega:</label>
              <div className="input-container">
                <input
                  type="date"
                  id="fechaEntrega"
                  name="fechaEntrega"
                  defaultValue={currentPedido.fecha_entrega}
                  required
                  className={`formulario-input ${editError && editError.errors?.some(error => error.field === 'fecha_entrega') ? 'input-error' : ''}`}
                />
                {editError && editError.errors?.map((error, index) => (
                  error.field === 'fecha_entrega' && (
                    <div key={index} className="error-message">
                      {error.message}
                    </div>
                  )
                ))}
              </div>
            </div>
          </form>
        )}
      </Modal>      {/* Modal de Eliminación */}
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
        <p>¿Estás seguro de que deseas eliminar este pedido?</p>        {currentPedido && (
          <div style={{ margin: '20px 0', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
            <p><strong>Cliente:</strong> {currentPedido.cliente_nombre}</p>
            <p><strong>Fecha de Entrega:</strong> {currentPedido.fecha_entrega}</p>
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
        </div></Modal>

      {/* Modal de Ver Detalles */}
      <Modal
        isOpen={isViewModalOpen}
        onRequestClose={handleViewModalClose}
        contentLabel="Ver Detalles"
        ariaHideApp={false}
        className="modal-detalles"
        overlayClassName="modal-overlay"
        closeTimeoutMS={300}
      >
        <div className="modal-crear-formulario">
          <div className="modal-detalles-header">          
            <h2 className="modal-detalles-titulo">Detalles del Pedido de {pedidoToView?.cliente_nombre}</h2>
            <button onClick={handleViewModalClose} className="modal-detalles-cerrar">×</button>
            <button
              onClick={() => {
                setCurrentPedido(pedidoToView);
                setIsEditModalOpen(true);
                handleViewModalClose();
              }}
              className="modal-detalles-editar"
            >
              <MdOutlineEdit size={24} />
            </button>
          </div>          
          {pedidoToView && (
            <div className="modal-detalles-contenido">
              <div className="datos-grid">                <div className="dato-item">
                  <span className="dato-label">Carnicero:</span>
                  <span className="dato-value">{pedidoToView.carnicero_nombre}</span>
                </div>

                <div style={{ gridColumn: "1 / -1", marginTop: "20px" }}>
                  <span className="dato-label" style={{ display: "block", marginBottom: "5px" }}>Productos:</span>
                  <div className="dato-item" style={{ border: "1px solid #ccc", borderRadius: "4px", padding: "10px", backgroundColor: "#f9f9f9" }}>
                    <span className="dato-value" style={{ whiteSpace: 'pre-wrap', display: "block", textAlign: "left" }}>{pedidoToView.productos}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Pedidos;
