import React, { useState } from "react";
import useGetPedidos from "@hooks/pedidos/useGetPedidos.jsx";
import useCreatePedido from "@hooks/pedidos/useCreatePedido.jsx";
import useDeletePedido from "@hooks/pedidos/useDeletePedido.jsx";
import useEditPedido from "@hooks/pedidos/useEditPedido.jsx";
import Table from "../components/Table";
import Modal from "react-modal";
import Swal from "sweetalert2";
import stylesPedido from "@styles/Pedido.module.css";
import "@styles/formulariotable.css";
import styles from "@styles/categoria.module.css";

const Pedidos = () => {
  const { pedidos, loading, fetchPedidos } = useGetPedidos();
  const { create } = useCreatePedido(fetchPedidos);
  const { remove } = useDeletePedido(fetchPedidos);
  const { edit } = useEditPedido(fetchPedidos);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentPedido, setCurrentPedido] = useState(null);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

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
  };

  const handleEditPedido = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const updatedPedido = {
      cliente_nombre: formData.get("cliente"),
      carnicero_nombre: formData.get("carnicero"),
      telefono_cliente: formData.get("telefono"),
      productos: formData.get("productos"),
      fecha_entrega: formData.get("fechaEntrega"),
    };

    try {
      await edit(currentPedido.id, updatedPedido);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error al editar pedido:", error);
    }
  };

  if (loading) return <p>Cargando pedidos...</p>;

  const columns = [
    { header: "ID", key: "id" },
    { header: "Cliente", key: "cliente_nombre" },
    { header: "Carnicero", key: "carnicero_nombre" },
    { header: "Teléfono", key: "telefono_cliente" },
    { header: "Productos", key: "productos" },
    { header: "Fecha Entrega", key: "fecha_entrega" }
  ];

  return (
    <div className={styles["categoria-container"]}>
      <Table 
        data={pedidos}
        columns={columns}
        headerTitle="Pedidos"
        onCreate={openModal}
        onEdit={(pedido) => {
          setCurrentPedido(pedido);
          setIsEditModalOpen(true);
        }}
        onDelete={handleDeleteModalOpen}
        showEditAllButton={false}
        showViewButton={false}
      />

      {/* Modal de Creación */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Crear Pedido"
        ariaHideApp={false}
        className="formulario-table-modal-form-datos"
        overlayClassName="formulario-table-overlay"
      >
        <h2 className="formulario-table-modal-title">Crear Nuevo Pedido</h2>
        <form onSubmit={handleCreatePedido} className="formulario-table-formulario-table">
          <div className="formulario-table-field-group">
            <label htmlFor="cliente">Nombre del Cliente:</label>
            <input
              type="text"
              id="cliente"
              name="cliente"
              required
              className="formulario-table-input"
            />
          </div>
          <div className="formulario-table-field-group">
            <label htmlFor="carnicero">Nombre del Carnicero:</label>
            <input
              type="text"
              id="carnicero"
              name="carnicero"
              required
              className="formulario-table-input"
            />
          </div>
          <div className="formulario-table-field-group">
            <label htmlFor="telefono">Teléfono:</label>
            <input
              type="tel"
              id="telefono"
              name="telefono"
              required
              className="formulario-table-input"
            />
          </div>
          <div className="formulario-table-field-group">
            <label htmlFor="productos">Productos:</label>
            <textarea
              id="productos"
              name="productos"
              required
              className="formulario-table-input"
            ></textarea>
          </div>
          <div className="formulario-table-field-group">
            <label htmlFor="fechaEntrega">Fecha de Entrega:</label>
            <input
              type="date"
              id="fechaEntrega"
              name="fechaEntrega"
              required
              className="formulario-table-input"
            />
          </div>
          <div className="formulario-table-form-actions">
            <button type="submit" className="formulario-table-btn-confirm">
              Crear
            </button>
            <button type="button" onClick={closeModal} className="formulario-table-btn-cancel">
              Cancelar
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal de Edición */}
      <Modal
        isOpen={isEditModalOpen}
        onRequestClose={() => setIsEditModalOpen(false)}
        contentLabel="Editar Pedido"
        ariaHideApp={false}
        className="formulario-table-modal-form-datos"
        overlayClassName="formulario-table-overlay"
      >
        <h2 className="formulario-table-modal-title">Editar Pedido</h2>
        {currentPedido && (
          <form onSubmit={handleEditPedido} className="formulario-table-formulario-table">
            <div className="formulario-table-field-group">
              <label htmlFor="cliente">Nombre del Cliente:</label>
              <input
                type="text"
                id="cliente"
                name="cliente"
                defaultValue={currentPedido.cliente_nombre}
                required
                className="formulario-table-input"
              />
            </div>
            <div className="formulario-table-field-group">
              <label htmlFor="carnicero">Nombre del Carnicero:</label>
              <input
                type="text"
                id="carnicero"
                name="carnicero"
                defaultValue={currentPedido.carnicero_nombre}
                required
                className="formulario-table-input"
              />
            </div>
            <div className="formulario-table-field-group">
              <label htmlFor="telefono">Teléfono:</label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                defaultValue={currentPedido.telefono_cliente}
                required
                className="formulario-table-input"
              />
            </div>
            <div className="formulario-table-field-group">
              <label htmlFor="productos">Productos:</label>
              <textarea
                id="productos"
                name="productos"
                defaultValue={currentPedido.productos}
                required
                className="formulario-table-input"
              ></textarea>
            </div>
            <div className="formulario-table-field-group">
              <label htmlFor="fechaEntrega">Fecha de Entrega:</label>
              <input
                type="date"
                id="fechaEntrega"
                name="fechaEntrega"
                defaultValue={currentPedido.fecha_entrega}
                required
                className="formulario-table-input"
              />
            </div>
            <div className="formulario-table-form-actions">
              <button type="submit" className="formulario-table-btn-confirm">
                Guardar
              </button>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="formulario-table-btn-cancel"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Modal de Eliminación */}
      <Modal
        isOpen={isDeleteModalOpen}
        onRequestClose={handleDeleteModalClose}
        contentLabel="Eliminar Pedido"
        ariaHideApp={false}
        className="formulario-table-modal-form"
        overlayClassName="formulario-table-overlay"
      >
        <h2 className="formulario-table-modal-title">¿Estás seguro que deseas eliminar este pedido?</h2>
        <div className="formulario-table-form-actions">
          <button
            onClick={confirmDelete}
            className="formulario-table-btn-confirm"
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

export default Pedidos;
