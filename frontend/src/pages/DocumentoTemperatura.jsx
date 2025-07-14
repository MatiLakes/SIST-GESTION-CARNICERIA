import React, { useState, useEffect } from "react";
import useGetDocumentosTemperatura from "@hooks/documentoTemperatura/useGetDocumentosTemperatura";
import useCreateDocumentoTemperatura from "@hooks/documentoTemperatura/useCreateDocumentoTemperatura";
import useEditDocumentoTemperatura from "@hooks/documentoTemperatura/useEditDocumentoTemperatura";
import useDeleteDocumentoTemperatura from "@hooks/documentoTemperatura/useDeleteDocumentoTemperatura";
import useGetPersonal from "@hooks/personal/useGetPersonal";
import { useErrorHandlerDocumentoTemperatura } from "@hooks/documentoTemperatura/useErrorHandlerDocumentoTemperatura";
import Table from "../components/Table";
import Modal from "react-modal";
import Swal from "sweetalert2";
import { MdOutlineEdit } from "react-icons/md";
import { FaTemperatureLow, FaPlus, FaTrash, FaEye } from "react-icons/fa";
import "@styles/Higiene.css";
import "@styles/modalCrear.css";
import "@styles/modalDetalles.css";
import "@styles/Temperatura.css"; // Importamos un archivo CSS adicional para estilos específicos

const DocumentoTemperatura = () => {
  const { documentos, loading, error, fetchDocumentos } = useGetDocumentosTemperatura();
  const { personal } = useGetPersonal();
  const { create } = useCreateDocumentoTemperatura(fetchDocumentos);
  const { edit } = useEditDocumentoTemperatura(fetchDocumentos);
  const { remove } = useDeleteDocumentoTemperatura(fetchDocumentos);
  const { createError, editError, handleCreateError, handleEditError, clearCreateError, clearEditError, getFieldErrors } = useErrorHandlerDocumentoTemperatura();
  
  // Estados para manejar modales
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    // Estados para manejar datos
  const [currentDocumento, setCurrentDocumento] = useState(null);
  const [documentoToDelete, setDocumentoToDelete] = useState(null);
  const [documentoToView, setDocumentoToView] = useState(null);
  
  // Configuración inicial con dos registros predeterminados
  const fechaActual = new Date();
  const horaActual = `${fechaActual.getHours().toString().padStart(2, '0')}:${fechaActual.getMinutes().toString().padStart(2, '0')}`;
  
  const [registros, setRegistros] = useState([
    { hora: horaActual, equipo: "Cámara de Mantención", temperatura: "", funciona: true, motivo: "", AccionCorrectiva: "", responsableId: "" },
    { hora: horaActual, equipo: "Equipo", temperatura: "", funciona: true, motivo: "", AccionCorrectiva: "", responsableId: "" }
  ]);

  // Función helper para renderizar un campo con errores
  const renderFieldWithErrors = (fieldName, children, errorState) => {
    const fieldErrors = getFieldErrors(errorState, fieldName);
    const hasError = fieldErrors.length > 0;
    
    return (
      <div className="input-container">
        {React.cloneElement(children, {
          className: `${children.props.className || 'formulario-input'} ${hasError ? 'input-error' : ''}`
        })}
        {fieldErrors.map((error, index) => (
          <div key={index} className="error-message">
            {error.message}
          </div>
        ))}
      </div>
    );
  };

  // Función para formatear fechas correctamente evitando problemas de zona horaria
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    try {
      // Si la fecha ya incluye tiempo, usarla tal como está, sino agregar T00:00:00
      const dateToUse = dateString.includes('T') ? dateString : dateString + 'T00:00:00';
      const date = new Date(dateToUse);
      if (isNaN(date.getTime())) {
        return '';
      }
      
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch (error) {
      console.error('Error al formatear fecha:', error);
      return '';
    }
  };
  // Función para añadir un nuevo registro
  const addRegistro = () => {
    const fechaActual = new Date();
    const horaActual = `${fechaActual.getHours().toString().padStart(2, '0')}:${fechaActual.getMinutes().toString().padStart(2, '0')}`;
    
    // Agregamos un registro adicional con un nombre sugerido basado en la cantidad de registros
    const registroCount = registros.length + 1;
    const nombreSugerido = `Equipo ${registroCount}`;
    
    setRegistros([
      ...registros,
      { hora: horaActual, equipo: nombreSugerido, temperatura: "", funciona: true, motivo: "", AccionCorrectiva: "", responsableId: "" }
    ]);
  };
  // Función para eliminar un registro
  const removeRegistro = (index) => {
    // Verificar que no quedemos con menos de 2 registros
    if (registros.length <= 2) {
      Swal.fire({
        icon: "warning",
        title: "No se puede eliminar",
        text: "Debe mantener al menos 2 registros de temperatura",
      });
      return;
    }
    
    const nuevosRegistros = [...registros];
    nuevosRegistros.splice(index, 1);
    setRegistros(nuevosRegistros);
  };

  // Función para actualizar un campo de un registro
  const handleRegistroChange = (index, field, value) => {
    const nuevosRegistros = [...registros];
    nuevosRegistros[index][field] = value;
    setRegistros(nuevosRegistros);
  };
  // Handle para enviar un nuevo documento o editar uno existente
  const handleSubmit = async (e, isEdit = false) => {
    e.preventDefault();
    const form = e.target;
    const data = {
      fecha: form.fecha.value,
      registros: registros.map(reg => ({
        hora: reg.hora,
        equipo: reg.equipo,
        temperatura: reg.temperatura, // Mantener como string para validación
        funciona: reg.funciona,
        motivo: reg.motivo,
        AccionCorrectiva: reg.AccionCorrectiva,
        responsableId: reg.responsableId // Mantener como string para validación
      }))
    };

    // Usar el hook de validación de errores
    const hasErrors = isEdit 
      ? handleEditError(data, personal, documentos, currentDocumento?.id)
      : handleCreateError(data, personal, documentos);

    // Debug temporal - puedes remover esto después
    if (!hasErrors) {
      try {
        // Preparar datos para el backend con conversiones numéricas
        const backendData = {
          fecha: data.fecha,
          registros: data.registros.map(reg => ({
            hora: reg.hora,
            equipo: reg.equipo,
            temperatura: parseFloat(reg.temperatura),
            funciona: reg.funciona,
            motivo: reg.motivo,
            AccionCorrectiva: reg.AccionCorrectiva,
            responsableId: parseInt(reg.responsableId)
          }))
        };

        if (isEdit && currentDocumento) {
          await edit(currentDocumento.id, backendData);
          Swal.fire({
            icon: "success",
            title: "Éxito",
            text: "Registro actualizado correctamente",
          });
          setIsEditModalOpen(false);
        } else {
          await create(backendData);
          Swal.fire({
            icon: "success",
            title: "Éxito",
            text: "Registro creado correctamente",
          });
          setIsModalOpen(false);
        }      
        // Limpiamos el formulario y configuramos los dos registros predeterminados
        const fechaActual = new Date();
        const horaActual = `${fechaActual.getHours().toString().padStart(2, '0')}:${fechaActual.getMinutes().toString().padStart(2, '0')}`;
        
        setRegistros([
          { hora: horaActual, equipo: "Cámara de Mantención", temperatura: "", funciona: true, motivo: "", AccionCorrectiva: "", responsableId: "" },
          { hora: horaActual, equipo: "Equipo", temperatura: "", funciona: true, motivo: "", AccionCorrectiva: "", responsableId: "" }
        ]);

      } catch (error) {
        console.error("Error al guardar:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Ocurrió un error al guardar los datos",
        });
      }
    }
  };
  // Función para preparar la creación de un nuevo documento
  const handleOpenCreateModal = () => {
    const fechaActual = new Date();
    const horaActual = `${fechaActual.getHours().toString().padStart(2, '0')}:${fechaActual.getMinutes().toString().padStart(2, '0')}`;
    
    setRegistros([
      { hora: horaActual, equipo: "Cámara de Mantención", temperatura: "", funciona: true, motivo: "", AccionCorrectiva: "", responsableId: "" },
      { hora: horaActual, equipo: "Equipo 2", temperatura: "", funciona: true, motivo: "", AccionCorrectiva: "", responsableId: "" }
    ]);
    clearCreateError(); // Limpiar errores previos
    setIsModalOpen(true);
  };

  // Función para preparar la edición de un documento
  const handleOpenEditModal = (documento) => {
    setCurrentDocumento(documento);
    
    // Preparar los registros para editar
    const registrosEdit = documento.registros.map(reg => ({
      hora: reg.hora,
      equipo: reg.equipo,
      temperatura: reg.temperatura.toString(),
      funciona: reg.funciona,
      motivo: reg.motivo || "",
      AccionCorrectiva: reg.AccionCorrectiva || "",
      responsableId: reg.responsable.id.toString()
    }));
    
    setRegistros(registrosEdit);
    clearEditError(); // Limpiar errores previos
    setIsEditModalOpen(true);
  };

  // Función para preparar la eliminación de un documento
  const handleOpenDeleteModal = (documento) => {
    setDocumentoToDelete(documento);
    setIsDeleteModalOpen(true);
  };

  // Función para ver detalles de un documento
  const handleOpenViewModal = (documento) => {
    setDocumentoToView(documento);
    setIsViewModalOpen(true);
  };

  // Función para confirmar la eliminación de un documento
  const handleDelete = async () => {
    try {
      await remove(documentoToDelete.id);
      setIsDeleteModalOpen(false);
      Swal.fire({
        icon: "success",
        title: "Éxito",
        text: "Registro eliminado correctamente",
      });
    } catch (error) {
      console.error("Error al eliminar:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error al eliminar el registro",
      });
    }
  };  
    // Configuración de columnas para la tabla
  const columns = [
    {
      header: "Fecha",
      key: "fecha",
      cell: (row) => row.fecha ? formatDate(row.fecha) : '',
    },
    {
      header: "Cantidad de Registros",
      key: "registros",
      cell: (row) => row.registros ? row.registros.length : 0,
    }
  ];

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Cargando...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center my-4">Error: {error}</div>;
  }
  return (
    <div className="higiene-container">
      <Table
        data={documentos}
        columns={columns}
        headerTitle="Control de Temperatura"
        onCreate={handleOpenCreateModal}
        onEdit={handleOpenEditModal}
        onDelete={handleOpenDeleteModal}
        onView={handleOpenViewModal}
        showEditAllButton={false}
        showViewButton={true}
        showCreateButton={true}
        showEditButton={true}
        showDeleteButton={true}
        showSearchInput={false}
        showExcelButton={false}
        entidad="documentos-temperatura"
        searchableFields={["fecha"]}
      />

      {/* Modal para crear nuevo documento */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Crear Control de Temperatura"
        ariaHideApp={false}
        className="modal-crear"
        overlayClassName="modal-overlay"
        closeTimeoutMS={300}
      >
        <form onSubmit={handleSubmit} className="modal-crear-formulario" noValidate>
          <div className="modal-crear-header">
            <h2 className="modal-crear-titulo">Nuevo Registro de Temperatura</h2>
            <button type="button" onClick={() => setIsModalOpen(false)} className="modal-crear-cerrar">×</button>
            <button type="submit" className="modal-boton-crear">Guardar</button>
          </div>
          
          <div className="formulario-grupo">
            <label className="formulario-etiqueta">Fecha:</label>
            <div className="input-container">
              <input
                type="date"
                name="fecha"
                max={new Date().toISOString().split('T')[0]} // No permitir fechas futuras
                className={`formulario-input ${createError && createError.errors?.some(error => error.field === 'fecha') ? 'input-error' : ''}`}
              />
              {createError && createError.errors?.filter(error => error.field === 'fecha').map((error, index) => (
                <div key={index} className="error-message">
                  {error.message}
                </div>
              ))}
            </div>
          </div>

          <h3 className="registro-titulo">Registros de Temperatura</h3>
          
          {registros.map((registro, index) => (
            <div key={index} className="registro-container">
              <div className="registro-header">
                <h4 className="registro-subtitulo">Registro #{index + 1}</h4>
                {index > 0 && registros.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeRegistro(index)}
                    className="boton-eliminar-registro"
                  >
                    <FaTrash size={16} />
                  </button>
                )}
              </div>
              
              <div className="registro-grid">
                <div className="formulario-grupo">
                  <label className="formulario-etiqueta">Hora:</label>
                  {renderFieldWithErrors(
                    `registros.${index}.hora`,
                    <input
                      type="time"
                      value={registro.hora}
                      onChange={(e) => handleRegistroChange(index, "hora", e.target.value)}
                      className="formulario-input"
                    />,
                    createError
                  )}
                </div>
                
                <div className="formulario-grupo">
                  <label className="formulario-etiqueta">Equipo:</label>
                  {renderFieldWithErrors(
                    `registros.${index}.equipo`,
                    <input
                      type="text"
                      value={registro.equipo}
                      onChange={(e) => handleRegistroChange(index, "equipo", e.target.value)}
                      className="formulario-input"
                      placeholder="Nombre del equipo"
                    />,
                    createError
                  )}
                </div>
                
                <div className="formulario-grupo">
                  <label className="formulario-etiqueta">Temperatura (°C):</label>
                  {renderFieldWithErrors(
                    `registros.${index}.temperatura`,
                    <input
                      type="number"
                      step="0.1"
                      min="-100"
                      max="100"
                      value={registro.temperatura}
                      onChange={(e) => handleRegistroChange(index, "temperatura", e.target.value)}
                      className="formulario-input"
                      placeholder="Entre -100 y 100"
                    />,
                    createError
                  )}
                </div>
                
                <div className="formulario-grupo">
                  <label className="formulario-etiqueta">Responsable:</label>
                  {renderFieldWithErrors(
                    `registros.${index}.responsableId`,
                    <select
                      value={registro.responsableId}
                      onChange={(e) => handleRegistroChange(index, "responsableId", e.target.value)}
                      className="formulario-input"
                    >
                      <option value="">Seleccionar responsable</option>
                      {personal?.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.nombre}
                        </option>
                      ))}
                    </select>,
                    createError
                  )}
                </div>
                
                <div className="checkbox-grupo">
                  <input
                    type="checkbox"
                    id={`funciona-${index}`}
                    checked={registro.funciona}
                    onChange={(e) => handleRegistroChange(index, "funciona", e.target.checked)}
                    className="checkbox-input"
                  />
                  <label htmlFor={`funciona-${index}`} className="checkbox-label">
                    Equipo funcionando correctamente
                  </label>
                </div>
                
                {!registro.funciona && (
                  <>
                    <div className="formulario-grupo full-width">
                      <label className="formulario-etiqueta">Motivo:</label>
                      {renderFieldWithErrors(
                        `registros.${index}.motivo`,
                        <input
                          type="text"
                          value={registro.motivo}
                          onChange={(e) => handleRegistroChange(index, "motivo", e.target.value)}
                          className="formulario-input"
                          placeholder="Motivo del problema"
                        />,
                        createError
                      )}
                    </div>
                    
                    <div className="formulario-grupo full-width">
                      <label className="formulario-etiqueta">Acción Correctiva:</label>
                      {renderFieldWithErrors(
                        `registros.${index}.AccionCorrectiva`,
                        <input
                          type="text"
                          value={registro.AccionCorrectiva}
                          onChange={(e) => handleRegistroChange(index, "AccionCorrectiva", e.target.value)}
                          className="formulario-input"
                          placeholder="Acción correctiva tomada"
                        />,
                        createError
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
          
          <button
            type="button"
            onClick={addRegistro}
            className="boton-agregar-registro"
          >
            <FaPlus className="mr-2" /> Agregar otro registro
          </button>
        </form>
      </Modal>

      {/* Modal para editar documento */}
      <Modal
        isOpen={isEditModalOpen}
        onRequestClose={() => setIsEditModalOpen(false)}
        contentLabel="Editar Control de Temperatura"
        ariaHideApp={false}
        className="modal-crear"
        overlayClassName="modal-overlay"
        closeTimeoutMS={300}
      >
        <form onSubmit={(e) => handleSubmit(e, true)} className="modal-crear-formulario" noValidate>
          <div className="modal-crear-header">
            <h2 className="modal-crear-titulo">Editar Registro de Temperatura</h2>
            <button type="button" onClick={() => setIsEditModalOpen(false)} className="modal-crear-cerrar">×</button>
            <button type="submit" className="modal-boton-crear">Guardar</button>
          </div>
          
          <div className="formulario-grupo">
            <label className="formulario-etiqueta">Fecha:</label>
            <div className="input-container">
              <input
                type="date"
                name="fecha"
                defaultValue={currentDocumento?.fecha ? currentDocumento.fecha.split('T')[0] : ""}
                max={new Date().toISOString().split('T')[0]} // No permitir fechas futuras
                className={`formulario-input ${editError && editError.errors?.some(error => error.field === 'fecha') ? 'input-error' : ''}`}
              />
              {editError && editError.errors?.filter(error => error.field === 'fecha').map((error, index) => (
                <div key={index} className="error-message">
                  {error.message}
                </div>
              ))}
            </div>
          </div>

          <h3 className="registro-titulo">Registros de Temperatura</h3>
          
          {registros.map((registro, index) => (
            <div key={index} className="registro-container">
              <div className="registro-header">
                <h4 className="registro-subtitulo">Registro #{index + 1}</h4>
                {index > 0 && registros.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeRegistro(index)}
                    className="boton-eliminar-registro"
                  >
                    <FaTrash size={16} />
                  </button>
                )}
              </div>
              
              <div className="registro-grid">
                <div className="formulario-grupo">
                  <label className="formulario-etiqueta">Hora:</label>
                  {renderFieldWithErrors(
                    `registros.${index}.hora`,
                    <input
                      type="time"
                      value={registro.hora}
                      onChange={(e) => handleRegistroChange(index, "hora", e.target.value)}
                      className="formulario-input"
                    />,
                    editError
                  )}
                </div>
                
                <div className="formulario-grupo">
                  <label className="formulario-etiqueta">Equipo:</label>
                  {renderFieldWithErrors(
                    `registros.${index}.equipo`,
                    <input
                      type="text"
                      value={registro.equipo}
                      onChange={(e) => handleRegistroChange(index, "equipo", e.target.value)}
                      className="formulario-input"
                      placeholder="Nombre del equipo"
                    />,
                    editError
                  )}
                </div>
                
                <div className="formulario-grupo">
                  <label className="formulario-etiqueta">Temperatura (°C):</label>
                  {renderFieldWithErrors(
                    `registros.${index}.temperatura`,
                    <input
                      type="number"
                      step="0.1"
                      min="-100"
                      max="100"
                      value={registro.temperatura}
                      onChange={(e) => handleRegistroChange(index, "temperatura", e.target.value)}
                      className="formulario-input"
                      placeholder="Entre -100 y 100"
                    />,
                    editError
                  )}
                </div>
                
                <div className="formulario-grupo">
                  <label className="formulario-etiqueta">Responsable:</label>
                  {renderFieldWithErrors(
                    `registros.${index}.responsableId`,
                    <select
                      value={registro.responsableId}
                      onChange={(e) => handleRegistroChange(index, "responsableId", e.target.value)}
                      className="formulario-input"
                    >
                      <option value="">Seleccionar responsable</option>
                      {personal?.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.nombre}
                        </option>
                      ))}
                    </select>,
                    editError
                  )}
                </div>
                
                <div className="checkbox-grupo">
                  <input
                    type="checkbox"
                    id={`funciona-edit-${index}`}
                    checked={registro.funciona}
                    onChange={(e) => handleRegistroChange(index, "funciona", e.target.checked)}
                    className="checkbox-input"
                  />
                  <label htmlFor={`funciona-edit-${index}`} className="checkbox-label">
                    Equipo funcionando correctamente
                  </label>
                </div>
                
                {!registro.funciona && (
                  <>
                    <div className="formulario-grupo full-width">
                      <label className="formulario-etiqueta">Motivo:</label>
                      {renderFieldWithErrors(
                        `registros.${index}.motivo`,
                        <input
                          type="text"
                          value={registro.motivo}
                          onChange={(e) => handleRegistroChange(index, "motivo", e.target.value)}
                          className="formulario-input"
                          placeholder="Motivo del problema"
                        />,
                        editError
                      )}
                    </div>
                    
                    <div className="formulario-grupo full-width">
                      <label className="formulario-etiqueta">Acción Correctiva:</label>
                      {renderFieldWithErrors(
                        `registros.${index}.AccionCorrectiva`,
                        <input
                          type="text"
                          value={registro.AccionCorrectiva}
                          onChange={(e) => handleRegistroChange(index, "AccionCorrectiva", e.target.value)}
                          className="formulario-input"
                          placeholder="Acción correctiva tomada"
                        />,
                        editError
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
          
          <button
            type="button"
            onClick={addRegistro}
            className="boton-agregar-registro"
          >
            <FaPlus className="mr-2" /> Agregar otro registro
          </button>
        </form>
      </Modal>

      {/* Modal para confirmar eliminación */}
      <Modal
        isOpen={isDeleteModalOpen}
        onRequestClose={() => setIsDeleteModalOpen(false)}
        contentLabel="Confirmar Eliminación"
        ariaHideApp={false}
        className="formulario-table-modal-form"
        overlayClassName="formulario-table-overlay"
        style={{ content: { maxWidth: '400px' } }}
      >
        <h2 className="formulario-table-modal-title">Confirmar Eliminación</h2>
        <p>¿Estás seguro de que deseas eliminar este registro de temperatura?</p>
        {documentoToDelete && (
          <div style={{ margin: '20px 0', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
            <p><strong>Fecha:</strong> {formatDate(documentoToDelete.fecha)}</p>
            <p><strong>Registros:</strong> {documentoToDelete.registros?.length || 0}</p>
          </div>
        )}
        <div className="formulario-table-form-actions">
          <button 
            onClick={handleDelete}
            className="formulario-table-btn-confirm"
            style={{ backgroundColor: '#dc3545' }}
          >
            Eliminar
          </button>
          <button
            onClick={() => setIsDeleteModalOpen(false)}
            className="formulario-table-btn-cancel"
          >
            Cancelar
          </button>
        </div>
      </Modal>

      {/* Modal para ver detalles */}
      <Modal
        isOpen={isViewModalOpen}
        onRequestClose={() => setIsViewModalOpen(false)}
        contentLabel="Ver Detalles"
        ariaHideApp={false}
        className="modal-detalles"
        overlayClassName="modal-overlay"
        closeTimeoutMS={300}
      >
        {documentoToView && (
          <div className="modal-crear-formulario">
            <div className="modal-detalles-header">          
              <h2 className="modal-detalles-titulo">Detalles Control de Temperatura</h2>
              <button onClick={() => setIsViewModalOpen(false)} className="modal-detalles-cerrar">×</button>
              <button
                onClick={() => {
                  setIsViewModalOpen(false);
                  handleOpenEditModal(documentoToView);
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
                    <span className="datos-valor">{formatDate(documentoToView.fecha)}</span>
                  </div>
                  <div className="datos-fila">
                    <span className="datos-etiqueta">Número de registros:</span>
                    <span className="datos-valor">{documentoToView.registros?.length || 0}</span>
                  </div>
                </div>
              </div>

              {documentoToView.registros && documentoToView.registros.length > 0 ? (
                <div className="dato-grupo">
                  <h3 className="dato-titulo">Registros de Temperatura</h3>
                  {documentoToView.registros.map((registro, index) => (
                    <div key={index} className="registro-detalle">
                      <h4 className="registro-subtitulo">Registro #{index + 1}</h4>
                      <div className="datos-grid">
                        <div className="datos-fila">
                          <span className="datos-etiqueta">Hora:</span>
                          <span className="datos-valor">{registro.hora}</span>
                        </div>
                        <div className="datos-fila">
                          <span className="datos-etiqueta">Equipo:</span>
                          <span className="datos-valor">{registro.equipo}</span>
                        </div>
                        <div className="datos-fila">
                          <span className="datos-etiqueta">Temperatura:</span>
                          <span className="datos-valor">{registro.temperatura} °C</span>
                        </div>
                        <div className="datos-fila">
                          <span className="datos-etiqueta">Responsable:</span>
                          <span className="datos-valor">
                            {registro.responsable
                              ? registro.responsable.nombre
                              : "No especificado"}
                          </span>
                        </div>
                        <div className="datos-fila">
                          <span className="datos-etiqueta">Estado:</span>
                          <span className="datos-valor">
                            <span className={`estado ${registro.funciona ? 'cumple' : 'no-cumple'}`}>
                              {registro.funciona ? '✓' : '✗'}
                            </span>
                            {registro.funciona ? ' Funcionando correctamente' : ' Con problemas'}
                          </span>
                        </div>
                        
                        {!registro.funciona && (
                          <>
                            <div className="datos-fila">
                              <span className="datos-etiqueta">Motivo:</span>
                              <span className="datos-valor">{registro.motivo}</span>
                            </div>
                            <div className="datos-fila">
                              <span className="datos-etiqueta">Acción correctiva:</span>
                              <span className="datos-valor">{registro.AccionCorrectiva}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="texto-sin-datos">No hay registros de temperatura disponibles</p>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DocumentoTemperatura;
