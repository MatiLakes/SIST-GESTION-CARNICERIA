import React, { useState, useEffect } from "react";
import useGetPersonal from "@hooks/personal/useGetPersonal";
import useCreatePersonal from "@hooks/personal/useCreatePersonal";
import useEditPersonal from "@hooks/personal/useEditPersonal";
import useDeletePersonal from "@hooks/personal/useDeletePersonal";
import Table from "../components/Table";
import Modal from "react-modal";
import Swal from "sweetalert2";
import "@styles/formulariotable.css";
import "@styles/modalCrear.css";

const Personal = () => {
  const { personal, loading, error, fetchPersonal } = useGetPersonal();
  
  useEffect(() => {
    console.log("Personal actualizado:", personal);
    console.log("Estado de carga:", loading);
    console.log("Error (si existe):", error);
  }, [personal, loading, error]);

  const { create } = useCreatePersonal(fetchPersonal);
  const { edit } = useEditPersonal(fetchPersonal);
  const { remove } = useDeletePersonal(fetchPersonal);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentPersonal, setCurrentPersonal] = useState(null);
  const [personalToDelete, setPersonalToDelete] = useState(null);

  const handleSubmit = async (e, isEdit = false) => {
    e.preventDefault();
    const form = e.target;
    const data = {
      nombre: form.nombre.value,
      seccion: form.seccion.value,
    };

    try {
      if (isEdit) {
        await edit(currentPersonal.id, data);
        setIsEditModalOpen(false);
        setCurrentPersonal(null);
      } else {
        await create(data);
        setIsModalOpen(false);
      }
      Swal.fire({
        icon: "success",
        title: "¡Éxito!",
        text: isEdit ? "Trabajador actualizado correctamente." : "Trabajador registrado exitosamente",
        confirmButtonColor: "#000000"
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo realizar la operación",
        confirmButtonColor: "#000000"
      });
    }
  };

  const handleDeleteModalOpen = (persona) => {
    setPersonalToDelete(persona);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
    setPersonalToDelete(null);
  };

  const confirmDelete = async () => {
    if (personalToDelete) {
      try {
        await remove(personalToDelete.id);
        handleDeleteModalClose();
        Swal.fire({
          icon: "success",
          title: "¡Eliminado!",
          text: "El trabajador ha sido eliminado correctamente",
          confirmButtonColor: "#000000"
        });
      } catch (error) {
        console.error("Error al eliminar trabajador:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo eliminar el trabajador",
          confirmButtonColor: "#000000"
        });
      }
    }
  };

  const renderFormContent = (isEdit = false) => {
    const defaultValues = isEdit ? currentPersonal : {};
    return (
      <>
        <div className="formulario-grupo">
          <label className="formulario-etiqueta">Nombre:</label>
          <input
            type="text"
            name="nombre"
            defaultValue={defaultValues.nombre || ""}
            placeholder="Nombre del trabajador"
            required
            className="formulario-input"
          />
        </div>

        <div className="formulario-grupo">
          <label className="formulario-etiqueta">Sección:</label>
          <input
            type="text"
            name="seccion"
            defaultValue={defaultValues.seccion || ""}
            placeholder="Sección del trabajador"
            required
            className="formulario-input"
          />
        </div>
      </>
    );
  };

  const columns = [
    { header: "Nombre", key: "nombre" },
    { header: "Sección", key: "seccion" },
  ];

  if (loading) return <div className="loading-message">Cargando personal...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <div className="higiene-container">
      <Table
        data={personal}
        columns={columns}
        headerTitle="Personal"
        onCreate={() => setIsModalOpen(true)}
        onEdit={(p) => {
          setCurrentPersonal(p);
          setIsEditModalOpen(true);
        }}
        onDelete={handleDeleteModalOpen}
        showEditAllButton={false}
        showViewButton={false}
        showCalendarButton={false}
        entidad="personal"
      />      

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Crear Personal"
        ariaHideApp={false}
        className="modal-crear"
        overlayClassName="modal-overlay"
        closeTimeoutMS={300}
      >
        <form onSubmit={(e) => handleSubmit(e, false)} className="modal-crear-formulario">          
          <div className="modal-crear-header">
            <h2 className="modal-crear-titulo">Nuevo Trabajador</h2>
            <button type="button" onClick={() => setIsModalOpen(false)} className="modal-crear-cerrar">×</button>
            <button type="submit" className="modal-boton-crear">Guardar</button>
          </div>
          {renderFormContent(false)}
        </form>
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onRequestClose={() => setIsEditModalOpen(false)}
        contentLabel="Editar Personal"
        ariaHideApp={false}
        className="modal-crear"
        overlayClassName="modal-overlay"
        closeTimeoutMS={300}
      >
        <form onSubmit={(e) => handleSubmit(e, true)} className="modal-crear-formulario">
          <div className="modal-crear-header">
            <h2 className="modal-crear-titulo">Editar Trabajador</h2>
            <button type="button" onClick={() => setIsEditModalOpen(false)} className="modal-crear-cerrar">×</button>
            <button type="submit" className="modal-boton-crear">Guardar</button>
          </div>
          {currentPersonal && renderFormContent(true)}
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
        style={{ content: { maxWidth: '400px' } }}
      >
        <h2 className="formulario-table-modal-title">Confirmar Eliminación</h2>
        <p>¿Estás seguro de que deseas eliminar este trabajador?</p>
        {personalToDelete && (
          <div style={{ margin: '20px 0', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
            <p><strong>Nombre:</strong> {personalToDelete.nombre}</p>
            <p><strong>Sección:</strong> {personalToDelete.seccion}</p>
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

export default Personal;
