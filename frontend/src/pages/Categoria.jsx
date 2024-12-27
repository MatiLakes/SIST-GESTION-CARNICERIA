import React, { useEffect, useState } from "react";
import { useGetCategoria } from "@hooks/categoria/useGetCategoria";
import { useCreateCategoria } from "@hooks/categoria/useCreateCategoria";
import { useDeleteCategoria } from "@hooks/categoria/useDeleteCategoria";
import { useUpdateCategoria } from "@hooks/categoria/useUpdateCategoria";
import Table from "../components/Table";
import Modal from "react-modal";
import styles from "@styles/categoria.module.css";

import "@styles/formulariotable.css";

const Categorias = () => {
  const { categorias, loading, error, fetchCategorias } = useGetCategoria();
  const { handleCreate } = useCreateCategoria(fetchCategorias);
  const { handleDelete } = useDeleteCategoria(fetchCategorias);
  const { handleUpdate } = useUpdateCategoria(fetchCategorias);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoriaToEdit, setCategoriaToEdit] = useState(null);
  const [categoriaToDelete, setCategoriaToDelete] = useState(null);
  const [newCategoryData, setNewCategoryData] = useState({ nombre: "" });
  const [formData, setFormData] = useState({ nombre: "" });

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
    if (categoriaToDelete) {
      handleDelete(categoriaToDelete.id);
      setIsDeleteModalOpen(false);
      setCategoriaToDelete(null);
    }
  };

  const handleUpdateClick = (categoria) => {
    setCategoriaToEdit(categoria);
    setFormData({ nombre: categoria.nombre });
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
    if (newCategoryData.nombre.trim() === "") {
      alert("El nombre de la categoría no puede estar vacío");
      return;
    }
    handleCreate(newCategoryData);
    setNewCategoryData({ nombre: "" });
    setIsCreateModalOpen(false);
  };

  const handleEditChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (formData.nombre.trim() === "") {
      alert("El nombre de la categoría no puede estar vacío");
      return;
    }
    handleUpdate(categoriaToEdit.id, formData);
    setIsEditModalOpen(false);
  };

  if (loading) return <p>Cargando categorías...</p>;
  if (error) return <p>Error: {error}</p>;

  const columns = [
    { header: "ID", key: "id" },
    { header: "Nombre", key: "nombre" },
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
      />

      {/* Modal de Creación */}
      <Modal
        isOpen={isCreateModalOpen}
        onRequestClose={() => setIsCreateModalOpen(false)}
        contentLabel="Añadir Categoría"
        ariaHideApp={false}
        className="formulario-table-modal-form"
        overlayClassName="formulario-table-overlay"
      >
        <h2 className="formulario-table-modal-title">Añadir Categoría</h2>
        <form onSubmit={handleCreateModalSubmit} className="formulario-table-formulario-table">
          <div className="formulario-table-form-group">
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
        className="formulario-table-modal-form"
        overlayClassName="formulario-table-overlay"
      >
        <h2 className="formulario-table-modal-title">Editar Categoría</h2>
        <form onSubmit={handleEditSubmit} className="formulario-table-formulario-table">
          <div className="formulario-table-form-group">
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

      {/* Modal de Confirmación de Eliminación */}
      <Modal
        isOpen={isDeleteModalOpen}
        onRequestClose={handleDeleteModalClose}
        contentLabel="Eliminar Categoría"
        ariaHideApp={false}
        className="formulario-table-modal-form"
        overlayClassName="formulario-table-overlay"
      >
        <h2 className="formulario-table-modal-title">Confirmar Eliminación</h2>
        <p>¿Estás seguro de que deseas eliminar la categoría {categoriaToDelete?.nombre}?</p>
        <div className="formulario-table-form-actions">
          <button
            type="button"
            className="formulario-table-btn-eliminar"
            onClick={confirmDelete}
          >
            Eliminar
          </button>
          <button
            type="button"
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

export default Categorias;
