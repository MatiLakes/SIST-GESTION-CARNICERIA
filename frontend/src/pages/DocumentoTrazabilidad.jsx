import React, { useState, useEffect } from "react";
import useGetDocumentos from "@hooks/documentoTrazabilidad/useGetDocumentos";
import useCreateDocumento from "@hooks/documentoTrazabilidad/useCreateDocumento";
import useAddRegistro from "@hooks/documentoTrazabilidad/useAddRegistro";
import useEditDocumento from "@hooks/documentoTrazabilidad/useEditDocumento";
import useEditRegistro from "@hooks/documentoTrazabilidad/useEditRegistro";
import useDeleteDocumento from "@hooks/documentoTrazabilidad/useDeleteDocumento";
import useDeleteRegistro from "@hooks/documentoTrazabilidad/useDeleteRegistro";
import useGetPersonal from "@hooks/personal/useGetPersonal";
import Table from "../components/Table";
import Modal from "react-modal";
import Swal from "sweetalert2";
import { MdOutlineEdit } from "react-icons/md";
import "@styles/Higiene.css";
import "@styles/modalCrear.css";
import "@styles/modalDetalles.css";
import { AiTwotoneDelete } from "react-icons/ai";

// Estilos para los registros en el modal
const customStyles = {
  registrosContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    maxHeight: '400px',
    overflowY: 'auto',
    padding: '10px 5px',
  },
  registroCard: {
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    overflow: 'hidden',
  },
  registroHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: '10px 15px',
    borderBottom: '1px solid #e0e0e0',
  },
  registroTitle: {
    margin: '0',
    fontSize: '16px',
    fontWeight: '600',
    color: '#333',
  },
  registroActions: {
    display: 'flex',
    gap: '8px',
  },
  registroActionBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4px',
    borderRadius: '4px',
    transition: 'background-color 0.2s',
  },
  registroContent: {
    padding: '15px',
  },
  registroInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  registroInfoItem: {
    display: 'flex',
    gap: '10px',
    alignItems: 'baseline',
  },
  registroLabel: {
    fontWeight: '500',
    color: '#666',
    width: '100px',
  },
  registroValue: {
    color: '#333',
    flex: '1',
    fontWeight: '400',
  },
  editBtn: {
    color: '#0066cc',
    '&:hover': {
      backgroundColor: 'rgba(0, 102, 204, 0.1)',
    },
  },
  deleteBtn: {
    color: '#cc0000',
    '&:hover': {
      backgroundColor: 'rgba(204, 0, 0, 0.1)',
    },
  },
};

const cortesDeCarne = [
  "LOMO VETADO", "HUACHALOMO PARRILLA", "PLATEADA", "MALAYA",
  "HUACHALOMO OLLA", "SOBRECOSTILLA", "TAPAPECHO", "POSTA PALETA",
  "CHOCLILLO", "CARNICERO", "LAGARTO", "OSOBUCO", "COGOTE",
  "HUESO SOPA", "GRASA DESPUNTE", "FILETE", "LOMO LISO", "BIFE CHORIZO",
  "TRARO", "PALANCA", "TAPABARRIGA", "POSTA NEGRA", "TAPAPOSTA",
  "POLLO GANSO", "GANSO", "PTA. DE GANSO", "ASIENTO", "PTA. PICANA",
  "POSTA ROSADA", "ABASTERO"
];

const DocumentoTrazabilidad = () => {
  const { documentos, loading, error, fetchDocumentos } = useGetDocumentos();
  const { personal } = useGetPersonal();
  const { create } = useCreateDocumento(fetchDocumentos);
  const { addRegistro } = useAddRegistro(fetchDocumentos);
  const { edit } = useEditDocumento(fetchDocumentos);
  const { editRegistro } = useEditRegistro(fetchDocumentos);
  const { remove } = useDeleteDocumento(fetchDocumentos);
  const { removeRegistro } = useDeleteRegistro(fetchDocumentos);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isAddRegistroModalOpen, setIsAddRegistroModalOpen] = useState(false);
  const [isEditRegistroModalOpen, setIsEditRegistroModalOpen] = useState(false);
  const [isDeleteRegistroModalOpen, setIsDeleteRegistroModalOpen] = useState(false);
  
  const [currentDocumento, setCurrentDocumento] = useState(null);
  const [documentoToDelete, setDocumentoToDelete] = useState(null);
  const [documentoToView, setDocumentoToView] = useState(null);
  const [currentRegistro, setCurrentRegistro] = useState(null);
  const [registroToDelete, setRegistroToDelete] = useState(null);

  // Para agregar un nuevo registro a un documento existente
  const [selectedDocumentoId, setSelectedDocumentoId] = useState(null);

  // Handlers para documento
  const handleDocumentoSubmit = async (e, isEdit = false) => {
    e.preventDefault();
    const form = e.target;
    
    // Si es una edición, solo actualizamos la fecha
    if (isEdit) {
      const data = {
        fecha: form.fecha.value,
      };
      
      try {
        await edit(currentDocumento.id, data);
        setIsEditModalOpen(false);
        setCurrentDocumento(null);
        Swal.fire({
          icon: "success",
          title: "¡Éxito!",
          text: "Documento actualizado correctamente",
          confirmButtonColor: "#000000"
        });
      } catch (err) {
        console.error("Error al actualizar documento:", err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo actualizar el documento",
          confirmButtonColor: "#000000"
        });
      }
    } else {      // Si es una creación, incluimos el registro inicial
      const data = {
        fecha: form.fecha.value,
        registros: [
          {
            hora: form.hora.value,
            cantidad: parseFloat(form.cantidad.value),
            corte: form.corte.value,
            responsableId: parseInt(form.responsableId.value)
          }
        ]
      };

      try {
        await create(data);
        setIsModalOpen(false);
        Swal.fire({
          icon: "success",
          title: "¡Éxito!",
          text: "Documento creado correctamente",
          confirmButtonColor: "#000000"
        });
      } catch (err) {
        console.error("Error al crear documento:", err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo crear el documento",
          confirmButtonColor: "#000000"
        });
      }
    }
  };
  // Handlers para registro
  const handleRegistroSubmit = async (e, documentoId, isEdit = false, registroId = null) => {
    e.preventDefault();
    const form = e.target;    const data = {
      hora: form.hora.value,
      cantidad: parseFloat(form.cantidad.value),
      corte: form.corte.value,
      responsableId: parseInt(form.responsableId.value)
    };

    try {
      if (isEdit && registroId) {
        await editRegistro(documentoId, registroId, data);
        setIsEditRegistroModalOpen(false);
        setCurrentRegistro(null);
      } else {
        await addRegistro(documentoId, data);
        setIsAddRegistroModalOpen(false);
        setSelectedDocumentoId(null);
      }
      Swal.fire({
        icon: "success",
        title: "¡Éxito!",
        text: isEdit ? "Registro actualizado correctamente" : "Registro añadido correctamente",
        confirmButtonColor: "#000000"
      });
    } catch (err) {
      console.error("Error al guardar registro:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo guardar el registro",
        confirmButtonColor: "#000000"
      });
    }
  };

  // Handlers para borrar documento
  const handleDeleteDocumentoModalOpen = (documento) => {
    setDocumentoToDelete(documento);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteDocumentoModalClose = () => {
    setIsDeleteModalOpen(false);
    setDocumentoToDelete(null);
  };

  const confirmDocumentoDelete = async () => {
    if (documentoToDelete) {
      try {
        await remove(documentoToDelete.id);
        handleDeleteDocumentoModalClose();
        Swal.fire({
          icon: "success",
          title: "¡Eliminado!",
          text: "El documento ha sido eliminado correctamente",
          confirmButtonColor: "#000000"
        });
      } catch (error) {
        console.error("Error al eliminar documento:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo eliminar el documento",
          confirmButtonColor: "#000000"
        });
      }
    }
  };

  // Handlers para borrar registro
  const handleDeleteRegistroModalOpen = (documentoId, registro) => {
    setSelectedDocumentoId(documentoId);
    setRegistroToDelete(registro);
    setIsDeleteRegistroModalOpen(true);
  };

  const handleDeleteRegistroModalClose = () => {
    setIsDeleteRegistroModalOpen(false);
    setSelectedDocumentoId(null);
    setRegistroToDelete(null);
  };

  const confirmRegistroDelete = async () => {
    if (selectedDocumentoId && registroToDelete) {
      try {
        await removeRegistro(selectedDocumentoId, registroToDelete.id);
        handleDeleteRegistroModalClose();
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

  // View document details
  const handleViewClick = (documento) => {
    setDocumentoToView(documento);
    setIsViewModalOpen(true);
  };

  const handleViewModalClose = () => {
    setIsViewModalOpen(false);
    setDocumentoToView(null);
  };

  // Add registro to documento
  const handleAddRegistroClick = (documentoId) => {
    setSelectedDocumentoId(documentoId);
    setIsAddRegistroModalOpen(true);
  };

  // Edit registro 
  const handleEditRegistroClick = (documentoId, registro) => {
    setSelectedDocumentoId(documentoId);
    setCurrentRegistro(registro);
    setIsEditRegistroModalOpen(true);
  };  // Define table columns
  const columns = [
    { header: "Fecha", key: "fecha" },
    { 
      header: "Hora", 
      key: "registros", 
      cell: (data) => {
        return (data.registros && data.registros.length > 0) ? data.registros[0].hora : "-";
      }
    },    { 
      header: "Cantidad (Kg)", 
      key: "registros", 
      cell: (data) => {
        if (data.registros && data.registros.length > 0) {
          const cantidad = data.registros[0].cantidad;
          if (cantidad !== undefined && cantidad !== null) {
            return Number(cantidad).toFixed(2);
          }
        }
        return "-";
      }
    },
    { 
      header: "Corte Molido", 
      key: "registros", 
      cell: (data) => {
        return (data.registros && data.registros.length > 0) ? data.registros[0].corte : "-";
      }
    },
    { 
      header: "Responsable", 
      key: "registros", 
      cell: (data) => {
        return (data.registros && data.registros.length > 0 && data.registros[0].responsable) 
          ? data.registros[0].responsable.nombre 
          : "-";
      }
    },
  ];  const registrosColumns = [
    { header: "Hora", key: "hora" },
    { header: "Cantidad (Kg)", key: "cantidad" },
    { header: "Corte", key: "corte" },
    { header: "Responsable", key: "responsable.nombre" },
  ];
  // Render documento form content
  const renderDocumentoFormContent = (isEdit = false) => {
    const defaultValues = isEdit ? currentDocumento : {};
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
        
        {/* Solo mostramos los campos de registro al crear un nuevo documento */}
        {!isEdit && (
          <>
            <h3 className="seccion-titulo" style={{ margin: '20px 0 10px', fontSize: '1.1rem' }}>Información del Corte Molido</h3>
            
            <div className="formulario-grupo">
              <label className="formulario-etiqueta">Hora:</label>
              <input
                type="time"
                name="hora"
                required
                className="formulario-input"
              />
            </div>

            <div className="formulario-grupo">
              <label className="formulario-etiqueta">Cantidad (Kg):</label>
              <input
                type="number"
                name="cantidad"
                step="0.01"
                min="0.01"
                required
                className="formulario-input"
              />
            </div>

            <div className="formulario-grupo">
              <label className="formulario-etiqueta">Corte:</label>
              <select
                name="corte"
                required
                className="formulario-input"
              >
                <option value="">Seleccione un corte...</option>
                {cortesDeCarne.map(corte => (
                  <option key={corte} value={corte}>{corte}</option>
                ))}
              </select>
            </div>            <div className="formulario-grupo">
              <label className="formulario-etiqueta">Responsable:</label>
              <select
                name="responsableId"
                required
                className="formulario-input"
              >
                <option value="">Seleccione un responsable...</option>
                {[...personal].sort((a, b) => a.nombre.localeCompare(b.nombre)).map(p => (
                  <option key={p.id} value={p.id}>{p.nombre} ({p.seccion})</option>
                ))}
              </select>
            </div>
          </>
        )}
      </>
    );
  };
  // Render registro form content
  const renderRegistroFormContent = (isEdit = false) => {
    const defaultValues = isEdit ? currentRegistro : {};
    return (
      <>
        <div className="formulario-grupo">
          <label className="formulario-etiqueta">Hora:</label>
          <input
            type="time"
            name="hora"
            defaultValue={defaultValues.hora || ""}
            required
            className="formulario-input"
          />
        </div>

        <div className="formulario-grupo">
          <label className="formulario-etiqueta">Cantidad (Kg):</label>
          <input
            type="number"
            name="cantidad"
            defaultValue={defaultValues.cantidad || ""}
            step="0.01"
            min="0.01"
            required
            className="formulario-input"
          />
        </div>

        <div className="formulario-grupo">
          <label className="formulario-etiqueta">Corte:</label>
          <select
            name="corte"
            defaultValue={defaultValues.corte || ""}
            required
            className="formulario-input"
          >
            <option value="">Seleccione un corte...</option>
            {cortesDeCarne.map(corte => (
              <option key={corte} value={corte}>{corte}</option>
            ))}
          </select>
        </div>

        <div className="formulario-grupo">
          <label className="formulario-etiqueta">Responsable:</label>
          <select
            name="responsableId"
            defaultValue={defaultValues.responsable?.id || ""}
            required
            className="formulario-input"
          >
            <option value="">Seleccione un responsable...</option>
            {[...personal].sort((a, b) => a.nombre.localeCompare(b.nombre)).map(p => (
              <option key={p.id} value={p.id}>{p.nombre} ({p.seccion})</option>
            ))}
          </select>
        </div>
      </>
    );
  };

  // Renderiza un mensaje de carga o error cuando sea necesario
  if (loading) return <div className="loading-message">Cargando documentos de trazabilidad...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <div className="higiene-container">      <Table
        data={documentos}
        columns={columns}
        headerTitle="Registro de Carne Molida"
        onCreate={() => setIsModalOpen(true)}
        onEdit={(doc) => {
          setCurrentDocumento(doc);
          setIsEditModalOpen(true);
        }}
        onDelete={handleDeleteDocumentoModalOpen}
        onView={handleViewClick}
        showEditAllButton={false}
        showViewButton={true}
        showExcelButton={false}
        entidad="documentos-trazabilidad"
      />

      {/* Modal Crear Documento */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Crear Documento de Trazabilidad"
        ariaHideApp={false}
        className="modal-crear"
        overlayClassName="modal-overlay"
        closeTimeoutMS={300}
      >
        <form onSubmit={(e) => handleDocumentoSubmit(e, false)} className="modal-crear-formulario">            <div className="modal-crear-header">
            <h2 className="modal-crear-titulo">Nuevo Registro de Carne Molida</h2>
            <button type="button" onClick={() => setIsModalOpen(false)} className="modal-crear-cerrar">×</button>
            <button type="submit" className="modal-boton-crear">Guardar</button>
          </div>
          {renderDocumentoFormContent(false)}
        </form>
      </Modal>

      {/* Modal Editar Documento */}
      <Modal
        isOpen={isEditModalOpen}
        onRequestClose={() => setIsEditModalOpen(false)}
        contentLabel="Editar Documento de Trazabilidad"
        ariaHideApp={false}
        className="modal-crear"
        overlayClassName="modal-overlay"
        closeTimeoutMS={300}
      >
        <form onSubmit={(e) => handleDocumentoSubmit(e, true)} className="modal-crear-formulario">          <div className="modal-crear-header">
            <h2 className="modal-crear-titulo">Editar Registro de Carne Molida</h2>
            <button type="button" onClick={() => setIsEditModalOpen(false)} className="modal-crear-cerrar">×</button>
            <button type="submit" className="modal-boton-crear">Guardar</button>
          </div>
          {currentDocumento && renderDocumentoFormContent(true)}
        </form>
      </Modal>

      {/* Modal de Eliminación de Documento */}
      <Modal
        isOpen={isDeleteModalOpen}
        onRequestClose={handleDeleteDocumentoModalClose}
        contentLabel="Confirmar Eliminación"
        ariaHideApp={false}
        className="formulario-table-modal-form"
        overlayClassName="formulario-table-overlay"
        style={{ content: { maxWidth: '400px' } }}
      >
        <h2 className="formulario-table-modal-title">Confirmar Eliminación</h2>
        <p>¿Estás seguro de que deseas eliminar este documento?</p>
        {documentoToDelete && (
          <div style={{ margin: '20px 0', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
            <p><strong>Fecha:</strong> {documentoToDelete.fecha}</p>
            {documentoToDelete.registros && documentoToDelete.registros.length > 0 && (
              <>
                <p><strong>Cantidad (Kg):</strong> {documentoToDelete.registros[0].cantidad ? Number(documentoToDelete.registros[0].cantidad).toFixed(2) : "-"}</p>
                <p><strong>Corte Molido:</strong> {documentoToDelete.registros[0].corte}</p>
              </>
            )}
          </div>
        )}
        <div className="formulario-table-form-actions">
          <button 
            onClick={confirmDocumentoDelete}
            className="formulario-table-btn-confirm"
            style={{ backgroundColor: '#dc3545' }}
          >
            Eliminar
          </button>
          <button
            onClick={handleDeleteDocumentoModalClose}
            className="formulario-table-btn-cancel"
          >
            Cancelar
          </button>
        </div>
      </Modal>

      {/* Modal de Detalles de Documento */}
      <Modal
        isOpen={isViewModalOpen}
        onRequestClose={handleViewModalClose}
        contentLabel="Ver Detalles de Documento"
        ariaHideApp={false}
        className="modal-detalles"
        overlayClassName="modal-overlay"
        closeTimeoutMS={300}
      >
        {documentoToView && (
          <div className="modal-crear-formulario">
            <div className="modal-detalles-header">          
              <h2 className="modal-detalles-titulo">Registro de Carne Molida</h2>
              <button onClick={handleViewModalClose} className="modal-detalles-cerrar">×</button>
              <button
                onClick={() => {
                  setCurrentDocumento(documentoToView);
                  setIsEditModalOpen(true);
                  handleViewModalClose();
                }}
                className="modal-detalles-editar"
              >
                <MdOutlineEdit size={24} />
              </button>
            </div>
            <div className="modal-detalles-content">
              <div className="dato-grupo">
                <h3 className="dato-titulo">Información General</h3>                <div className="datos-grid">
                  <div className="datos-fila">
                    <span className="datos-etiqueta">Fecha:</span>
                    <span className="datos-valor">{documentoToView.fecha}</span>
                  </div>
                </div>
              </div>              <div className="dato-grupo">                <h3 className="dato-titulo">Detalles de Carne Molida</h3>
                <div style={{ marginTop: '30px', textAlign: 'right' }}>
                  <button 
                    onClick={() => handleAddRegistroClick(documentoToView.id)}
                    className="modal-boton-crear"
                  >
                    Agregar Registro
                  </button>
                </div>
                {documentoToView.registros && documentoToView.registros.length > 0 ? (
                  <div style={{ marginTop: '25px' }}><div style={customStyles.registrosContainer}>
                      {documentoToView.registros.map((registro, index) => (
                        <div key={registro.id} style={customStyles.registroCard}>
                          <div style={customStyles.registroHeader}>
                            <h4 style={customStyles.registroTitle}>Registro #{index + 1}</h4>
                            <div style={customStyles.registroActions}>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditRegistroClick(documentoToView.id, registro);
                                }}
                                style={{...customStyles.registroActionBtn, ...customStyles.editBtn}}
                              >
                                <MdOutlineEdit size={18} />
                              </button>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteRegistroModalOpen(documentoToView.id, registro);
                                }}
                                style={{...customStyles.registroActionBtn, ...customStyles.deleteBtn}}
                              >
                                <AiTwotoneDelete size={18} />
                              </button>
                            </div>
                          </div>
                          <div style={customStyles.registroContent}>
                            <div style={customStyles.registroInfo}>                            <div style={customStyles.registroInfoItem}>
                                <span style={customStyles.registroLabel}>Hora:</span>
                                <span style={customStyles.registroValue}>{registro.hora}</span>
                              </div>
                              <div style={customStyles.registroInfoItem}>
                                <span style={customStyles.registroLabel}>Cantidad (Kg):</span>
                                <span style={customStyles.registroValue}>{registro.cantidad}</span>
                              </div>
                              <div style={customStyles.registroInfoItem}>
                                <span style={customStyles.registroLabel}>Corte:</span>
                                <span style={customStyles.registroValue}>{registro.corte}</span>
                              </div>
                              <div style={customStyles.registroInfoItem}>
                                <span style={customStyles.registroLabel}>Responsable:</span>
                                <span style={customStyles.registroValue}>
                                  {registro.responsable ? registro.responsable.nombre : 'No asignado'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}                    </div>
                  </div>                ) : (
                  <div style={{ textAlign: 'center', padding: '20px', marginTop: '10px' }}>
                    <p>No hay registros para este documento.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal para Agregar Registro */}
      <Modal
        isOpen={isAddRegistroModalOpen}
        onRequestClose={() => {
          setIsAddRegistroModalOpen(false);
          setSelectedDocumentoId(null);
        }}
        contentLabel="Agregar Registro de Trazabilidad"
        ariaHideApp={false}
        className="modal-crear"
        overlayClassName="modal-overlay"
        closeTimeoutMS={300}
      >
        <form onSubmit={(e) => handleRegistroSubmit(e, selectedDocumentoId, false)} className="modal-crear-formulario">          
          <div className="modal-crear-header">
            <h2 className="modal-crear-titulo">Nuevo Registro de Trazabilidad</h2>
            <button 
              type="button" 
              onClick={() => {
                setIsAddRegistroModalOpen(false);
                setSelectedDocumentoId(null);
              }} 
              className="modal-crear-cerrar"
            >
              ×
            </button>
            <button type="submit" className="modal-boton-crear">Guardar</button>
          </div>
          {renderRegistroFormContent(false)}
        </form>
      </Modal>

      {/* Modal para Editar Registro */}
      <Modal
        isOpen={isEditRegistroModalOpen}
        onRequestClose={() => {
          setIsEditRegistroModalOpen(false);
          setSelectedDocumentoId(null);
          setCurrentRegistro(null);
        }}
        contentLabel="Editar Registro de Trazabilidad"
        ariaHideApp={false}
        className="modal-crear"
        overlayClassName="modal-overlay"
        closeTimeoutMS={300}
      >
        <form 
          onSubmit={(e) => handleRegistroSubmit(e, selectedDocumentoId, true, currentRegistro.id)} 
          className="modal-crear-formulario"
        >          
          <div className="modal-crear-header">
            <h2 className="modal-crear-titulo">Editar Registro de Trazabilidad</h2>
            <button 
              type="button" 
              onClick={() => {
                setIsEditRegistroModalOpen(false);
                setSelectedDocumentoId(null);
                setCurrentRegistro(null);
              }} 
              className="modal-crear-cerrar"
            >
              ×
            </button>
            <button type="submit" className="modal-boton-crear">Guardar</button>
          </div>
          {currentRegistro && renderRegistroFormContent(true)}
        </form>
      </Modal>

      {/* Modal de Eliminación de Registro */}
      <Modal
        isOpen={isDeleteRegistroModalOpen}
        onRequestClose={handleDeleteRegistroModalClose}
        contentLabel="Confirmar Eliminación de Registro"
        ariaHideApp={false}
        className="formulario-table-modal-form"
        overlayClassName="formulario-table-overlay"
        style={{ content: { maxWidth: '400px' } }}
      >
        <h2 className="formulario-table-modal-title">Confirmar Eliminación</h2>
        <p>¿Estás seguro de que deseas eliminar este registro?</p>
        {registroToDelete && (
          <div style={{ margin: '20px 0', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
            <p><strong>Hora:</strong> {registroToDelete.hora}</p>
            <p><strong>Corte:</strong> {registroToDelete.corte}</p>
            {registroToDelete.responsable && (
              <p><strong>Responsable:</strong> {registroToDelete.responsable.nombre}</p>
            )}
          </div>
        )}
        <div className="formulario-table-form-actions">
          <button 
            onClick={confirmRegistroDelete}
            className="formulario-table-btn-confirm"
            style={{ backgroundColor: '#dc3545' }}
          >
            Eliminar
          </button>
          <button
            onClick={handleDeleteRegistroModalClose}
            className="formulario-table-btn-cancel"
          >
            Cancelar
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default DocumentoTrazabilidad;
