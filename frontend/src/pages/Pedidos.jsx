import React, { useState } from "react";
import useGetPedidos from "@hooks/pedidos/useGetPedidos.jsx";
import useCreatePedido from "@hooks/pedidos/useCreatePedido.jsx";
import useDeletePedido from "@hooks/pedidos/useDeletePedido.jsx";
import useEditPedido from "@hooks/pedidos/useEditPedido.jsx";
import useFilterPedidosByFecha from "@hooks/pedidos/useFilterPedidosByFecha.jsx";
import Swal from "sweetalert2";
import { FaEdit, FaTrash } from "react-icons/fa";

import styles from "@styles/Pedido.module.css";

const Pedidos = () => {
  const { pedidos, loading, fetchPedidos } = useGetPedidos();
  const { create } = useCreatePedido(fetchPedidos);
  const { remove } = useDeletePedido(fetchPedidos);
  const { edit } = useEditPedido(fetchPedidos);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentPedido, setCurrentPedido] = useState(null);
  const [filteredPedidos, setFilteredPedidos] = useState([]); // Para almacenar pedidos filtrados
  const [filterDate, setFilterDate] = useState(""); // Fecha de filtro

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const openEditModal = (pedido) => {
    setCurrentPedido(pedido);
    setIsEditModalOpen(true);
  };
  const closeEditModal = () => setIsEditModalOpen(false);

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
    } catch (error) {
      console.error("Error al crear el pedido:", error);
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
      closeEditModal();
    } catch (error) {
      console.error("Error al editar pedido:", error);
    }
  };

  const handleFilterPedidos = () => {
    const filtered = pedidos.filter(
      (pedido) => pedido.fecha_entrega === filterDate
    );
    setFilteredPedidos(filtered);
  };

  const handleClearFilter = () => {
    setFilteredPedidos([]); // Limpia el filtro
    setFilterDate(""); // Resetea la fecha seleccionada
  };

  const handleDeletePedido = async (id) => {
    // Mostrar alerta de confirmación con SweetAlert2
    const result = await Swal.fire({
      title: "¿Estás seguro de que quieres borrar el pedido?",
      text: "No podrás deshacer esta acción.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#000000",
      cancelButtonColor: "#FF0000",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
  
    if (result.isConfirmed) {
      try {
        await remove(id); // Llama a tu función para eliminar el pedido
        Swal.fire({
          title: "Eliminado",
          text: "El pedido ha sido eliminado con éxito.",
          icon: "success",
          confirmButtonColor: "#3085d6",
        });
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "Ocurrió un error al eliminar el pedido.",
          icon: "error",
          confirmButtonColor: "#d33",
        });
        console.error("Error al eliminar pedido:", error);
      }
    }
  };

  
  if (loading) return <p>Cargando pedidos...</p>;

  return (
    <div className={styles.container}>
      <h1>Pedidos</h1>
      <div>
      <input
    type="date"
    className={styles.filterInput}
    value={filterDate}
    onChange={(e) => setFilterDate(e.target.value)}
  />
  <button
    className={`${styles.filterButton} ${styles.filter}`}
    onClick={handleFilterPedidos}
  >
    Filtrar por fecha
  </button>
  <button
    className={`${styles.filterButton} ${styles.reset}`}
    onClick={handleClearFilter}
  >
    Mostrar todos
  </button>
</div>
      <button className={styles.createButton} onClick={openModal}>
        Crear nuevo pedido
      </button>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID Pedido</th>
            <th>Nombre Cliente</th>
            <th>Nombre Carnicero</th>
            <th>Número Cliente</th>
            <th>Productos</th>
            <th>Fecha de Entrega</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {(filteredPedidos.length > 0 ? filteredPedidos : pedidos).map(
            (pedido) => (
            <tr key={pedido.id}>
              <td>{pedido.id}</td>
              <td>{pedido.cliente_nombre}</td>
              <td>{pedido.carnicero_nombre}</td>
              <td>{pedido.telefono_cliente}</td>
              <td>{pedido.productos}</td>
              <td>{pedido.fecha_entrega}</td>
              <td>
        <button
          className={styles.iconButton}
          onClick={() => openEditModal(pedido)}
          title="Editar"
        >
          <FaEdit />
        </button>
        <button
          className={styles.iconButton}
          onClick={() => handleDeletePedido(pedido.id)}
          title="Borrar"
        >
          <FaTrash />
        </button>
      </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal para crear pedido */}
      {isModalOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Crear Nuevo Pedido</h2>
            <form onSubmit={handleCreatePedido}>
              <div className={styles.formGroup}>
                <label htmlFor="cliente">Nombre del Cliente:</label>
                <input type="text" id="cliente" name="cliente" required />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="carnicero">Nombre del Carnicero:</label>
                <input type="text" id="carnicero" name="carnicero" required />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="telefono">Número de Teléfono:</label>
                <input type="tel" id="telefono" name="telefono" required />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="productos">Productos:</label>
                <textarea id="productos" name="productos" required></textarea>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="fechaEntrega">Fecha de Entrega:</label>
                <input type="date" id="fechaEntrega" name="fechaEntrega" required />
              </div>
              <div className={styles.formActions}>
                <button type="submit" className={styles.saveButton}>
                  Guardar
                </button>
                <button type="button" className={styles.cancelButton} onClick={closeModal}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      

      {/* Modal para editar pedido */}
      {isEditModalOpen && currentPedido && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Editar Pedido</h2>
            <form onSubmit={handleEditPedido}>
              <div className={styles.formGroup}>
                <label htmlFor="cliente">Nombre del Cliente:</label>
                <input
                  type="text"
                  id="cliente"
                  name="cliente"
                  defaultValue={currentPedido.cliente_nombre}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="carnicero">Nombre del Carnicero:</label>
                <input
                  type="text"
                  id="carnicero"
                  name="carnicero"
                  defaultValue={currentPedido.carnicero_nombre}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="telefono">Número de Teléfono:</label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  defaultValue={currentPedido.telefono_cliente}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="productos">Productos:</label>
                <textarea
                  id="productos"
                  name="productos"
                  defaultValue={currentPedido.productos}
                  required
                ></textarea>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="fechaEntrega">Fecha de Entrega:</label>
                <input
                  type="date"
                  id="fechaEntrega"
                  name="fechaEntrega"
                  defaultValue={currentPedido.fecha_entrega}
                  required
                />
              </div>
              <div className={styles.formActions}>
                <button type="submit" className={styles.saveButton}>
                  Guardar Cambios
                </button>
                <button type="button" className={styles.cancelButton} onClick={closeEditModal}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pedidos;
