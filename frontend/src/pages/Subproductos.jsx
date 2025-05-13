import React, { useState } from "react";
import useGetSubproductos from "@hooks/subproductos/useGetSubproductos";
import useCreateSubproducto from "@hooks/subproductos/useCreateSubproducto";
import useDeleteSubproducto from "@hooks/subproductos/useDeleteSubproducto";
import useEditSubproducto from "@hooks/subproductos/useEditSubproducto";
import Table from "../components/Table";
import Modal from "react-modal";
import Swal from "sweetalert2";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import styles from "@styles/Subproductos.module.css";
import "@styles/formulariotable.css";

const Subproductos = () => {
  const { subproductos, loading, fetchSubproductos } = useGetSubproductos();
  const { create } = useCreateSubproducto(fetchSubproductos);
  const { remove } = useDeleteSubproducto(fetchSubproductos);
  const { edit } = useEditSubproducto(fetchSubproductos);

  console.log('Estado actual de subproductos:', subproductos);
  console.log('Estado de carga:', loading);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentSubproducto, setCurrentSubproducto] = useState(null);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const openEditModal = (subproducto) => {
    setCurrentSubproducto(subproducto);
    setIsEditModalOpen(true);
  };
  const closeEditModal = () => setIsEditModalOpen(false);
  const handleCreateSubproducto = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const newSubproducto = Object.fromEntries(formData.entries());
    console.log('Datos del nuevo subproducto:', newSubproducto);
    [
      "precioGuata",
      "precioCorazon",
      "precioCabezas",
      "precioLenguas",
      "precioChunchul",
      "precioHigado",
      "precioRinon",
      "precioPatas",
      "precioCharcha",
    ].forEach((campo) => {
      if (newSubproducto[campo]) {
        newSubproducto[campo] = parseFloat(newSubproducto[campo]);
      }
    });
    try {
      await create(newSubproducto);
      closeModal();
    } catch (error) {
      console.error("Error al crear el subproducto:", error);
    }
  };
  const handleEditSubproducto = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const updatedSubproducto = Object.fromEntries(formData.entries());
    console.log('Datos del subproducto a editar:', updatedSubproducto);

    try {
      await edit(currentSubproducto.id, updatedSubproducto);
      closeEditModal();
    } catch (error) {
      console.error("Error al editar subproducto:", error);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "¿Estás seguro de que quieres borrar este subproducto?",
      text: "No podrás deshacer esta acción.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await remove(id);
        Swal.fire("Eliminado", "El subproducto ha sido eliminado.", "success");
      } catch (error) {
        Swal.fire("Error", "Hubo un error al eliminar el subproducto.", "error");
      }
    }
  };

  const handleViewDetails = (subproducto) => {
    Swal.fire({
      title: "Detalles del Subproducto",
      html: `
        <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 14px;">
          <thead>
            <tr style="background-color: black; color: white;">
              <th style="padding: 8px; border: 1px solid #ddd;">Producto</th>
              <th style="padding: 8px; border: 1px solid #ddd;">Decomisados</th>
              <th style="padding: 8px; border: 1px solid #ddd;">Entregados</th>
              <th style="padding: 8px; border: 1px solid #ddd;">Precio</th>
            </tr>
          </thead>
          <tbody>
            ${[
              "guata",
              "corazon",
              "cabezas",
              "lenguas",
              "chunchul",
              "higado",
              "rinon",
              "patas",
              "charcha",
            ]
              .map(
                (item) => `
                  <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;">${item}</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${
                      subproducto[`${item}Decomisados`] || 0
                    }</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${
                      subproducto[`${item}Entregados`] || 0
                    }</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${
                      subproducto[
                        `precio${item.charAt(0).toUpperCase() + item.slice(1)}`
                      ] || 0
                    }</td>
                  </tr>
                `
              )
              .join("")}
          </tbody>
        </table>
      `,
      icon: "info",
      confirmButtonText: "OK",
      confirmButtonColor: "#d32f2f",
    });
  };

  if (loading) return <p>Cargando subproductos...</p>;

  const columns = [
    { header: "ID", key: "id" },
    { header: "Fecha Faena", key: "fechaFaena" },
    { header: "Animales Faenados", key: "numeroAnimalesFaenados" },
    { header: "Fecha Entrega", key: "fechaEntrega" },
  ];

  return (
    <div className={styles["container"]}>
      <Table
        data={subproductos}
        columns={columns}
        headerTitle="Subproductos"
        onCreate={openModal}
        onEdit={openEditModal}
        onDelete={handleDelete}
        showEditAllButton={false}
        showViewButton={false}
        entidad="subproductos"
      />

      {/* Modal para creación */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Crear Subproducto"
        ariaHideApp={false}
        className="formulario-table-modal-form"
        overlayClassName="formulario-table-overlay"
      >
        <h2 className="formulario-table-modal-title">Crear Nuevo Subproducto</h2>
        <form
          onSubmit={handleCreateSubproducto}
          className="formulario-table-formulario-table"
        >
          <div className="formulario-table-field-group">
            <label htmlFor="fechaFaena">Fecha Faena:</label>
            <input
              type="date"
              id="fechaFaena"
              name="fechaFaena"
              required
              className="formulario-table-input"
            />
          </div>
          <div className="formulario-table-field-group">
            <label htmlFor="numeroAnimalesFaenados">Animales Faenados:</label>
            <input
              type="number"
              id="numeroAnimalesFaenados"
              name="numeroAnimalesFaenados"
              required
              className="formulario-table-input"
            />
          </div>
          <div className="formulario-table-field-group">
            <label htmlFor="fechaEntrega">Fecha Entrega:</label>
            <input
              type="date"
              id="fechaEntrega"
              name="fechaEntrega"
              required
              className="formulario-table-input"
            />
          </div>

          {[
            "guata",
            "corazon",
            "cabezas",
            "lenguas",
            "chunchul",
            "higado",
            "rinon",
            "patas",
            "charcha",
          ].map((item) => (
            <div key={item} className="formulario-table-field-group">
              <label htmlFor={`${item}Decomisados`}>Decomisados ({item}):</label>
              <input
                type="number"
                id={`${item}Decomisados`}
                name={`${item}Decomisados`}
                required
                className="formulario-table-input"
              />
              <label htmlFor={`${item}Entregados`}>Entregados ({item}):</label>
              <input
                type="number"
                id={`${item}Entregados`}
                name={`${item}Entregados`}
                required
                className="formulario-table-input"
              />
              <label htmlFor={`${item}Precio`}>Precio ({item}):</label>
              <input
                type="number"
                id={`${item}Precio`}
                name={`precio${item.charAt(0).toUpperCase() + item.slice(1)}`}
                required
                className="formulario-table-input"
              />
            </div>
          ))}

          <div className="formulario-table-form-actions">
            <button type="submit" className="formulario-table-btn-confirm">
              Crear
            </button>
            <button
              type="button"
              onClick={closeModal}
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
        onRequestClose={closeEditModal}
        contentLabel="Editar Subproducto"
        ariaHideApp={false}
        className="formulario-table-modal-form"
        overlayClassName="formulario-table-overlay"
      >
        <h2 className="formulario-table-modal-title">Editar Subproducto</h2>
        {currentSubproducto && (
          <form
            onSubmit={handleEditSubproducto}
            className="formulario-table-formulario-table"
          >
            {/* Los mismos campos que el modal de creación pero con valores por defecto */}
            <div className="formulario-table-field-group">
              <label htmlFor="fechaFaena">Fecha Faena:</label>
              <input
                type="date"
                id="fechaFaena"
                name="fechaFaena"
                defaultValue={currentSubproducto.fechaFaena}
                required
                className="formulario-table-input"
              />
            </div>
            <div className="formulario-table-field-group">
              <label htmlFor="numeroAnimalesFaenados">Animales Faenados:</label>
              <input
                type="number"
                id="numeroAnimalesFaenados"
                name="numeroAnimalesFaenados"
                defaultValue={currentSubproducto.numeroAnimalesFaenados}
                required
                className="formulario-table-input"
              />
            </div>
            <div className="formulario-table-field-group">
              <label htmlFor="fechaEntrega">Fecha Entrega:</label>
              <input
                type="date"
                id="fechaEntrega"
                name="fechaEntrega"
                defaultValue={currentSubproducto.fechaEntrega}
                required
                className="formulario-table-input"
              />
            </div>

            {[
              "guata",
              "corazon",
              "cabezas",
              "lenguas",
              "chunchul",
              "higado",
              "rinon",
              "patas",
              "charcha",
            ].map((item) => (
              <div key={item} className="formulario-table-field-group">
                <label htmlFor={`${item}Decomisados`}>
                  Decomisados ({item}):
                </label>
                <input
                  type="number"
                  id={`${item}Decomisados`}
                  name={`${item}Decomisados`}
                  defaultValue={currentSubproducto[`${item}Decomisados`]}
                  required
                  className="formulario-table-input"
                />
                <label htmlFor={`${item}Entregados`}>Entregados ({item}):</label>
                <input
                  type="number"
                  id={`${item}Entregados`}
                  name={`${item}Entregados`}
                  defaultValue={currentSubproducto[`${item}Entregados`]}
                  required
                  className="formulario-table-input"
                />
                <label htmlFor={`${item}Precio`}>Precio ({item}):</label>
                <input
                  type="number"
                  id={`${item}Precio`}
                  name={`precio${item.charAt(0).toUpperCase() + item.slice(1)}`}
                  defaultValue={
                    currentSubproducto[
                      `precio${item.charAt(0).toUpperCase() + item.slice(1)}`
                    ]
                  }
                  required
                  className="formulario-table-input"
                />
              </div>
            ))}

            <div className="formulario-table-form-actions">
              <button type="submit" className="formulario-table-btn-confirm">
                Guardar Cambios
              </button>
              <button
                type="button"
                onClick={closeEditModal}
                className="formulario-table-btn-cancel"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default Subproductos;
