import React, { useState } from "react";
import useGetSubproductos from "@hooks/subproductos/useGetSubproductos";
import useCreateSubproducto from "@hooks/subproductos/useCreateSubproducto";
import { useDeleteSubproducto } from "@hooks/subproductos/useDeleteSubproducto";
import useEditSubproducto from "@hooks/subproductos/useEditSubproducto";
import { useErrorHandlerSubproducto } from "@hooks/subproducto/useErrorHandlerSubproducto";
import Table from "../components/Table";
import Modal from "react-modal";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { MdOutlineEdit } from "react-icons/md";
import styles from "@styles/Subproductos.module.css";
import "@styles/modalDetalles.css";
import "@styles/modalCrear.css";

const Subproductos = () => {
  const { subproductos, loading, fetchSubproductos } = useGetSubproductos();
  const { create } = useCreateSubproducto(fetchSubproductos);
  const { handleDelete } = useDeleteSubproducto(fetchSubproductos);
  const { edit } = useEditSubproducto(fetchSubproductos);
  const { createError, editError, handleCreateError, handleEditError } = useErrorHandlerSubproducto();

  console.log('Estado actual de subproductos:', subproductos);
  console.log('Estado de carga:', loading);const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentSubproducto, setCurrentSubproducto] = useState(null);
  const [subproductoToView, setSubproductoToView] = useState(null);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const openEditModal = (subproducto) => {
    setCurrentSubproducto(subproducto);
    setIsEditModalOpen(true);
  };
  const closeEditModal = () => setIsEditModalOpen(false);  const handleCreateSubproducto = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const newSubproducto = Object.fromEntries(formData.entries());
    console.log('Datos del nuevo subproducto:', newSubproducto);
    
    // Convertir precios a números
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

    // Usar el hook de validación de errores
    const hasErrors = handleCreateError(newSubproducto);

    if (!hasErrors) {
      try {
        await create(newSubproducto);
        closeModal();
      } catch (error) {
        console.error("Error al crear el subproducto:", error);
      }
    }
  };  const handleEditSubproducto = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const updatedSubproducto = Object.fromEntries(formData.entries());
    console.log('Datos del subproducto a editar:', updatedSubproducto);

    // Usar el hook de validación de errores
    const hasErrors = handleEditError(updatedSubproducto);

    if (!hasErrors) {
      try {
        await edit(currentSubproducto.id, updatedSubproducto);
        closeEditModal();
      } catch (error) {
        console.error("Error al editar subproducto:", error);
      }
    }
  };
  const handleDeleteModalOpen = (subproducto) => {
    setCurrentSubproducto(subproducto);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
    setCurrentSubproducto(null);
  };

  const confirmDelete = async () => {
    try {
      await handleDelete(currentSubproducto.id);
      handleDeleteModalClose();
    } catch (error) {
      console.error("Error al eliminar el subproducto:", error);
    }
  };
  const handleViewClick = (subproducto) => {
    setSubproductoToView(subproducto);
    setIsViewModalOpen(true);
  };

  const handleViewModalClose = () => {
    setIsViewModalOpen(false);
    setSubproductoToView(null);
  };

  if (loading) return <p>Cargando subproductos...</p>;

  const columns = [
    { header: "Fecha Faena", key: "fechaFaena" },
    { header: "Animales Faenados", key: "numeroAnimalesFaenados" },
    { header: "Fecha Entrega", key: "fechaEntrega" },
  ];

  return (
    <div className={styles["subproducto-container"]}>
      <Table
        data={subproductos}
        columns={columns}
        headerTitle="Subproductos"        
        onCreate={openModal}        onEdit={openEditModal}
        onDelete={handleDeleteModalOpen}
        onView={handleViewClick}
        showEditAllButton={false}
        showViewButton={true}
        showExcelButton={false}
        entidad="subproductos"
      />      {/* Modal para creación */}      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Crear Subproducto"
        ariaHideApp={false}
        className="modal-crear"
        overlayClassName="modal-overlay"
        closeTimeoutMS={300}
      >
        <form onSubmit={handleCreateSubproducto} className="modal-crear-formulario">
          <div className="modal-crear-header">
            <h2 className="modal-crear-titulo">Crear Nuevo Subproducto</h2>
            <button type="button" onClick={closeModal} className="modal-crear-cerrar">×</button>
            <button type="submit" className="modal-boton-crear">Guardar</button>
          </div>          <div className="formulario-grupo">
            <label className="formulario-etiqueta">Fecha Faena:</label>
            <div className="input-container">
              <input
                type="date"
                id="fechaFaena"
                name="fechaFaena"
                required
                className={`formulario-input ${createError && createError.errors?.some(error => error.field === 'fechaFaena') ? 'input-error' : ''}`}
              />
              {createError && createError.errors?.map((error, index) => (
                error.field === 'fechaFaena' && (
                  <div key={index} className="error-message">
                    {error.message}
                  </div>
                )
              ))}
            </div>
          </div>
          <div className="formulario-grupo">
            <label className="formulario-etiqueta">Animales Faenados:</label>
            <div className="input-container">
              <input
                type="number"
                id="numeroAnimalesFaenados"
                name="numeroAnimalesFaenados"
                required
                min="1"
                step="1"
                pattern="^[0-9]+$"
                inputMode="numeric"
                className={`formulario-input ${createError && createError.errors?.some(error => error.field === 'numeroAnimalesFaenados') ? 'input-error' : ''}`}
                onKeyDown={e => {
                  if (e.key === '-' || e.key === '.' || e.key === ',') e.preventDefault();
                }}
              />
              {createError && createError.errors?.map((error, index) => (
                error.field === 'numeroAnimalesFaenados' && (
                  <div key={index} className="error-message">
                    {error.message}
                  </div>
                )
              ))}
            </div>
          </div>
          <div className="formulario-grupo">
            <label className="formulario-etiqueta">Fecha Entrega:</label>
            <div className="input-container">
              <input
                type="date"
                id="fechaEntrega"
                name="fechaEntrega"
                required
                className={`formulario-input ${createError && createError.errors?.some(error => error.field === 'fechaEntrega') ? 'input-error' : ''}`}
              />
              {createError && createError.errors?.map((error, index) => (
                error.field === 'fechaEntrega' && (
                  <div key={index} className="error-message">
                    {error.message}
                  </div>
                )
              ))}
            </div>
          </div>          {[
            "guata",
            "corazon",
            "cabezas",
            "lenguas",
            "chunchul",
            "higado",
            "rinon",
            "patas",
            "charcha"
          ].map((item) => (
            <div key={item} className="subproducto-fila">
              <div className="subproducto-nombre-grupo">
                <span className="subproducto-nombre">{item.charAt(0).toUpperCase() + item.slice(1)}</span>
              </div>
              <div className="subproducto-inputs-grupo">
                <div className="input-grupo">
                  <label>Decomisados</label>
                  <div className="input-container">
                    <input
                      type="number"
                      id={`${item}Decomisados`}
                      name={`${item}Decomisados`}
                      required
                      min="0"
                      step="1"                      
                      pattern="^[0-9]+$"
                      inputMode="numeric"
                      className={`formulario-input ${createError && createError.errors?.some(error => error.field === `${item}Decomisados`) ? 'input-error' : ''}`}
                      onKeyDown={e => {
                        if (e.key === '-' || e.key === '.' || e.key === ',') e.preventDefault();
                      }}
                    />
                    {createError && createError.errors?.map((error, index) => (
                      error.field === `${item}Decomisados` && (
                        <div key={index} className="error-message">
                          {error.message}
                        </div>
                      )
                    ))}
                  </div>
                </div>
                <div className="input-grupo">
                  <label>Entregados</label>
                  <div className="input-container">
                    <input
                      type="number"
                      id={`${item}Entregados`}
                      name={`${item}Entregados`}
                      required
                      min="0"
                      step="1"                      
                      pattern="^[0-9]+$"
                      inputMode="numeric"
                      className={`formulario-input ${createError && createError.errors?.some(error => error.field === `${item}Entregados`) ? 'input-error' : ''}`}
                      onKeyDown={e => {
                        if (e.key === '-' || e.key === '.' || e.key === ',') e.preventDefault();
                      }}
                    />
                    {createError && createError.errors?.map((error, index) => (
                      error.field === `${item}Entregados` && (
                        <div key={index} className="error-message">
                          {error.message}
                        </div>
                      )
                    ))}
                  </div>
                </div>
                <div className="input-grupo">
                  <label>Precio</label>
                  <div className="input-container">
                    <input
                      type="number"
                      id={`${item}Precio`}
                      name={`precio${item.charAt(0).toUpperCase() + item.slice(1)}`}
                      required
                      min="0"
                      step="1"                      
                      pattern="^[0-9]+$"
                      inputMode="numeric"
                      className={`formulario-input ${createError && createError.errors?.some(error => error.field === `precio${item.charAt(0).toUpperCase() + item.slice(1)}`) ? 'input-error' : ''}`}
                      onKeyDown={e => {
                        if (e.key === '-' || e.key === '.' || e.key === ',') e.preventDefault();
                      }}
                    />
                    {createError && createError.errors?.map((error, index) => (
                      error.field === `precio${item.charAt(0).toUpperCase() + item.slice(1)}` && (
                        <div key={index} className="error-message">
                          {error.message}
                        </div>
                      )
                    ))}
                  </div>
                </div>
              </div>
            </div>))}
        </form>
      </Modal>

      {/* Modal de Edición */}      <Modal
        isOpen={isEditModalOpen}
        onRequestClose={closeEditModal}
        contentLabel="Editar Subproducto"
        ariaHideApp={false}
        className="modal-crear"
        overlayClassName="modal-overlay"
        closeTimeoutMS={300}
      >
        {currentSubproducto && (
          <form onSubmit={handleEditSubproducto} className="modal-crear-formulario">
            <div className="modal-crear-header">
              <h2 className="modal-crear-titulo">Editar Subproducto</h2>
              <button type="button" onClick={closeEditModal} className="modal-crear-cerrar">×</button>
              <button type="submit" className="modal-boton-crear">Guardar</button>
            </div>            <div className="formulario-grupo">
              <label className="formulario-etiqueta">Fecha Faena:</label>
              <div className="input-container">
                <input
                  type="date"
                  id="fechaFaena"
                  name="fechaFaena"
                  defaultValue={currentSubproducto.fechaFaena}
                  required
                  className={`formulario-input ${editError && editError.errors?.some(error => error.field === 'fechaFaena') ? 'input-error' : ''}`}
                />
                {editError && editError.errors?.map((error, index) => (
                  error.field === 'fechaFaena' && (
                    <div key={index} className="error-message">
                      {error.message}
                    </div>
                  )
                ))}
              </div>
            </div>
            <div className="formulario-grupo">
              <label className="formulario-etiqueta">Animales Faenados:</label>
              <div className="input-container">
                <input
                  type="number"
                  id="numeroAnimalesFaenados"
                  name="numeroAnimalesFaenados"
                  defaultValue={currentSubproducto.numeroAnimalesFaenados}
                  required
                  min="0"
                  step="1"
                  pattern="^[0-9]+$"
                  inputMode="numeric"
                  className={`formulario-input ${editError && editError.errors?.some(error => error.field === 'numeroAnimalesFaenados') ? 'input-error' : ''}`}
                  onKeyDown={e => {
                    if (e.key === '-' || e.key === '.' || e.key === ',') e.preventDefault();
                  }}
                />
                {editError && editError.errors?.map((error, index) => (
                  error.field === 'numeroAnimalesFaenados' && (
                    <div key={index} className="error-message">
                      {error.message}
                    </div>
                  )
                ))}
              </div>
            </div>
            <div className="formulario-grupo">
              <label className="formulario-etiqueta">Fecha Entrega:</label>
              <div className="input-container">
                <input
                  type="date"
                  id="fechaEntrega"
                  name="fechaEntrega"
                  defaultValue={currentSubproducto.fechaEntrega}
                  required
                  className={`formulario-input ${editError && editError.errors?.some(error => error.field === 'fechaEntrega') ? 'input-error' : ''}`}
                />
                {editError && editError.errors?.map((error, index) => (
                  error.field === 'fechaEntrega' && (
                    <div key={index} className="error-message">
                      {error.message}
                    </div>
                  )
                ))}
              </div>
            </div>            {["guata", "corazon", "cabezas", "lenguas", "chunchul", "higado", "rinon", "patas", "charcha"].map((item) => (
              <div key={item} className="subproducto-fila">
                <div className="subproducto-nombre-grupo">
                  <span className="subproducto-nombre">{item.charAt(0).toUpperCase() + item.slice(1)}</span>
                </div>
                <div className="subproducto-inputs-grupo">
                  <div className="input-grupo">
                    <label>Decomisados</label>
                    <div className="input-container">
                      <input
                        type="number"
                        id={`${item}Decomisados`}
                        name={`${item}Decomisados`}
                        defaultValue={currentSubproducto[`${item}Decomisados`]}
                        required
                        min="0"
                        step="1"                       
                        pattern="^[0-9]+$"
                        inputMode="numeric"
                        className={`formulario-input ${editError && editError.errors?.some(error => error.field === `${item}Decomisados`) ? 'input-error' : ''}`}
                        onKeyDown={e => {
                          if (e.key === '-' || e.key === '.' || e.key === ',') e.preventDefault();
                        }}
                      />
                      {editError && editError.errors?.map((error, index) => (
                        error.field === `${item}Decomisados` && (
                          <div key={index} className="error-message">
                            {error.message}
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                  <div className="input-grupo">
                    <label>Entregados</label>
                    <div className="input-container">
                      <input
                        type="number"
                        id={`${item}Entregados`}
                        name={`${item}Entregados`}
                        defaultValue={currentSubproducto[`${item}Entregados`]}
                        required
                        min="0"
                        step="1"                       
                        pattern="^[0-9]+$"
                        inputMode="numeric"
                        className={`formulario-input ${editError && editError.errors?.some(error => error.field === `${item}Entregados`) ? 'input-error' : ''}`}
                        onKeyDown={e => {
                          if (e.key === '-' || e.key === '.' || e.key === ',') e.preventDefault();
                        }}
                      />
                      {editError && editError.errors?.map((error, index) => (
                        error.field === `${item}Entregados` && (
                          <div key={index} className="error-message">
                            {error.message}
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                  <div className="input-grupo">
                    <label>Precio</label>
                    <div className="input-container">
                      <input
                        type="number"
                        id={`${item}Precio`}
                        name={`precio${item.charAt(0).toUpperCase() + item.slice(1)}`}
                        defaultValue={currentSubproducto[`precio${item.charAt(0).toUpperCase() + item.slice(1)}`]}
                        required
                        min="0"
                        step="1"                        
                        pattern="^[0-9]+$"
                        inputMode="numeric"
                        className={`formulario-input ${editError && editError.errors?.some(error => error.field === `precio${item.charAt(0).toUpperCase() + item.slice(1)}`) ? 'input-error' : ''}`}
                        onKeyDown={e => {
                          if (e.key === '-' || e.key === '.' || e.key === ',') e.preventDefault();
                        }}
                      />
                      {editError && editError.errors?.map((error, index) => (
                        error.field === `precio${item.charAt(0).toUpperCase() + item.slice(1)}` && (
                          <div key={index} className="error-message">
                            {error.message}
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}</form>
        )}
      </Modal>

      {/* Modal de Ver Detalles */}      
      <Modal
        isOpen={isViewModalOpen}
        onRequestClose={handleViewModalClose}
        contentLabel="Ver Detalles"
        ariaHideApp={false}
        className="modal-detalles"
        overlayClassName="modal-overlay"
        closeTimeoutMS={300}      >        <div className="modal-crear-formulario">
          <div className="modal-detalles-header">          
            <h2 className="modal-detalles-titulo">Detalles del Subproducto</h2>
            <button onClick={handleViewModalClose} className="modal-detalles-cerrar">×</button>
            <button
              onClick={() => {
                openEditModal(subproductoToView);
                handleViewModalClose();
              }}
              className="modal-detalles-editar"
            >
              <MdOutlineEdit size={24} />
            </button>
          </div>          {subproductoToView && (
          <div className="modal-detalles-contenido">
            <div className="datos-grid">{[
                "guata",
                "corazon",
                "cabezas",
                "lenguas",
                "chunchul",
                "higado",
                "rinon",
                "patas",
                "charcha"
              ].map((item) => (
                <div key={item} className="dato-item">
                  <span className="dato-label">{item.charAt(0).toUpperCase() + item.slice(1)}</span>
                  <span className="dato-value">
                    <span className="Cantidad">Decomisados: {subproductoToView[`${item}Decomisados`] || 0}</span>
                    <span className="Cantidad">Entregados: {subproductoToView[`${item}Entregados`] || 0}</span>
                    <span className="precio">
                      ${subproductoToView[`precio${item.charAt(0).toUpperCase() + item.slice(1)}`] || 0}
                    </span>
                  </span>
                </div>              ))}
            </div>
          </div>
        )}
        </div>
      </Modal>

      {/* Modal de Eliminación */}      <Modal
        isOpen={isDeleteModalOpen}
        onRequestClose={handleDeleteModalClose}
        contentLabel="Eliminar"
        ariaHideApp={false}        className="formulario-table-modal-form"
        overlayClassName="formulario-table-overlay"
        style={{ content: { maxWidth: '400px' } }}
      ><h2 className="formulario-table-modal-title">Confirmar Eliminación</h2>
        <p>¿Estás seguro de que deseas eliminar este subproducto?</p>
        {currentSubproducto && (
          <div style={{ margin: '20px 0', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
            <p><strong>Animales Faenados:</strong> {currentSubproducto.numeroAnimalesFaenados}</p>
            <p><strong>Fecha Entrega:</strong> {currentSubproducto.fechaEntrega}</p>
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

export default Subproductos;
