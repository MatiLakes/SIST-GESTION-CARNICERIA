// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { useGetCategoria } from "@hooks/categoria/useGetCategoria";
import { useCreateCategoria } from "@hooks/categoria/useCreateCategoria";
import { useDeleteCategoria } from "@hooks/categoria/useDeleteCategoria";
import { useUpdateCategoria } from "@hooks/categoria/useUpdateCategoria";
import { useErrorHandlerCategoria } from "@hooks/categoria/useErrorHandlerCategoria"; // Importa el hook de errores
import Table from "../components/Table";
import Modal from "react-modal";
import styles from "@styles/categoria.module.css";
import "@styles/formulariotabledatos.css";

import Swal from "sweetalert2";

const Categorias = () => {
  const { categorias, loading, error, fetchCategorias } = useGetCategoria();
  const { handleCreate } = useCreateCategoria(fetchCategorias);
  const { handleDelete } = useDeleteCategoria(fetchCategorias);
  const { handleUpdate } = useUpdateCategoria(fetchCategorias);

  const { createError, editError, deleteError,  handleEditError, handleDeleteError } = useErrorHandlerCategoria();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoriaToEdit, setCategoriaToEdit] = useState(null);
  const [categoriaToDelete, setCategoriaToDelete] = useState(null);
  const [newCategoryData, setNewCategoryData] = useState({ nombre: "",tipo_producto: "" });
  const [formData, setFormData] = useState({ nombre: "",tipo_producto: "" });

  useEffect(() => {
    console.log("Categorías obtenidas:", categorias);
  }, [categorias]);

  const handleDeleteClick = (categoria) => {
    setCategoriaToDelete(categoria);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
    setCategoriaToDelete(null);
  };

  const confirmDelete = () => {
    if (handleDeleteError(categoriaToDelete)); // Maneja el error de eliminación

    handleDelete(categoriaToDelete.id);
    setIsDeleteModalOpen(false);
    setCategoriaToDelete(null);
  };

  const handleUpdateClick = (categoria) => {
    setCategoriaToEdit(categoria);
    setFormData({ nombre: categoria.nombre,tipo_producto: categoria.tipo_producto });
    setIsEditModalOpen(true);
  };

  const handleCreateClick = () => {
    setIsCreateModalOpen(true);
  };

  const handleCreateModalChange = (e) => {
    setNewCategoryData({ ...newCategoryData, [e.target.name]: e.target.value });
  };

  const handleCreateModalSubmit = (e) => {
    e.preventDefault();
  
    if (validateFields(newCategoryData)) {
      handleCreate(newCategoryData);
      setNewCategoryData({ nombre: "", tipo_producto: "" });
      setIsCreateModalOpen(false);
    }
  };

  const validateFields = (data) => {
    // Validación para el campo nombre (solo letras y mínimo 3 caracteres)
    if (!/^[a-zA-Z\s]{3,}$/.test(data.nombre)) {
      Swal.fire("Error", "El nombre de la categoría solo puede contener letras y debe tener al menos 3 caracteres.", "error");
      return false;
    }
  
    return true;
  };

  const handleEditChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleEditSubmit = (e) => {
  e.preventDefault();

  // Validar los campos antes de editar
  if (!validateFields(formData)) {
    return; // Si la validación falla, no continúa con el proceso
  }

  if (handleEditError(formData)) return; // Maneja el error de edición

  handleUpdate(categoriaToEdit.id, formData);
  setIsEditModalOpen(false);
};

  if (loading) return <p>Cargando categorías...</p>;
  if (error) return <p>Error: {error}</p>;

  const columns = [
    { header: "ID", key: "id" },
    { header: "Nombre", key: "nombre" },
    { header: "Tipo Producto", key: "tipo_producto" },
  ];

  return (
    <div className={styles["categoria-container"]}>
      <Table
        data={categorias}
        columns={columns}
        headerTitle="Categorías"
        onCreate={handleCreateClick}
        onEdit={handleUpdateClick}
        onDelete={handleDeleteClick}
        showEditAllButton={false}
        showViewButton={false}
        showCalendarButton = {false}
      />

      {/* Modal de Creación */}
      <Modal
        isOpen={isCreateModalOpen}
        onRequestClose={() => setIsCreateModalOpen(false)}
        contentLabel="Añadir Categoría"
        ariaHideApp={false}
        className="formulario-table-modal-form-datos"
        overlayClassName="formulario-table-overlay"
      >
        <h2 className="formulario-table-modal-title">Añadir Categoría</h2>
        <form onSubmit={handleCreateModalSubmit} className="formulario-table-formulario-table">
          <div className="formulario-table-formulario-table-datos">
            <label htmlFor="nombre">Nombre de la Categoría:</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={newCategoryData.nombre}
              onChange={handleCreateModalChange}
              required
              className="formulario-table-input"
            />
            {createError && <span className="error-message">{createError}</span>}
          </div>

          <div className="formulario-table-field-group">
                <label htmlFor="tipo_producto">Tipo producto:</label>
                <select
                  id="tipo_producto"
                  name="tipo_producto"
                  value={newCategoryData.tipo_producto}
                  onChange={handleCreateModalChange}
                  required
                  className="formulario-table-input tipo-cuenta-select"
                >
                  <option value="">Selecciona un Tipo de producto</option>
                  <option value="Cárnico">Cárnico</option>
                  <option value="No Cárnico">No Cárnico</option>
                </select>
              </div>
          <div className="formulario-table-form-actions">
            <button type="submit" className="formulario-table-btn-confirm">
              Crear
            </button>
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="formulario-table-btn-cancel"
            >
              Cancelar
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal de Edición */}
      <Modal
        isOpen={isEditModalOpen}
        onRequestClose={() => setIsEditModalOpen(false)}
        contentLabel="Editar Categoría"
        ariaHideApp={false}
        className="formulario-table-modal-form-datos"
        overlayClassName="formulario-table-overlay"
      >
        <h2 className="formulario-table-modal-title">Editar Categoría</h2>
        <form onSubmit={handleEditSubmit} className="formulario-table-formulario-table">
          <div className="formulario-table-formulario-table-datos">
            <label htmlFor="nombre">Nombre de la Categoría:</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleEditChange}
              required
              className="formulario-table-input"
            />
            {editError && <span className="error-message">{editError}</span>}
          </div>
          <div className="formulario-table-field-group">
                <label htmlFor="tipo_producto">Tipo producto:</label>
                <select
                  id="tipo_producto"
                  name="tipo_producto"
                  value={formData.tipo_producto}
                  onChange={handleEditChange}
                  required
                  className="formulario-table-input tipo-cuenta-select"
                >
                  <option value="">Selecciona un Tipo de producto</option>
                  <option value="Cárnico">Cárnico</option>
                  <option value="No Cárnico">No Cárnico</option>
                </select>
              </div>
          <div className="formulario-table-form-actions">
            <button type="submit" className="formulario-table-btn-confirm">
              Guardar Cambios
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
      </Modal>

      {/* Modal de Eliminación */}
      <Modal
        isOpen={isDeleteModalOpen}
        onRequestClose={handleDeleteModalClose}
        contentLabel="Confirmar Eliminación"
        ariaHideApp={false}
        className="formulario-table-modal-form"
        overlayClassName="formulario-table-overlay"
      >
        <h2 className="formulario-table-modal-title">Eliminar Categoría</h2>
        <p>¿Estás seguro de que deseas eliminar esta categoría?</p>
        {deleteError && <span className="error-message">{deleteError}</span>}
        <div className="formulario-table-form-actions">
          <button onClick={confirmDelete} className="formulario-table-btn-confirm">
            Confirmar
          </button>
          <button onClick={handleDeleteModalClose} className="formulario-table-btn-cancel">
            Cancelar
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Categorias;
