import React, { useState, useEffect } from "react";
import useGetControles from "@hooks/controlHigiene/useGetControles";
import useCreateControl from "@hooks/controlHigiene/useCreateControl";
import useEditControl from "@hooks/controlHigiene/useEditControl";
import useDeleteControl from "@hooks/controlHigiene/useDeleteControl";
import useGetPersonal from "@hooks/personal/useGetPersonal";
import Table from "../components/Table";
import Modal from "react-modal";
import Swal from "sweetalert2";
import "@styles/Higiene.css";

const ControlHigiene = () => {
  const { controles, loading, error, fetchControles } = useGetControles();
  const { personal } = useGetPersonal();
  const { create } = useCreateControl(fetchControles);
  const { edit } = useEditControl(fetchControles);
  const { remove } = useDeleteControl(fetchControles);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentControl, setCurrentControl] = useState(null);

  // Registra los datos para diagnosticar el problema
  useEffect(() => {
    console.log("Controles actualizados:", controles);
    console.log("Estado de carga:", loading);
    console.log("Error (si existe):", error);
  }, [controles, loading, error]);

  const accOptions = [
    "ACC N°1", "ACC N°2", "ACC N°3", "ACC N°4",
    "ACC N°5", "ACC N°6", "ACC N°7", "No Aplica"
  ];

  const handleSubmit = async (e, isEdit = false) => {
    e.preventDefault();
    const form = e.target;
    const data = {
      fecha: form.fecha.value,
      personalId: parseInt(form.personalId.value),
      usoCofia: form.usoCofia.checked,
      usoMascarilla: form.usoMascarilla.checked,
      higieneManos: form.higieneManos.checked,
      unasCortas: form.unasCortas.checked,
      afeitado: form.afeitado.checked,
      uniformeLimpio: form.uniformeLimpio.checked,
      sinAccesorios: form.sinAccesorios.checked,
      vbCumplimiento: form.vbCumplimiento.value,
      nroAccionCorrectiva: form.nroAccionCorrectiva.value,
      observacion: form.observacion.value || ""
    };

    try {
      if (isEdit) {
        await edit(currentControl.id, data);
        setIsEditModalOpen(false);
        setCurrentControl(null);
      } else {
        await create(data);
        setIsModalOpen(false);
      }
      Swal.fire("Guardado", "Registro actualizado correctamente", "success");
    } catch {
      Swal.fire("Error", "No se pudo guardar el registro", "error");
    }
  };

  const handleDelete = async (registro) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar registro?",
      text: `Fecha: ${registro.fecha}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar"
    });

    if (confirm.isConfirmed) {
      try {
        await remove(registro.id);
        Swal.fire("Eliminado", "Registro eliminado correctamente", "success");
      } catch {
        Swal.fire("Error", "No se pudo eliminar el registro", "error");
      }
    }
  };

  const columns = [
    { header: "ID", key: "id" },
    { header: "Fecha", key: "fecha" },
    { header: "Nombre", key: "personal.nombre" },
    { header: "Sección", key: "personal.seccion" },
    { header: "V°B°", key: "vbCumplimiento" },
    { header: "ACC", key: "nroAccionCorrectiva" },
    { header: "Observación", key: "observacion" },
  ];

  const renderForm = (isEdit = false) => {
    const defaultValues = isEdit ? currentControl : {};
    return (
      <form onSubmit={(e) => handleSubmit(e, isEdit)}>
        <label>Fecha: <input type="date" name="fecha" defaultValue={defaultValues.fecha || ""} required /></label>
        <label>Trabajador:
          <select name="personalId" defaultValue={defaultValues.personal?.id || ""} required>
            <option value="">Seleccione...</option>
            {personal.map(p => (
              <option key={p.id} value={p.id}>{p.nombre} ({p.seccion})</option>
            ))}
          </select>
        </label>
        <div>
          {["usoCofia", "usoMascarilla", "higieneManos", "unasCortas", "afeitado", "uniformeLimpio", "sinAccesorios"].map((field) => (
            <label key={field}>
              <input
                type="checkbox"
                name={field}
                defaultChecked={defaultValues[field] || false}
              /> {field}
            </label>
          ))}
        </div>
        <label>V°B° Cumplimiento:
          <select name="vbCumplimiento" defaultValue={defaultValues.vbCumplimiento || "C"} required>
            <option value="C">C</option>
            <option value="NC">NC</option>
          </select>
        </label>
        <label>ACC:
          <select name="nroAccionCorrectiva" defaultValue={defaultValues.nroAccionCorrectiva || "No Aplica"}>
            {accOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </label>
        <label>Observación:
          <textarea name="observacion" defaultValue={defaultValues.observacion || ""}></textarea>
        </label>
        <button type="submit">Guardar</button>
      </form>
    );
  };
  // Renderiza un mensaje de carga o error cuando sea necesario
  if (loading) return <div className="loading-message">Cargando registros de higiene...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <div className="higiene-container">
      <Table
        data={controles}
        columns={columns}
        headerTitle="Control Higiene"
        onCreate={() => setIsModalOpen(true)}
        onEdit={(ctrl) => {
          setCurrentControl(ctrl);
          setIsEditModalOpen(true);
        }}
        onDelete={handleDelete}
        showEditAllButton={false}
        showViewButton={false}
        entidad="controles"
      />

      <Modal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)} ariaHideApp={false}>
        <h2>Nuevo Registro Higiene</h2>
        {renderForm(false)}
      </Modal>

      <Modal isOpen={isEditModalOpen} onRequestClose={() => setIsEditModalOpen(false)} ariaHideApp={false}>
        <h2>Editar Registro Higiene</h2>
        {currentControl && renderForm(true)}
      </Modal>
    </div>
  );
};

export default ControlHigiene;
