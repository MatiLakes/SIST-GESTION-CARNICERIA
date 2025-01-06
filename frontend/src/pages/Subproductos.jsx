import React, { useState } from "react";
import useGetSubproductos from "@hooks/subproductos/useGetSubproductos";
import useCreateSubproducto from "@hooks/subproductos/useCreateSubproducto";
import useDeleteSubproducto from "@hooks/subproductos/useDeleteSubproducto";
import useEditSubproducto from "@hooks/subproductos/useEditSubproducto";
import Swal from "sweetalert2";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";

import styles from "@styles/Subproductos.module.css";

const Subproductos = () => {
  const { subproductos, loading, fetchSubproductos } = useGetSubproductos();
  const { create } = useCreateSubproducto(fetchSubproductos);
  const { remove } = useDeleteSubproducto(fetchSubproductos);
  const { edit } = useEditSubproducto(fetchSubproductos);
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
    ["precioGuata", "precioCorazon", "precioCabezas", "precioLenguas", "precioChunchul", "precioHigado", "precioRinon", "precioPatas", "precioCharcha"].forEach(
        (campo) => {
          if (newSubproducto[campo]) {
            newSubproducto[campo] = parseFloat(newSubproducto[campo]);
          }
        }
      );
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
            ${["guata", "corazon", "cabezas", "lenguas", "chunchul", "higado", "rinon", "patas", "charcha"]
              .map(
                (item) => `
                  <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;">${item}</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${subproducto[`${item}Decomisados`] || 0}</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${subproducto[`${item}Entregados`] || 0}</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${subproducto[`precio${item.charAt(0).toUpperCase() + item.slice(1)}`] || 0}</td>
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

  return (
    <div className={styles.container}>
      <h1>Subproductos</h1>
      <button className={styles.createButton} onClick={openModal}>
        Crear nuevo subproducto
      </button>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Fecha Faena</th>
            <th>Animales Faenados</th>
            <th>Fecha Entrega</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {subproductos.map((subproducto) => (
            <tr key={subproducto.id}>
              <td>{subproducto.id}</td>
              <td>{subproducto.fechaFaena}</td>
              <td>{subproducto.numeroAnimalesFaenados}</td>
              <td>{subproducto.fechaEntrega}</td>
              <td>
                <button
                  className={styles.iconButton}
                  onClick={() => handleViewDetails(subproducto)}
                  title="Ver detalles"
                >
                  <FaEye />
                </button>
                <button
                  className={styles.iconButton}
                  onClick={() => openEditModal(subproducto)}
                  title="Editar"
                >
                  <FaEdit />
                </button>
                <button
                  className={styles.iconButton}
                  onClick={() => handleDelete(subproducto.id)}
                  title="Borrar"
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal para creación */}
      {isModalOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Crear Nuevo Subproducto</h2>
            <form onSubmit={handleCreateSubproducto}>
              <div className={styles.rowGroup}>
                <div className={styles.formGroup}>
                  <label htmlFor="fechaFaena">Fecha Faena:</label>
                  <input type="date" id="fechaFaena" name="fechaFaena" required />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="numeroAnimalesFaenados">Animales Faenados:</label>
                  <input
                    type="number"
                    id="numeroAnimalesFaenados"
                    name="numeroAnimalesFaenados"
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="fechaEntrega">Fecha Entrega:</label>
                  <input type="date" id="fechaEntrega" name="fechaEntrega" required />
                </div>
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
                <div key={item} className={styles.rowGroup}>
                  <div className={styles.formGroup}>
                    <label htmlFor={`${item}Decomisados`}>Decomisados ({item}):</label>
                    <input
                      type="number"
                      id={`${item}Decomisados`}
                      name={`${item}Decomisados`}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor={`${item}Entregados`}>Entregados ({item}):</label>
                    <input
                      type="number"
                      id={`${item}Entregados`}
                      name={`${item}Entregados`}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor={`${item}Precio`}>Precio ({item}):</label>
                    <input
                      type="number"
                      id={`${item}Precio`}
                      name={`${item}Precio`}
                      required
                    />
                  </div>
                </div>
              ))}
              <div className={styles.formActions}>
                <button type="submit" className={styles.saveButton}>
                  Guardar
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className={styles.cancelButton}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para edición */}
      {isEditModalOpen && currentSubproducto && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Editar Subproducto</h2>
            <form onSubmit={handleEditSubproducto}>
              <div className={styles.rowGroup}>
                <div className={styles.formGroup}>
                  <label htmlFor="fechaFaena">Fecha Faena:</label>
                  <input
                    type="date"
                    id="fechaFaena"
                    name="fechaFaena"
                    value={currentSubproducto.fechaFaena}
                    onChange={(e) =>
                      setCurrentSubproducto({
                        ...currentSubproducto,
                        fechaFaena: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="numeroAnimalesFaenados">Animales Faenados:</label>
                  <input
                    type="number"
                    id="numeroAnimalesFaenados"
                    name="numeroAnimalesFaenados"
                    value={currentSubproducto.numeroAnimalesFaenados}
                    onChange={(e) =>
                      setCurrentSubproducto({
                        ...currentSubproducto,
                        numeroAnimalesFaenados: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="fechaEntrega">Fecha Entrega:</label>
                  <input
                    type="date"
                    id="fechaEntrega"
                    name="fechaEntrega"
                    value={currentSubproducto.fechaEntrega}
                    onChange={(e) =>
                      setCurrentSubproducto({
                        ...currentSubproducto,
                        fechaEntrega: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>

              {["guata", "corazon", "cabezas", "lenguas", "chunchul", "higado", "rinon", "patas", "charcha"].map((item) => (
  <div key={item} className={styles.rowGroup}>
    <div className={styles.formGroup}>
      <label htmlFor={`${item}Decomisados`}>Decomisados ({item}):</label>
      <input
        type="number"
        id={`${item}Decomisados`}
        name={`${item}Decomisados`}
        value={currentSubproducto[`${item}Decomisados`] || ""}
        onChange={(e) =>
          setCurrentSubproducto({
            ...currentSubproducto,
            [`${item}Decomisados`]: e.target.value,
          })
        }
        required
      />
    </div>
    <div className={styles.formGroup}>
      <label htmlFor={`${item}Entregados`}>Entregados ({item}):</label>
      <input
        type="number"
        id={`${item}Entregados`}
        name={`${item}Entregados`}
        value={currentSubproducto[`${item}Entregados`] || ""}
        onChange={(e) =>
          setCurrentSubproducto({
            ...currentSubproducto,
            [`${item}Entregados`]: e.target.value,
          })
        }
        required
      />
    </div>
    <div className={styles.formGroup}>
      <label htmlFor={`${item}Precio`}>Precio ({item}):</label>
      <input
        type="number"
        id={`${item}Precio`}
        name={`precio${item.charAt(0).toUpperCase() + item.slice(1)}`}
        value={currentSubproducto[`precio${item.charAt(0).toUpperCase() + item.slice(1)}`] || ""}
        onChange={(e) =>
          setCurrentSubproducto({
            ...currentSubproducto,
            [`precio${item.charAt(0).toUpperCase() + item.slice(1)}`]: e.target.value,
          })
        }
        required
      />
    </div>
  </div>
))}
              <div className={styles.formActions}>
                <button type="submit" className={styles.saveButton}>
                  Guardar Cambios
                </button>
                <button
                  type="button"
                  onClick={closeEditModal}
                  className={styles.cancelButton}
                >
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

export default Subproductos;
