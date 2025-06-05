import React, { useState, useEffect } from "react";
import useGetControles from "@hooks/controlHigiene/useGetControles";
import useCreateControl from "@hooks/controlHigiene/useCreateControl";
import useEditControl from "@hooks/controlHigiene/useEditControl";
import useDeleteControl from "@hooks/controlHigiene/useDeleteControl";
import useGetPersonal from "@hooks/personal/useGetPersonal";
import Table from "../components/Table";
import Modal from "react-modal";
import Swal from "sweetalert2";
import { MdOutlineEdit } from "react-icons/md";
import "@styles/Higiene.css";
import "@styles/modalCrear.css";
import "@styles/modalDetalles.css";

const ControlHigiene = () => {
  const { controles, loading, error, fetchControles } = useGetControles();
  const { personal } = useGetPersonal();
  const { create } = useCreateControl(fetchControles);
  const { edit } = useEditControl(fetchControles);
  const { remove } = useDeleteControl(fetchControles);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentControl, setCurrentControl] = useState(null);
  const [controlToDelete, setControlToDelete] = useState(null);
  const [controlToView, setControlToView] = useState(null);

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
      Swal.fire({
        icon: "success",
        title: "¡Éxito!",
        text: isEdit ? "Registro actualizado correctamente" : "Registro creado correctamente",
        confirmButtonColor: "#000000"
      });
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo guardar el registro",
        confirmButtonColor: "#000000"
      });
    }
  };

  const handleDeleteModalOpen = (control) => {
    setControlToDelete(control);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
    setControlToDelete(null);
  };

  const confirmDelete = async () => {
    if (controlToDelete) {
      try {
        await remove(controlToDelete.id);
        handleDeleteModalClose();
        Swal.fire({
          icon: "success",
          title: "¡Eliminado!",
          text: "El registro ha sido eliminado correctamente",
          confirmButtonColor: "#000000"
        });
      } catch (error) {
        console.error("Error al eliminar registro:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo eliminar el registro",
          confirmButtonColor: "#000000"
        });
      }
    }
  };

  const handleViewClick = (control) => {
    setControlToView(control);
    setIsViewModalOpen(true);
  };

  const handleViewModalClose = () => {
    setIsViewModalOpen(false);
    setControlToView(null);
  };

  const columns = [
    { header: "Fecha", key: "fecha" },
    { header: "Nombre", key: "personal.nombre" },
    { header: "Sección", key: "personal.seccion" },
    { header: "V°B°", key: "vbCumplimiento" },
    { header: "ACC", key: "nroAccionCorrectiva" },
  ];  const renderFormContent = (isEdit = false) => {
    const defaultValues = isEdit ? currentControl : {};
    return (
      <>
        <div className="formulario-grupo">
          <label className="formulario-etiqueta">Fecha:</label>
          <input
            type="date"
            name="fecha"
            defaultValue={defaultValues.fecha || ""}
            required
            className="formulario-input"
          />
        </div>

        <div className="formulario-grupo">
          <label className="formulario-etiqueta">Trabajador:</label>
          <select
            name="personalId"
            defaultValue={defaultValues.personal?.id || ""}
            required
            className="formulario-input"
          >
            <option value="">Seleccione...</option>
            {[...personal].sort((a, b) => a.nombre.localeCompare(b.nombre)).map(p => (
              <option key={p.id} value={p.id}>{p.nombre} ({p.seccion})</option>
            ))}
          </select>
        </div>

        <div className="formulario-grupo">
          <label className="formulario-etiqueta">Checklist de Higiene:</label>
          <div className="checklist-container">            
            {[
              { id: "usoCofia", label: "Uso Cofia" },
              { id: "usoMascarilla", label: "Uso Mascarilla" },
              { id: "higieneManos", label: "Higiene de Manos" },
              { id: "unasCortas", label: "Uñas Cortas" },
              { id: "afeitado", label: "Afeitado" },
              { id: "uniformeLimpio", label: "Uniforme Limpio" },
              { id: "sinAccesorios", label: "Sin Accesorios" }
            ].map(({ id, label }) => (
              <div key={id} className="checkbox-grupo">
                <input
                  type="checkbox"
                  id={id}
                  name={id}
                  defaultChecked={defaultValues[id] || false}
                  className="checkbox-input"
                />
                <label htmlFor={id} className="checkbox-label">{label}</label>
              </div>
            ))}
          </div>
        </div>

        <div className="formulario-grupo">
          <label className="formulario-etiqueta">V°B° Cumplimiento:</label>
          <select
            name="vbCumplimiento"
            defaultValue={defaultValues.vbCumplimiento || "C"}
            required
            className="formulario-input"
          >
            <option value="C">C</option>
            <option value="NC">NC</option>
          </select>
        </div>

        <div className="formulario-grupo">
          <label className="formulario-etiqueta">ACC:</label>
          <select
            name="nroAccionCorrectiva"
            defaultValue={defaultValues.nroAccionCorrectiva || "No Aplica"}
            className="formulario-input"
          >
            {accOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        <div className="formulario-grupo">
          <label className="formulario-etiqueta">Observación:</label>
          <textarea
            name="observacion"
            defaultValue={defaultValues.observacion || ""}
            className="formulario-input"
            rows="3"
          ></textarea>
        </div>
      </>
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
        onDelete={handleDeleteModalOpen}
        onView={handleViewClick}
        showEditAllButton={false}
        showViewButton={true}
        entidad="controles"
      />      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Crear Control de Higiene"
        ariaHideApp={false}
        className="modal-crear"
        overlayClassName="modal-overlay"
        closeTimeoutMS={300}
      >
        <form onSubmit={(e) => handleSubmit(e, false)} className="modal-crear-formulario">          
          <div className="modal-crear-header">
            <h2 className="modal-crear-titulo">Nuevo Registro de Higiene</h2>
            <button type="button" onClick={() => setIsModalOpen(false)} className="modal-crear-cerrar">×</button>
            <button type="submit" className="modal-boton-crear">Guardar</button>
          </div>
          {renderFormContent(false)}
        </form>
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onRequestClose={() => setIsEditModalOpen(false)}
        contentLabel="Editar Control de Higiene"
        ariaHideApp={false}
        className="modal-crear"
        overlayClassName="modal-overlay"
        closeTimeoutMS={300}
      >
        <form onSubmit={(e) => handleSubmit(e, true)} className="modal-crear-formulario">
          <div className="modal-crear-header">
            <h2 className="modal-crear-titulo">Editar Registro de Higiene</h2>
            <button type="button" onClick={() => setIsEditModalOpen(false)} className="modal-crear-cerrar">×</button>
            <button type="submit" className="modal-boton-crear">Guardar</button>
          </div>
          {currentControl && renderFormContent(true)}
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
        <p>¿Estás seguro de que deseas eliminar este registro?</p>
        {controlToDelete && (
          <div style={{ margin: '20px 0', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
            <p><strong>Trabajador:</strong> {controlToDelete.personal.nombre}</p>
            <p><strong>Fecha:</strong> {controlToDelete.fecha}</p>
            <p><strong>V°B°:</strong> {controlToDelete.vbCumplimiento}</p>
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

      {/* Modal de Detalles */}
      <Modal
        isOpen={isViewModalOpen}
        onRequestClose={handleViewModalClose}
        contentLabel="Ver Detalles"
        ariaHideApp={false}
        className="modal-detalles"
        overlayClassName="modal-overlay"
        closeTimeoutMS={300}
      >
        {controlToView && (
          <div className="modal-crear-formulario">
            <div className="modal-detalles-header">          
              <h2 className="modal-detalles-titulo">Detalles Control de Higiene de {controlToView?.personal.nombre}</h2>
              <button onClick={handleViewModalClose} className="modal-detalles-cerrar">×</button>
              <button
                onClick={() => {
                  setCurrentControl(controlToView);
                  setIsEditModalOpen(true);
                  handleViewModalClose();
                }}
                className="modal-detalles-editar"
              >
                <MdOutlineEdit size={24} />
              </button>
            </div>
            <div className="modal-detalles-content" style={{ padding: '20px 48px' }}>
              <div className="dato-grupo">
                <h3 className="dato-titulo">Información General</h3>
                <div className="datos-grid">
                  <div className="datos-fila">
                    <span className="datos-etiqueta">Fecha:</span>
                    <span className="datos-valor">{controlToView.fecha}</span>
                  </div>
                  <div className="datos-fila">
                    <span className="datos-etiqueta">Sección:</span> 
                    <span className="datos-valor">{controlToView.personal.seccion}</span>
                  </div>
                  <div className="datos-fila">
                    <span className="datos-etiqueta">V°B° Cumplimiento:</span>
                    <span className="datos-valor">{controlToView.vbCumplimiento}</span>
                  </div>
                  <div className="datos-fila">
                    <span className="datos-etiqueta">ACC:</span>
                    <span className="datos-valor">{controlToView.nroAccionCorrectiva}</span>
                  </div>
                </div>
              </div>

              <div className="dato-grupo">
                <h3 className="dato-titulo">Checklist de Higiene</h3>
                <div className="datos-grid">
                  {/*
                  */}
                  <div className="datos-fila">
                    <span className="datos-etiqueta">Uso de Cofia:</span>
                    <span className="datos-valor">
                      <span className={`estado ${controlToView.usoCofia ? 'cumple' : 'no-cumple'}`}>
                        {controlToView.usoCofia ? '✓' : '✗'}
                      </span>
                    </span>
                  </div>
                  <div className="datos-fila">
                    <span className="datos-etiqueta">Uso de Mascarilla:</span>
                    <span className="datos-valor">
                      <span className={`estado ${controlToView.usoMascarilla ? 'cumple' : 'no-cumple'}`}>
                        {controlToView.usoMascarilla ? '✓' : '✗'}
                      </span>
                    </span>
                  </div>
                  <div className="datos-fila">
                    <span className="datos-etiqueta">Higiene de Manos:</span>
                    <span className="datos-valor">
                      <span className={`estado ${controlToView.higieneManos ? 'cumple' : 'no-cumple'}`}>
                        {controlToView.higieneManos ? '✓' : '✗'}
                      </span>
                    </span>
                  </div>
                  <div className="datos-fila">
                    <span className="datos-etiqueta">Uñas Cortas:</span>
                    <span className="datos-valor">
                      <span className={`estado ${controlToView.unasCortas ? 'cumple' : 'no-cumple'}`}>
                        {controlToView.unasCortas ? '✓' : '✗'}
                      </span>
                    </span>
                  </div>
                  <div className="datos-fila">
                    <span className="datos-etiqueta">Afeitado:</span>
                    <span className="datos-valor">
                      <span className={`estado ${controlToView.afeitado ? 'cumple' : 'no-cumple'}`}>
                        {controlToView.afeitado ? '✓' : '✗'}
                      </span>
                    </span>
                  </div>
                  <div className="datos-fila">
                    <span className="datos-etiqueta">Uniforme Limpio:</span>
                    <span className="datos-valor">
                      <span className={`estado ${controlToView.uniformeLimpio ? 'cumple' : 'no-cumple'}`}>
                        {controlToView.uniformeLimpio ? '✓' : '✗'}
                      </span>
                    </span>
                  </div>
                  <div className="datos-fila">
                    <span className="datos-etiqueta">Sin Accesorios:</span>
                    <span className="datos-valor">
                      <span className={`estado ${controlToView.sinAccesorios ? 'cumple' : 'no-cumple'}`}>
                        {controlToView.sinAccesorios ? '✓' : '✗'}
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              {controlToView.observacion && (
                <div className="dato-grupo">
                  <h3 className="dato-titulo">Observaciones</h3>
                  <div className="datos-grid">
                    <div className="datos-fila">
                      <span className="datos-valor" style={{gridColumn: '1 / -1', textAlign: 'left'}}>{controlToView.observacion}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ControlHigiene;