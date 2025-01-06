import React, { useState, useEffect } from "react";
import { useGetProveedor } from "@hooks/proveedor/useGetProveedor";
import { useCreateProveedor } from "@hooks/proveedor/useCreateProveedor";
import { useDeleteProveedor } from "@hooks/proveedor/useDeleteProveedor";
import { useUpdateProveedor } from "@hooks/proveedor/useUpdateProveedor";
import Table from "../components/Table";
import Modal from "react-modal";
import styles from "@styles/categoria.module.css";
import "@styles/formulariotable.css";
import Swal from 'sweetalert2';

const Proveedores = () => {
  const { proveedores, loading, error, fetchProveedores } = useGetProveedor();
  const { handleCreate } = useCreateProveedor(fetchProveedores);
  const { handleDelete } = useDeleteProveedor(fetchProveedores);
  const { handleUpdate } = useUpdateProveedor(fetchProveedores);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [proveedorToEdit, setProveedorToEdit] = useState(null);
  const [proveedorToDelete, setProveedorToDelete] = useState(null);
  const [newProveedorData, setNewProveedorData] = useState({
    nombre: "",
    direccion: "",
    banco: "",
    numeroCuenta: "",
    tipoCuenta: "",
    nombreEncargado: "",
    nombreRepartidor: "",
    movilEncargado: "",
    telefonoEncargado: "",
    movilRepartidor: "",
    telefonoRepartidor: "",
  });
  const [formData, setFormData] = useState({
    nombre: "",
    direccion: "",
    banco: "",
    numeroCuenta: "",
    tipoCuenta: "",
    nombreEncargado: "",
    nombreRepartidor: "",
    movilEncargado: "",
    telefonoEncargado: "",
    movilRepartidor: "",
    telefonoRepartidor: "",
  });

  const [formStep, setFormStep] = useState(1);

  useEffect(() => {
    console.log("Proveedores obtenidos:", proveedores);
  }, [proveedores]);

  const handleDeleteClick = (proveedor) => {
    setProveedorToDelete(proveedor);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
    setProveedorToDelete(null);
  };

  const confirmDelete = () => {
    handleDelete(proveedorToDelete.id);
    setIsDeleteModalOpen(false);
    setProveedorToDelete(null);
  };

  const handleUpdateClick = (proveedor) => {
    setProveedorToEdit(proveedor);
    setFormData({
      nombre: proveedor.nombre,
      direccion: proveedor.direccion,
      banco: proveedor.banco,
      numeroCuenta: proveedor.numeroCuenta,
      tipoCuenta: proveedor.tipoCuenta,
      nombreEncargado: proveedor.nombreEncargado,
      nombreRepartidor: proveedor.nombreRepartidor,
      movilEncargado: proveedor.movilEncargado,
      telefonoEncargado: proveedor.telefonoEncargado,
      movilRepartidor: proveedor.movilRepartidor,
      telefonoRepartidor: proveedor.telefonoRepartidor
    });
    setIsEditModalOpen(true);
  };

  const handleCreateClick = () => {
    setIsCreateModalOpen(true);
  };

  const validateFields = (data) => {
    // Validación de nombre (solo letras y mínimo 3 caracteres)
    const nombreRegex = /^[a-zA-Z\s]+$/;
    if (!nombreRegex.test(data.nombre) || data.nombre.length < 3) {
      Swal.fire("Error", "El nombre solo puede contener letras y debe tener al menos 3 caracteres.", "error");
      return false;
    }

    // Validación de direccion (máximo 50 caracteres y mínimo 3 caracteres)
    if (data.direccion.length < 3 || data.direccion.length > 50) {
      Swal.fire("Error", "La dirección debe tener entre 3 y 50 caracteres.", "error");
      return false;
    }

    // Validación de banco (máximo 20 caracteres y mínimo 3 caracteres)
    if (data.banco.length < 3 || data.banco.length > 20) {
      Swal.fire("Error", "El banco debe tener entre 3 y 20 caracteres.", "error");
      return false;
    }

    // Validación de numeroCuenta (solo números)
    const cuentaRegex = /^[0-9]+$/;
    if (!cuentaRegex.test(data.numeroCuenta)) {
      Swal.fire("Error", "El número de cuenta solo puede contener números.", "error");
      return false;
    }

    // Validación de nombreEncargado (solo letras y mínimo 3 caracteres)
    if (!nombreRegex.test(data.nombreEncargado) || data.nombreEncargado.length < 3) {
      Swal.fire("Error", "El nombre del encargado solo puede contener letras y debe tener al menos 3 caracteres.", "error");
      return false;
    }

    // Validación de movilEncargado (debe tener 9 dígitos)
    const movilEncargadoRegex = /^[0-9]{9}$/;
    if (!movilEncargadoRegex.test(data.movilEncargado)) {
      Swal.fire("Error", "El móvil del encargado debe tener 9 dígitos.", "error");
      return false;
    }

    // Validación de telefonoEncargado (debe ser un número válido)
    const telefonoEncargadoRegex = /^[0-9]+$/;
    if (!telefonoEncargadoRegex.test(data.telefonoEncargado)) {
      Swal.fire("Error", "El teléfono del encargado debe ser un número válido.", "error");
      return false;
    }

    // Validación de movilRepartidor (debe tener 9 dígitos)
    const movilRepartidorRegex = /^[0-9]{9}$/;
    if (!movilRepartidorRegex.test(data.movilRepartidor)) {
      Swal.fire("Error", "El móvil del repartidor debe tener 9 dígitos.", "error");
      return false;
    }

    // Validación de telefonoRepartidor (debe ser un número válido)
    const telefonoRepartidorRegex = /^[0-9]+$/;
    if (!telefonoRepartidorRegex.test(data.telefonoRepartidor)) {
      Swal.fire("Error", "El teléfono del repartidor debe ser un número válido.", "error");
      return false;
    }

    return true;
  };

  const handleCreateModalChange = (e) => {
    const { name, value } = e.target;

    // Manejo de campos booleanos (estadoEncargado o estadoRepartidor)
    if (name === "estadoEncargado" || name === "estadoRepartidor") {
      const booleanValue = value === "true"; // Convertir "true"/"false" a booleano

      setNewProveedorData((prevData) => ({
        ...prevData,
        [name]: booleanValue, // Actualiza el estado con el valor booleano
      }));
    } else {
      // Actualización de otros valores (sin contacto)
      setNewProveedorData((prevData) => ({
        ...prevData,
        [name]: value, // Actualiza el valor del campo
      }));
    }
  };

  const handleCreateModalSubmit = (e) => {
    e.preventDefault();
    
    // Validar los campos antes de proceder
    if (validateFields(newProveedorData)) {
      // Llamar a la función de creación pasando los datos validados
      handleCreate(newProveedorData);

      // Limpiar los datos después de guardar
      setNewProveedorData({
        nombre: "",
        direccion: "",
        banco: "",
        numeroCuenta: "",
        tipoCuenta: "",
        nombreEncargado: "",
        nombreRepartidor: "",
        movilEncargado: "",
        telefonoEncargado: "",
        movilRepartidor: "",
        telefonoRepartidor: "",
      });

      // Cerrar el modal de creación
      setIsCreateModalOpen(false);
    }
  };

  const handleEditChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (validateFields(formData)) {
      handleUpdate(proveedorToEdit.id, formData);
      setIsEditModalOpen(false);
    }
  }; 

  const handleBackStep = () => {
    if (formStep === 3) {
      setFormStep(2);  // Vuelve al paso 2 si estás en el paso 3
    } else if (formStep === 2) {
      setFormStep(1);  // Vuelve al paso 1 si estás en el paso 2
    }
  };
  
  const handleNextStep = () => {
    if (formStep === 1) {
      setFormStep(2);  // Avanza al paso 2 si estás en el paso 1
    } else if (formStep === 2) {
      setFormStep(3);  // Avanza al paso 3 si estás en el paso 2
    }
  };
  if (loading) return <p>Cargando proveedores...</p>;
  if (error) return <p>Error: {error}</p>;

  const columns = [
    { header: "Nombre", key: "nombre" },
    { header: "Dirección", key: "direccion" },
    { header: "Banco", key: "banco" },
    { header: "Número Cuenta", key: "numeroCuenta" },
    { header: "Tipo de Cuenta", key: "tipoCuenta" },
    { header: "Encargado", key: "nombreEncargado" },
    { header: "Teléfono Encargado", key: "telefonoEncargado" },
    { header: "Móvil Encargado", key: "movilEncargado" },
    { header: "Repartidor", key: "nombreRepartidor" },
    { header: "Telefono Repartidor", key: "telefonoRepartidor" },
    { header: "Móvil Repartidor", key: "movilRepartidor" },

    
    
  ];

  return (
    <div className={styles["categoria-container"]}>
      <Table
        data={proveedores}
        columns={columns}
        headerTitle="Proveedores"
        onCreate={handleCreateClick}
        onEdit={handleUpdateClick}
        onDelete={handleDeleteClick}
        showEditAllButton={false}
        showViewButton={false}
        showCalendarButton = {false}
      />

      {/* Modal de Creación */}
      <Modal
        isOpen={isCreateModalOpen}
        onRequestClose={() => setIsCreateModalOpen(false)}
        contentLabel="Añadir Proveedor"
        ariaHideApp={false}
        className="formulario-table-modal-form"
        overlayClassName="formulario-table-overlay"
      >
        <h2 className="formulario-table-modal-title">Añadir Proveedor</h2>
        <form onSubmit={handleCreateModalSubmit} className="formulario-table-formulario-table">
          {formStep === 1 && (
            <>
              <div className="formulario-table-field-group">
                <label htmlFor="nombre">Nombre del Proveedor:</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={newProveedorData.nombre}
                  onChange={handleCreateModalChange}
                  required
                  className="formulario-table-input"
                />
              </div>
              <div className="formulario-table-field-group">
                <label htmlFor="direccion">Dirección:</label>
                <input
                  type="text"
                  id="direccion"
                  name="direccion"
                  value={newProveedorData.direccion}
                  onChange={handleCreateModalChange}
                  required
                  className="formulario-table-input"
                />
              </div>
              <div className="formulario-table-field-group">
                <label htmlFor="banco">Banco:</label>
                <input
                  type="text"
                  id="banco"
                  name="banco"
                  value={newProveedorData.banco}
                  onChange={handleCreateModalChange}
                  required
                  className="formulario-table-input"
                />
              </div>
              <div className="formulario-table-field-group">
                <label htmlFor="numeroCuenta">Número de Cuenta:</label>
                <input
                  type="text"
                  id="numeroCuenta"
                  name="numeroCuenta"
                  value={newProveedorData.numeroCuenta}
                  onChange={handleCreateModalChange}
                  required
                  className="formulario-table-input"
                />
              </div>
              <div className="formulario-table-field-group">
                <label htmlFor="tipoCuenta">Tipo de Cuenta:</label>
                <select
                  id="tipoCuenta"
                  name="tipoCuenta"
                  value={newProveedorData.tipoCuenta}
                  onChange={handleCreateModalChange}
                  required
                  className="formulario-table-input tipo-cuenta-select"
                >
                  <option value="">Selecciona un tipo de cuenta</option>
                  <option value="Cuenta corriente">Cuenta corriente</option>
                  <option value="Cuenta vista">Cuenta vista</option>
                  <option value="Cuenta de ahorro">Cuenta de ahorro</option>
                </select>
              </div>
              <div className="formulario-table-form-actions">
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="formulario-table-btn-confirm"
                >
                  Siguiente
                </button>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="formulario-table-btn-cancel"
              >
                Cancelar
              </button>
              <div className="formulario-table-form-actions">
              </div>
            </>
          )}
          {formStep === 2 && (
            <>
              <div className="formulario-table-field-group">
                <label htmlFor="nombreEncargado">Encargado:</label>
                <input
                  type="text"
                  id="nombreEncargado"
                  name="nombreEncargado"
                  value={newProveedorData.nombreEncargado}
                  onChange={handleCreateModalChange}
                  className="formulario-table-input"
                />
              </div>

              <div className="formulario-table-field-group">
  <label htmlFor="telefonoEncargado">Telefono Encargado:</label>
  <input
    type="tel"
    id="telefonoEncargado"
    name="telefonoEncargado"
    value={newProveedorData.telefonoEncargado} // Extraemos el número del primer objeto del array
    onChange={handleCreateModalChange}
    pattern="^[0-9]+$" // Solo permite números
    maxLength="15" // Limita a 15 dígitos como máximo, ajusta según tu necesidad
    className="formulario-table-input"
  />
</div>
<div className="formulario-table-field-group">
  <label htmlFor="movilEncargado">Móvil Encargado:</label>
  <input
    type="tel"
    id="movilEncargado"
    name="movilEncargado"
    value={newProveedorData.movilEncargado} // Extraemos el número del primer objeto del array
    onChange={handleCreateModalChange}
    pattern="^[0-9]+$" // Solo permite números
    maxLength="15" // Limita a 15 dígitos como máximo, ajusta según tu necesidad
    className="formulario-table-input"
  />
</div>


              <div className="formulario-table-form-actions">
              <button
                  type="button"
                  onClick={handleNextStep}
                  className="formulario-table-btn-confirm"
                >
                  Siguiente
                </button>
           
              </div>
              <button
                  type="button"
                  onClick={handleBackStep}
                  className="formulario-table-btn-cancel"
                >
                  Atrás
                </button>
            </>
          )}
          {formStep === 3 && (
            <>
                            <div className="formulario-table-field-group">
                <label htmlFor="nombreRepartidor">Repartidor:</label>
                <input
                  type="text"
                  id="nombreRepartidor"
                  name="nombreRepartidor"
                  value={newProveedorData.nombreRepartidor }
                  onChange={handleCreateModalChange}
                  className="formulario-table-input"
                />
               </div>
               <label htmlFor="telefonoRepartidor">Telefono Repartidor:</label>
              <input
                type="tel"
                id="telefonoRepartidor"
                name="telefonoRepartidor"
                value={newProveedorData.telefonoRepartidor} // Extraemos el número del primer objeto del array
                onChange={handleCreateModalChange}
                pattern="^[0-9]+$" // Solo permite números
                maxLength="15" // Limita a 15 dígitos como máximo, ajusta según tu necesidad
                className="formulario-table-input"
              />

<div className="formulario-table-field-group">
  <label htmlFor="movilRepartidor">Móvil Repartidor:</label>
  <input
    type="tel"
    id="movilRepartidor"
    name="movilRepartidor"
    value={newProveedorData.movilRepartidor} // Extraemos el número del primer objeto del array
    onChange={handleCreateModalChange}
    pattern="^[0-9]+$" // Solo permite números
    maxLength="15" // Limita a 15 dígitos como máximo, ajusta según tu necesidad
    className="formulario-table-input"
  />
</div>
               

             
              <div className="formulario-table-form-actions">
                <button
                  type="button"
                  onClick={handleBackStep}
                  className="formulario-table-btn-cancel"
                >
                  Atrás
                </button>
                <button
                  type="submit"
                  className="formulario-table-btn-confirm"
                >
                  Crear Proveedor
                </button>
              </div>
            </>
          )}
          
        </form>
      </Modal>
      



      {/* Modal de Edicion*/}
      <Modal
        isOpen={isEditModalOpen}
        onRequestClose={() => setIsEditModalOpen(false)}
        contentLabel="Editar Proveedor"
        ariaHideApp={false}
        className="formulario-table-modal-form"
        overlayClassName="formulario-table-overlay"
      >
        <h2 className="formulario-table-modal-title">Editar Proveedor</h2>
        <form onSubmit={handleEditSubmit} className="formulario-table-formulario-table">
          {formStep === 1 && (
            <>
              <div className="formulario-table-field-group">
                <label htmlFor="nombre">Nombre del Proveedor:</label>
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
              <div className="formulario-table-field-group">
                <label htmlFor="direccion">Dirección:</label>
                <input
                  type="text"
                  id="direccion"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleEditChange}
                  required
                  className="formulario-table-input"
                />
              </div>
              <div className="formulario-table-field-group">
                <label htmlFor="banco">Banco:</label>
                <input
                  type="text"
                  id="banco"
                  name="banco"
                  value={formData.banco}
                  onChange={handleEditChange}
                  required
                  className="formulario-table-input"
                />
              </div>
              <div className="formulario-table-field-group">
                <label htmlFor="numeroCuenta">Número de Cuenta:</label>
                <input
                  type="text"
                  id="numeroCuenta"
                  name="numeroCuenta"
                  value={formData.numeroCuenta}
                  onChange={handleEditChange}
                  required
                  className="formulario-table-input"
                />
              </div>
              <div className="formulario-table-field-group">
                <label htmlFor="tipoCuenta">Tipo de Cuenta:</label>
                <select
                  id="tipoCuenta"
                  name="tipoCuenta"
                  value={formData.tipoCuenta}
                  onChange={handleEditChange}
                  required
                  className="formulario-table-input tipo-cuenta-select"
                >
                  <option value="">Selecciona un tipo de cuenta</option>
                  <option value="Cuenta corriente">Cuenta corriente</option>
                  <option value="Cuenta vista">Cuenta vista</option>
                  <option value="Cuenta de ahorro">Cuenta de ahorro</option>
                </select>
              </div>
              <div className="formulario-table-form-actions">
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="formulario-table-btn-confirm"
                >
                  Siguiente
                </button>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="formulario-table-btn-cancel"
              >
                Cancelar
              </button>
              <div className="formulario-table-form-actions">
              </div>
            </>
          )}
                  {formStep === 2 && (
            <>
              <div className="formulario-table-field-group">
                <label htmlFor="nombreEncargado">Encargado:</label>
                <input
                  type="text"
                  id="nombreEncargado"
                  name="nombreEncargado"
                  value={formData.nombreEncargado}
                  onChange={handleEditChange}
                  className="formulario-table-input"
                />
              </div>

              <div className="formulario-table-field-group">
  <label htmlFor="telefonoEncargado">Telefono Encargado:</label>
  <input
    type="tel"
    id="telefonoEncargado"
    name="telefonoEncargado"
    value={formData.telefonoEncargado} // Extraemos el número del primer objeto del array
    onChange={handleEditChange}
    pattern="^[0-9]+$" // Solo permite números
    maxLength="15" // Limita a 15 dígitos como máximo, ajusta según tu necesidad
    className="formulario-table-input"
  />
</div>
<div className="formulario-table-field-group">
  <label htmlFor="movilEncargado">Móvil Encargado:</label>
  <input
    type="tel"
    id="movilEncargado"
    name="movilEncargado"
    value={formData.movilEncargado} // Extraemos el número del primer objeto del array
    onChange={handleEditChange}
    pattern="^[0-9]+$" // Solo permite números
    maxLength="15" // Limita a 15 dígitos como máximo, ajusta según tu necesidad
    className="formulario-table-input"
  />
</div>


       
              <div className="formulario-table-form-actions">
              <button
                  type="button"
                  onClick={handleNextStep}
                  className="formulario-table-btn-confirm"
                >
                  Siguiente
                </button>
           
              </div>
              <button
                  type="button"
                  onClick={handleBackStep}
                  className="formulario-table-btn-cancel"
                >
                  Atrás
                </button>
            </>
          )}
          {formStep === 3 && (
            <>
                            <div className="formulario-table-field-group">
                <label htmlFor="nombreRepartidor">Repartidor:</label>
                <input
                  type="text"
                  id="nombreRepartidor"
                  name="nombreRepartidor"
                  value={formData.nombreRepartidor }
                  onChange={handleEditChange}
                  className="formulario-table-input"
                />
               </div>
               <label htmlFor="telefonoRepartidor">Telefono Repartidor:</label>
              <input
                type="tel"
                id="telefonoRepartidor"
                name="telefonoRepartidor"
                value={formData.telefonoRepartidor} // Extraemos el número del primer objeto del array
                onChange={handleEditChange}
                pattern="^[0-9]+$" // Solo permite números
                maxLength="15" // Limita a 15 dígitos como máximo, ajusta según tu necesidad
                className="formulario-table-input"
              />

<div className="formulario-table-field-group">
  <label htmlFor="movilRepartidor">Móvil Repartidor:</label>
  <input
    type="tel"
    id="movilRepartidor"
    name="movilRepartidor"
    value={formData.movilRepartidor} // Extraemos el número del primer objeto del array
    onChange={handleEditChange}
    pattern="^[0-9]+$" // Solo permite números
    maxLength="15" // Limita a 15 dígitos como máximo, ajusta según tu necesidad
    className="formulario-table-input"
  />
</div>
               
    
              <div className="formulario-table-form-actions">
                <button
                  type="button"
                  onClick={handleBackStep}
                  className="formulario-table-btn-cancel"
                >
                  Atrás
                </button>
                <button
                  type="submit"
                  className="formulario-table-btn-confirm"
                >
                  Crear Proveedor
                </button>
              </div>
            </>
          )}
          
        </form>
      </Modal>
      
 

      {/* Modal de Eliminación */}
      <Modal
        isOpen={isDeleteModalOpen}
        onRequestClose={handleDeleteModalClose}
        contentLabel="Eliminar Proveedor"
        ariaHideApp={false}
        className="formulario-table-modal-form"
        overlayClassName="formulario-table-overlay"
      >
        <h2 className="formulario-table-modal-title">¿Estás seguro que deseas eliminar este proveedor?</h2>
        <div className="formulario-table-form-actions">
          <button
            onClick={confirmDelete}
            className="formulario-table-btn-confirm"
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

export default Proveedores;
