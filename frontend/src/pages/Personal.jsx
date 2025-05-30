import React, { useState, useEffect } from "react";
import useGetPersonal from "@hooks/personal/useGetPersonal";
import useCreatePersonal from "@hooks/personal/useCreatePersonal";
import useEditPersonal from "@hooks/personal/useEditPersonal";
import useDeletePersonal from "@hooks/personal/useDeletePersonal";
import Table from "../components/Table";
import Modal from "react-modal";
import Swal from "sweetalert2";
import "@styles/formulariotable.css";
import "@styles/modalPersonal.css";

const Personal = () => {
  const { personal, loading, error, fetchPersonal } = useGetPersonal();
  
  // Registra los datos para diagnosticar el problema
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
  const [currentPersonal, setCurrentPersonal] = useState(null);

  const handleCreate = async (event) => {
    event.preventDefault();
    const form = event.target;
    const data = {
      nombre: form.nombre.value,
      seccion: form.seccion.value,
    };

    try {
      await create(data);
      setIsModalOpen(false);
      Swal.fire("Creado", "Trabajador registrado exitosamente", "success");
    } catch {
      Swal.fire("Error", "No se pudo registrar el trabajador", "error");
    }
  };

  const handleEdit = async (event) => {
    event.preventDefault();
    const form = event.target;
    const data = {
      nombre: form.nombre.value,
      seccion: form.seccion.value,
    };

    try {
      await edit(currentPersonal.id, data);
      setIsEditModalOpen(false);
      setCurrentPersonal(null);
      Swal.fire("Actualizado", "Datos actualizados exitosamente", "success");
    } catch {
      Swal.fire("Error", "No se pudo actualizar", "error");
    }
  };

  const handleDelete = async (persona) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar trabajador?",
      text: `${persona.nombre} (${persona.seccion})`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#aaa",
      confirmButtonText: "Sí, eliminar",
    });

    if (confirm.isConfirmed) {
      try {
        await remove(persona.id);
        Swal.fire("Eliminado", "Trabajador eliminado", "success");
      } catch {
        Swal.fire("Error", "No se pudo eliminar", "error");
      }
    }
  };

  const columns = [
    { header: "ID", key: "id" },
    { header: "Nombre", key: "nombre" },
    { header: "Sección", key: "seccion" },
  ];
  // Renderiza un mensaje de carga o error cuando sea necesario
  if (loading) return <div className="loading-message">Cargando personal...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <div className="categoria-container">
      <Table
        data={personal}
        columns={columns}
        headerTitle="Personal"
        onCreate={() => setIsModalOpen(true)}
        onEdit={(p) => {
          setCurrentPersonal(p);
          setIsEditModalOpen(true);
        }}
        onDelete={handleDelete}
        showEditAllButton={false}
        showViewButton={false}
        entidad="personal"
      />      <Modal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)} ariaHideApp={false}>
        <div className="modal-form-personal">
          <div className="modal-header-personal">
            <h2 style={{ margin: 0 }}>Agregar Trabajador</h2>
            <button type="submit" form="createForm" className="guardar-btn-personal">Guardar</button>
          </div>
          <div className="modal-body-personal">
            <form id="createForm" onSubmit={handleCreate}>
              <div className="form-row-personal">
                <input name="nombre" placeholder="Nombre" required />
              </div>
              <div className="form-row-personal">
                <input name="seccion" placeholder="Sección" required />
              </div>
            </form>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isEditModalOpen} onRequestClose={() => setIsEditModalOpen(false)} ariaHideApp={false}>
        {currentPersonal && (
          <div className="modal-form-personal">
            <div className="modal-header-personal">
              <h2 style={{ margin: 0 }}>Editar Trabajador</h2>
              <button type="submit" form="editForm" className="guardar-btn-personal">Guardar</button>
            </div>
            <div className="modal-body-personal">
              <form id="editForm" onSubmit={handleEdit}>
                <div className="form-row-personal">
                  <input name="nombre" defaultValue={currentPersonal.nombre} placeholder="Nombre" required />
                </div>
                <div className="form-row-personal">
                  <input name="seccion" defaultValue={currentPersonal.seccion} placeholder="Sección" required />
                </div>
              </form>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Personal;
