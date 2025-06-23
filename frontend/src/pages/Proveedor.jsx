import React, { useState, useEffect } from "react";
import { useGetProveedor } from "@hooks/proveedor/useGetProveedor";
import { useCreateProveedor } from "@hooks/proveedor/useCreateProveedor";
import { useDeleteProveedor } from "@hooks/proveedor/useDeleteProveedor";
import { useUpdateProveedor } from "@hooks/proveedor/useUpdateProveedor";
import { useErrorHandlerProveedor } from "@hooks/proveedor/useErrorHandlerProveedor";
import { MdOutlineEdit } from "react-icons/md";
import Table from "../components/Table";
import Modal from "react-modal";
import styles from "@styles/categoria.module.css";
import "@styles/formulariotable.css";
import "@styles/modalCrear.css";
import "@styles/modalDetalles.css";
import Swal from 'sweetalert2';

const Proveedores = () => {
  const { proveedores, loading, error, fetchProveedores } = useGetProveedor();
  const { handleCreate } = useCreateProveedor(fetchProveedores);
  const { handleDelete } = useDeleteProveedor(fetchProveedores);
  const { handleUpdate } = useUpdateProveedor(fetchProveedores);
  const { createError, editError, handleCreateError, handleEditError } = useErrorHandlerProveedor();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [proveedorToEdit, setProveedorToEdit] = useState(null);
  const [proveedorToDelete, setProveedorToDelete] = useState(null);
  const [proveedorToView, setProveedorToView] = useState(null);
    const initialProveedorData = {
    rut: "",
    nombre: "",
    direccion: "",
    banco: "",
    numeroCuenta: "",
    tipoCuenta: "",
    nombreEncargado: "",
    movilEncargado: [""],
  };

  const [newProveedorData, setNewProveedorData] = useState(initialProveedorData);
  const [formData, setFormData] = useState(initialProveedorData);

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
      rut: proveedor.rut,
      nombre: proveedor.nombre,
      direccion: proveedor.direccion,
      banco: proveedor.banco,
      numeroCuenta: proveedor.numeroCuenta,
      tipoCuenta: proveedor.tipoCuenta,
      nombreEncargado: proveedor.nombreEncargado,
      movilEncargado: Array.isArray(proveedor.movilEncargado) ? proveedor.movilEncargado : [proveedor.movilEncargado],
    });
    setIsEditModalOpen(true);
  }

  const handleCreateClick = () => {
    setIsCreateModalOpen(true);
    setNewProveedorData(initialProveedorData);
  };

  const handleViewClick = (proveedor) => {
    setProveedorToView(proveedor);
    setIsViewModalOpen(true);
  };

  const handleViewModalClose = () => {
    setIsViewModalOpen(false);
    setProveedorToView(null);
  };

  const validateFields = (data) => {
    // Validación de nombre (solo letras y mínimo 3 caracteres)
    const nombreRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{3,}$/;
    if (!data.nombre || !nombreRegex.test(data.nombre)) {
      Swal.fire("Error", "El nombre debe tener al menos 3 caracteres y solo puede contener letras.", "error");
      return false;
    }

    // Validación de número de cuenta (solo números)
    const numeroCuentaRegex = /^[0-9]+$/;
    if (!data.numeroCuenta || !numeroCuentaRegex.test(data.numeroCuenta)) {
      Swal.fire("Error", "El número de cuenta es requerido y solo debe contener números.", "error");
      return false;
    }    // Validación de móviles (deben contener solo números y pueden empezar con +)
    const movilRegex = /^\+?(?:[0-9]{9}|[0-9]{11})$/;
    const moviles = Array.isArray(data.movilEncargado) ? data.movilEncargado : [data.movilEncargado];
    if (!moviles.length || !moviles[0]) {
      Swal.fire("Error", "Debe ingresar al menos un número móvil.", "error");
      return false;
    }
    for (const movil of moviles) {
      if (!movilRegex.test(movil)) {
        Swal.fire("Error", "Los números móviles deben tener 9 u 11 dígitos.", "error");
        return false;
      }
    }

    // Validación de campos requeridos
    const requiredFields = ["direccion", "banco", "tipoCuenta", "nombreEncargado"];
    for (const field of requiredFields) {
      if (!data[field] || data[field].trim() === "") {
        Swal.fire("Error", `El campo ${field.replace(/([A-Z])/g, " $1").toLowerCase()} es requerido.`, "error");
        return false;
      }
    }

    return true;
  };
  const handleSubmit = async (e, isEditing = false) => {
    e.preventDefault();
    const formDataToSubmit = isEditing ? formData : newProveedorData;

    // Usar el hook de validación de errores
    const hasErrors = isEditing 
      ? handleEditError(formDataToSubmit, proveedores, proveedorToEdit?.id)
      : handleCreateError(formDataToSubmit, proveedores);

    if (!hasErrors) {
      try {
        if (isEditing) {
          await handleUpdate(proveedorToEdit.id, formDataToSubmit);
          setIsEditModalOpen(false);
          setProveedorToEdit(null);
        } else {
          await handleCreate(formDataToSubmit);
          setIsCreateModalOpen(false);
        }
        setFormData(initialProveedorData);
        setNewProveedorData(initialProveedorData);
      } catch (error) {
        console.error("Error al procesar el formulario:", error);
        Swal.fire("Error", "Hubo un error al procesar el formulario.", "error");
      }
    }
  };

  const handleChange = (e, isEditing = false) => {
    const { name, value } = e.target;
    const setState = isEditing ? setFormData : setNewProveedorData;
    const currentState = isEditing ? formData : newProveedorData;    if (name === "movilEncargado") {
      // Si el valor viene con un índice (ej: movilEncargado-0)
      const indexMatch = e.target.id.match(/movilEncargado-(\d+)/);
      if (indexMatch) {
        const index = parseInt(indexMatch[1]);
        let newMoviles = [...(currentState.movilEncargado || [])];
        
        // Limitar a solo números y un posible + al inicio
        let cleanValue = value.replace(/[^\d+]/g, '');
        const startsWithPlus = cleanValue.startsWith('+');
        
        // Remover todos los + excepto el primero si existe
        cleanValue = cleanValue.replace(/\+/g, '');
        if (startsWithPlus) {
          cleanValue = '+' + cleanValue;
        }          // Limitar el número a 9 u 11 dígitos
        const digitsOnly = cleanValue.replace(/^\+/, '');
        const digitLength = digitsOnly.length;
          if (digitLength > 11) {
          // Si tiene más de 11 dígitos, truncar a 11
          const truncatedDigits = digitsOnly.slice(0, 11);
          cleanValue = startsWithPlus ? '+' + truncatedDigits : truncatedDigits;
        } else if (digitLength > 9 && digitLength < 12) {
          // Si tiene entre 9 y 11 dígitos, mantener todos los dígitos
          cleanValue = startsWithPlus ? '+' + digitsOnly : digitsOnly;
        } else if (digitLength > 9) {
          // Si tiene más de 9 dígitos pero no es camino a 11, truncar a 9
          const truncatedDigits = digitsOnly.slice(0, 9);
          cleanValue = startsWithPlus ? '+' + truncatedDigits : truncatedDigits;
        }
        
        // Actualiza el número en el índice específico
        newMoviles[index] = cleanValue;
        setState({
          ...currentState,
          movilEncargado: newMoviles
        });
      }
    } else {
      setState({
        ...currentState,
        [name]: value,
      });
    }
  };

  const handleAddMovil = (isEditing = false) => {
    const setState = isEditing ? setFormData : setNewProveedorData;
    const currentState = isEditing ? formData : newProveedorData;
    
    setState({
      ...currentState,
      movilEncargado: [...currentState.movilEncargado, ""]
    });
  };

  const handleRemoveMovil = (index, isEditing = false) => {
    const setState = isEditing ? setFormData : setNewProveedorData;
    const currentState = isEditing ? formData : newProveedorData;
    
    const newMoviles = currentState.movilEncargado.filter((_, i) => i !== index);
    setState({
      ...currentState,
      movilEncargado: newMoviles
    });
  };

  const columns = [
    { header: "Nombre", key: "nombre" },
    { header: "Dirección", key: "direccion" }
  ];

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={styles["categoria-container"]}>
      <Table
        data={proveedores}
        columns={columns}
        headerTitle="Proveedores"
        onCreate={handleCreateClick}
        onEdit={handleUpdateClick}
        onDelete={handleDeleteClick}        showEditAllButton={false}
        showViewButton={true}
        onView={handleViewClick}
        showCalendarButton={false}
        entidad="proveedores"
        customFormat={(value, key) => {
          if (key === "movilEncargado" && Array.isArray(value)) {
            return value.join(", ");
          }
          return value;
        }}
      />

      {/* Modal de Creación */}
      <Modal
        isOpen={isCreateModalOpen}
        onRequestClose={() => setIsCreateModalOpen(false)}
        contentLabel="Crear Proveedor"
        ariaHideApp={false}
        className="modal-crear"
        overlayClassName="modal-overlay"
        closeTimeoutMS={300}
      >
        <form onSubmit={(e) => handleSubmit(e, false)} className="modal-crear-formulario">
          <div className="modal-crear-header">
            <h2 className="modal-crear-titulo">Crear Nuevo Proveedor</h2>
            <button type="button" onClick={() => setIsCreateModalOpen(false)} className="modal-crear-cerrar">×</button>
            <button type="submit" className="modal-boton-crear">Guardar</button>
          </div>

          <div style={{ width: '100%', margin: '0 auto', maxWidth: '800px' }}>            <div className="subproducto-fila" style={{ flex: 1, minWidth: '300px' }}>
              <div className="subproducto-nombre-grupo">
                <span className="subproducto-nombre">Nombre</span>
              </div>
              <div className="subproducto-inputs-grupo">
                <div className="input-grupo" style={{ width: '100%' }}>
                  <div className="input-container">
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      value={newProveedorData.nombre}
                      onChange={(e) => handleChange(e, false)}
                      className={`formulario-input ${createError && createError.errors?.some(error => error.field === 'nombre') ? 'input-error' : ''}`}
                      style={{ minWidth: '220px', textAlign: 'left' }}
                      required
                    />
                    {createError && createError.errors?.map((error, index) => (
                      error.field === 'nombre' && (
                        <div key={index} className="error-message">
                          {error.message}
                        </div>
                      )
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="subproducto-fila" style={{ flex: 1, minWidth: '300px' }}>
              <div className="subproducto-nombre-grupo">
                <span className="subproducto-nombre">RUT</span>
              </div>
              <div className="subproducto-inputs-grupo">
                <div className="input-grupo" style={{ width: '100%' }}>
                  <div className="input-container">
                    <input
                      type="text"
                      id="rut"
                      name="rut"
                      value={newProveedorData.rut}
                      onChange={(e) => handleChange(e, false)}
                      className={`formulario-input ${createError && createError.errors?.some(error => error.field === 'rut') ? 'input-error' : ''}`}
                      style={{ minWidth: '220px', textAlign: 'left' }}
                      required
                      placeholder="Ej: 12.345.678-9"
                    />
                    {createError && createError.errors?.map((error, index) => (
                      error.field === 'rut' && (
                        <div key={index} className="error-message">
                          {error.message}
                        </div>
                      )
                    ))}
                  </div>
                </div>
              </div>
            </div>            <div className="subproducto-fila" style={{ flex: 1, minWidth: '300px' }}>
              <div className="subproducto-nombre-grupo">
                <span className="subproducto-nombre">Dirección</span>
              </div>
              <div className="subproducto-inputs-grupo">
                <div className="input-grupo" style={{ width: '100%' }}>
                  <div className="input-container">
                    <input
                      type="text"
                      id="direccion"
                      name="direccion"
                      value={newProveedorData.direccion}
                      onChange={(e) => handleChange(e, false)}
                      className={`formulario-input ${createError && createError.errors?.some(error => error.field === 'direccion') ? 'input-error' : ''}`}
                      style={{ minWidth: '220px', textAlign: 'left' }}
                      required
                    />
                    {createError && createError.errors?.map((error, index) => (
                      error.field === 'direccion' && (
                        <div key={index} className="error-message">
                          {error.message}
                        </div>
                      )
                    ))}
                  </div>
                </div>
              </div>
            </div>            <div style={{ display: 'flex', gap: '15px', marginBottom: '10px' }}>
              <div className="subproducto-fila" style={{ flex: 1, minWidth: '300px' }}>
                <div className="subproducto-nombre-grupo">
                  <span className="subproducto-nombre">Banco</span>
                </div>
                <div className="subproducto-inputs-grupo">
                  <div className="input-grupo" style={{ width: '100%' }}>
                    <div className="input-container">
                      <select
                        id="banco"
                        name="banco"
                        value={newProveedorData.banco}
                        onChange={(e) => handleChange(e, false)}
                        className={`formulario-input ${createError && createError.errors?.some(error => error.field === 'banco') ? 'input-error' : ''}`}
                        style={{ minWidth: '220px', textAlign: 'left' }}
                        required
                      >
                        <option value="">Seleccione Banco</option>
                        <option value="Banco de Chile">Banco de Chile</option>
                        <option value="Banco Santander">Banco Santander</option>
                        <option value="Banco BCI">Banco BCI</option>
                        <option value="Banco Itaú">Banco Itaú</option>
                        <option value="Scotiabank">Scotiabank</option>
                        <option value="Banco Estado">Banco Estado</option>
                        <option value="Banco BICE">Banco BICE</option>
                        <option value="Banco Security">Banco Security</option>
                        <option value="Banco Falabella">Banco Falabella</option>
                        <option value="Banco Ripley">Banco Ripley</option>
                        <option value="Banco Consorcio">Banco Consorcio</option>
                        <option value="Banco Internacional">Banco Internacional</option>
                        <option value="Banco BTG Pactual">Banco BTG Pactual</option>
                        <option value="HSBC Bank">HSBC Bank</option>
                        <option value="Deutsche Bank">Deutsche Bank</option>
                      </select>
                      {createError && createError.errors?.map((error, index) => (
                        error.field === 'banco' && (
                          <div key={index} className="error-message">
                            {error.message}
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="subproducto-fila" style={{ flex: 1, minWidth: '300px' }}>
                <div className="subproducto-nombre-grupo">
                  <span className="subproducto-nombre">Número de Cuenta</span>
                </div>
                <div className="subproducto-inputs-grupo">
                  <div className="input-grupo" style={{ width: '100%' }}>
                    <div className="input-container">
                      <input
                        type="text"
                        id="numeroCuenta"
                        name="numeroCuenta"
                        value={newProveedorData.numeroCuenta}
                        onChange={(e) => handleChange(e, false)}
                        className={`formulario-input ${createError && createError.errors?.some(error => error.field === 'numeroCuenta') ? 'input-error' : ''}`}
                        style={{ minWidth: '220px', textAlign: 'left' }}
                        required
                      />
                      {createError && createError.errors?.map((error, index) => (
                        error.field === 'numeroCuenta' && (
                          <div key={index} className="error-message">
                            {error.message}
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>            <div className="subproducto-fila" style={{ flex: 1, minWidth: '300px' }}>
              <div className="subproducto-nombre-grupo">
                <span className="subproducto-nombre">Tipo de Cuenta</span>
              </div>
              <div className="subproducto-inputs-grupo">
                <div className="input-grupo" style={{ width: '100%' }}>
                  <div className="input-container">
                    <select
                      id="tipoCuenta"
                      name="tipoCuenta"
                      value={newProveedorData.tipoCuenta}
                      onChange={(e) => handleChange(e, false)}
                      className={`formulario-input ${createError && createError.errors?.some(error => error.field === 'tipoCuenta') ? 'input-error' : ''}`}
                      style={{ minWidth: '220px', textAlign: 'left' }}
                      required
                    >
                      <option value="">Seleccione tipo de cuenta</option>
                      <option value="Cuenta corriente">Cuenta corriente</option>
                      <option value="Cuenta vista">Cuenta vista</option>
                      <option value="Cuenta de ahorro">Cuenta de ahorro</option>
                    </select>
                    {createError && createError.errors?.map((error, index) => (
                      error.field === 'tipoCuenta' && (
                        <div key={index} className="error-message">
                          {error.message}
                        </div>
                      )
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '15px', marginBottom: '10px' }}>
              <div className="subproducto-fila" style={{ flex: 1, minWidth: '300px' }}>
                <div className="subproducto-nombre-grupo">
                  <span className="subproducto-nombre">Nombre Encargado</span>
                </div>
                <div className="subproducto-inputs-grupo">
                  <div className="input-grupo" style={{ width: '100%' }}>
                    <div className="input-container">
                      <input
                        type="text"
                        id="nombreEncargado"
                        name="nombreEncargado"
                        value={newProveedorData.nombreEncargado}
                        onChange={(e) => handleChange(e, false)}
                        className={`formulario-input ${createError && createError.errors?.some(error => error.field === 'nombreEncargado') ? 'input-error' : ''}`}
                        style={{ minWidth: '220px', textAlign: 'left' }}
                        required
                      />
                      {createError && createError.errors?.map((error, index) => (
                        error.field === 'nombreEncargado' && (
                          <div key={index} className="error-message">
                            {error.message}
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                </div>
              </div>              <div className="subproducto-fila" style={{ flex: 1, minWidth: '300px' }}>
                <div className="subproducto-nombre-grupo">
                  <span className="subproducto-nombre">Móvil Encargado</span>
                </div>
                <div className="subproducto-inputs-grupo">
                  <div className="input-grupo" style={{ width: '100%' }}>
                    <div className="input-container">
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {newProveedorData.movilEncargado.map((movil, index) => (
                          <div key={index} style={{ position: 'relative', width: '100%' }}>
                            <input
                              type="text"
                              id={`movilEncargado-${index}`}
                              name="movilEncargado"
                              value={movil}
                              onChange={(e) => handleChange(e, false)}                          
                              pattern="^\+?(?:\d{9}|\d{11})$"
                              placeholder="+56 9 XXXX XXXX"
                              title="Ejemplo: +56912345678)"
                              className={`formulario-input ${createError && createError.errors?.some(error => error.field === 'movilEncargado') ? 'input-error' : ''}`}
                              style={{ width: '100%', paddingRight: '5px', textAlign: 'left' }}
                              required={index === 0}
                            />
                            <div style={{ position: 'absolute', right: '-53px', top: '50%', transform: 'translateY(-50%)', display: 'flex', gap: '5px' }}>
                              {index > 0 && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveMovil(index, false)}
                                  className="modal-boton-anadir"
                                  style={{ backgroundColor: '#dc3545', padding: '2px 14px' }}
                            >
                              ×
                            </button>
                          )}
                          {index === newProveedorData.movilEncargado.length - 1 && index === 0 && (
                            <button
                              type="button"
                              onClick={() => handleAddMovil(false)}
                              className="modal-boton-anadir"
                              style={{ padding: '2px 14px' }}
                            >
                              +                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                      {createError && createError.errors?.map((error, index) => (
                        error.field === 'movilEncargado' && (
                          <div key={index} className="error-message">
                            {error.message}
                          </div>
                        )
                      ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </Modal>

      {/* Modal de Edición */}
      <Modal
        isOpen={isEditModalOpen}
        onRequestClose={() => setIsEditModalOpen(false)}
        contentLabel="Editar Proveedor"
        ariaHideApp={false}
        className="modal-crear"
        overlayClassName="modal-overlay"
        closeTimeoutMS={300}
      >
        <form onSubmit={(e) => handleSubmit(e, true)} className="modal-crear-formulario">
          <div className="modal-crear-header">
            <h2 className="modal-crear-titulo">Editar Proveedor</h2>
            <button type="button" onClick={() => setIsEditModalOpen(false)} className="modal-crear-cerrar">×</button>
            <button type="submit" className="modal-boton-crear">Guardar</button>
          </div>

          <div style={{ width: '100%', margin: '0 auto', maxWidth: '800px' }}>            <div className="subproducto-fila" style={{ flex: 1, minWidth: '300px' }}>
              <div className="subproducto-nombre-grupo">
                <span className="subproducto-nombre">Nombre</span>
              </div>
              <div className="subproducto-inputs-grupo">                <div className="input-grupo" style={{ width: '100%' }}>
                  <div className="input-container">
                    <input
                      type="text"
                      id="edit-nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={(e) => handleChange(e, true)}
                      className={`formulario-input ${editError && editError.errors?.some(error => error.field === 'nombre') ? 'input-error' : ''}`}
                      style={{ minWidth: '220px', textAlign: 'left' }}
                      required
                    />
                    {editError && editError.errors?.map((error, index) => (
                      error.field === 'nombre' && (
                        <div key={index} className="error-message">
                          {error.message}
                        </div>
                      )
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="subproducto-fila" style={{ flex: 1, minWidth: '300px' }}>
              <div className="subproducto-nombre-grupo">
                <span className="subproducto-nombre">RUT</span>
              </div>
              <div className="subproducto-inputs-grupo">                <div className="input-grupo" style={{ width: '100%' }}>
                  <div className="input-container">
                    <input
                      type="text"
                      id="edit-rut"
                      name="rut"
                      value={formData.rut}
                      onChange={(e) => handleChange(e, true)}
                      className={`formulario-input ${editError && editError.errors?.some(error => error.field === 'rut') ? 'input-error' : ''}`}
                      style={{ minWidth: '220px', textAlign: 'left' }}
                      required
                      placeholder="Ej: 12.345.678-9"
                    />
                    {editError && editError.errors?.map((error, index) => (
                      error.field === 'rut' && (
                        <div key={index} className="error-message">
                          {error.message}
                        </div>
                      )
                    ))}
                  </div>
                </div>
              </div>
            </div>            <div className="subproducto-fila" style={{ flex: 1, minWidth: '300px' }}>
              <div className="subproducto-nombre-grupo">
                <span className="subproducto-nombre">Dirección</span>
              </div>
              <div className="subproducto-inputs-grupo">
                <div className="input-grupo" style={{ width: '100%' }}>
                  <div className="input-container">
                    <input
                      type="text"
                      id="edit-direccion"
                      name="direccion"
                      value={formData.direccion}
                      onChange={(e) => handleChange(e, true)}
                      className={`formulario-input ${editError && editError.errors?.some(error => error.field === 'direccion') ? 'input-error' : ''}`}
                      style={{ minWidth: '220px', textAlign: 'left' }}
                      required
                    />
                    {editError && editError.errors?.map((error, index) => (
                      error.field === 'direccion' && (
                        <div key={index} className="error-message">
                          {error.message}
                        </div>
                      )
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '15px', marginBottom: '10px' }}>              <div className="subproducto-fila" style={{ flex: 1, minWidth: '300px' }}>
                <div className="subproducto-nombre-grupo">
                  <span className="subproducto-nombre">Banco</span>
                </div>
                <div className="subproducto-inputs-grupo">
                  <div className="input-grupo" style={{ width: '100%' }}>
                    <div className="input-container">
                      <select
                        id="edit-banco"
                        name="banco"
                        value={formData.banco}
                        onChange={(e) => handleChange(e, true)}
                        className={`formulario-input ${editError && editError.errors?.some(error => error.field === 'banco') ? 'input-error' : ''}`}
                        style={{ minWidth: '220px', textAlign: 'left' }}
                        required
                      >
                        <option value="">Seleccione Banco</option>
                        <option value="Banco de Chile">Banco de Chile</option>
                        <option value="Banco Santander">Banco Santander</option>
                        <option value="Banco BCI">Banco BCI</option>
                        <option value="Banco Itaú">Banco Itaú</option>
                        <option value="Scotiabank">Scotiabank</option>
                        <option value="Banco Estado">Banco Estado</option>
                        <option value="Banco BICE">Banco BICE</option>
                        <option value="Banco Security">Banco Security</option>
                        <option value="Banco Falabella">Banco Falabella</option>
                        <option value="Banco Ripley">Banco Ripley</option>
                        <option value="Banco Consorcio">Banco Consorcio</option>
                        <option value="Banco Internacional">Banco Internacional</option>
                        <option value="Banco BTG Pactual">Banco BTG Pactual</option>
                        <option value="HSBC Bank">HSBC Bank</option>
                        <option value="Deutsche Bank">Deutsche Bank</option>
                      </select>
                      {editError && editError.errors?.map((error, index) => (
                        error.field === 'banco' && (
                          <div key={index} className="error-message">
                            {error.message}
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                </div>
              </div>              <div className="subproducto-fila" style={{ flex: 1, minWidth: '300px' }}>
                <div className="subproducto-nombre-grupo">
                  <span className="subproducto-nombre">Número de Cuenta</span>
                </div>
                <div className="subproducto-inputs-grupo">
                  <div className="input-grupo" style={{ width: '100%' }}>
                    <div className="input-container">
                      <input
                        type="text"
                        id="edit-numeroCuenta"
                        name="numeroCuenta"
                        value={formData.numeroCuenta}
                        onChange={(e) => handleChange(e, true)}
                        className={`formulario-input ${editError && editError.errors?.some(error => error.field === 'numeroCuenta') ? 'input-error' : ''}`}
                        style={{ minWidth: '220px', textAlign: 'left' }}
                        required
                      />
                      {editError && editError.errors?.map((error, index) => (
                        error.field === 'numeroCuenta' && (
                          <div key={index} className="error-message">
                            {error.message}
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>            <div className="subproducto-fila" style={{ flex: 1, minWidth: '300px' }}>
              <div className="subproducto-nombre-grupo">
                <span className="subproducto-nombre">Tipo de Cuenta</span>
              </div>
              <div className="subproducto-inputs-grupo">
                <div className="input-grupo" style={{ width: '100%' }}>
                  <div className="input-container">
                    <select
                      id="edit-tipoCuenta"
                      name="tipoCuenta"
                      value={formData.tipoCuenta}
                      onChange={(e) => handleChange(e, true)}
                      className={`formulario-input ${editError && editError.errors?.some(error => error.field === 'tipoCuenta') ? 'input-error' : ''}`}
                      style={{ minWidth: '220px', textAlign: 'left' }}
                      required
                    >
                      <option value="">Seleccione tipo de cuenta</option>
                      <option value="Cuenta corriente">Cuenta corriente</option>
                      <option value="Cuenta vista">Cuenta vista</option>
                      <option value="Cuenta de ahorro">Cuenta de ahorro</option>
                    </select>
                    {editError && editError.errors?.map((error, index) => (
                      error.field === 'tipoCuenta' && (
                        <div key={index} className="error-message">
                          {error.message}
                        </div>
                      )
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '15px', marginBottom: '10px' }}>              <div className="subproducto-fila" style={{ flex: 1, minWidth: '300px' }}>
                <div className="subproducto-nombre-grupo">
                  <span className="subproducto-nombre">Nombre Encargado</span>
                </div>
                <div className="subproducto-inputs-grupo">
                  <div className="input-grupo" style={{ width: '100%' }}>
                    <div className="input-container">
                      <input
                        type="text"
                        id="edit-nombreEncargado"
                        name="nombreEncargado"
                        value={formData.nombreEncargado}
                        onChange={(e) => handleChange(e, true)}
                        className={`formulario-input ${editError && editError.errors?.some(error => error.field === 'nombreEncargado') ? 'input-error' : ''}`}
                        style={{ minWidth: '220px', textAlign: 'left' }}
                        required
                      />
                      {editError && editError.errors?.map((error, index) => (
                        error.field === 'nombreEncargado' && (
                          <div key={index} className="error-message">
                            {error.message}
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="subproducto-fila" style={{ flex: 1, minWidth: '300px' }}>
                <div className="subproducto-nombre-grupo">
                  <span className="subproducto-nombre">Móvil Encargado</span>
                </div>
                <div className="subproducto-inputs-grupo">                  <div className="input-grupo" style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>                    
                    {formData.movilEncargado.map((movil, index) => (
                      <div key={index} style={{ position: 'relative', width: '100%' }}>
                        <input
                          type="text"
                          id={`movilEncargado-${index}`}
                          name="movilEncargado"
                          value={movil}
                          onChange={(e) => handleChange(e, true)}                          
                          pattern="^\+?(?:\d{9}|\d{11})$"
                          placeholder="56912345678"
                          title="Ejemplo: +56912345678)"
                          className={`formulario-input ${editError && editError.errors?.some(error => error.field === 'movilEncargado') ? 'input-error' : ''}`}
                          style={{ width: '100%', paddingRight: '5px', textAlign: 'left' }}
                          required={index === 0}
                        />
                        <div style={{ position: 'absolute', right: '-53px', top: '50%', transform: 'translateY(-50%)', display: 'flex', gap: '5px' }}>
                          {index > 0 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveMovil(index, true)}
                              className="modal-boton-anadir"
                              style={{ backgroundColor: '#dc3545', padding: '2px 14px' }}
                            >
                              ×
                            </button>
                          )}
                          {index === formData.movilEncargado.length - 1 && index === 0 && (
                            <button
                              type="button"
                              onClick={() => handleAddMovil(true)}
                              className="modal-boton-anadir"
                              style={{ padding: '2px 14px' }}
                            >
                              +
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                    {editError && editError.errors?.map((error, index) => (
                      error.field === 'movilEncargado' && (
                        <div key={index} className="error-message">
                          {error.message}
                        </div>
                      )
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
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
        <p>¿Estás seguro de que deseas eliminar este proveedor?</p>
        {proveedorToDelete && (
          <div style={{ margin: '20px 0', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
            <p><strong>Nombre:</strong> {proveedorToDelete.nombre}</p>
            <p><strong>Encargado:</strong> {proveedorToDelete.nombreEncargado}</p>
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

      {/* Modal de Ver Detalles */}
      <Modal
        isOpen={isViewModalOpen}
        onRequestClose={handleViewModalClose}
        contentLabel="Ver Detalles"
        ariaHideApp={false}
        className="modal-detalles"
        overlayClassName="modal-overlay"
        closeTimeoutMS={300}
      >
        <div className="modal-crear-formulario">
          <div className="modal-detalles-header">          
            <h2 className="modal-detalles-titulo">Detalles del Proveedor {proveedorToView?.nombre}</h2>
            <button onClick={handleViewModalClose} className="modal-detalles-cerrar">×</button>
            <button
              onClick={() => {
                handleUpdateClick(proveedorToView);
                handleViewModalClose();
              }}
              className="modal-detalles-editar"
            >
              <MdOutlineEdit size={24} />
            </button>
          </div>
            {proveedorToView && (
            <div className="modal-detalles-contenido">              
            <div className="datos-grid">
                <div className="dato-item">
                  <span className="dato-label">Nombre:</span>
                  <span className="dato-value">{proveedorToView.nombre}</span>
                </div>
                 <div className="dato-item">
                  <span className="dato-label">RUT:</span>
                  <span className="dato-value">{proveedorToView.rut}</span>
                </div>
                <div className="dato-item">
                  <span className="dato-label">Banco:</span>
                  <span className="dato-value">{proveedorToView.banco}</span>
                </div>
                <div className="dato-item">
                  <span className="dato-label">Número de Cuenta:</span>
                  <span className="dato-value">{proveedorToView.numeroCuenta}</span>
                </div>
                <div className="dato-item">
                  <span className="dato-label">Tipo de Cuenta:</span>
                  <span className="dato-value">{proveedorToView.tipoCuenta}</span>
                </div>
                <div className="dato-item">
                  <span className="dato-label">Nombre Encargado:</span>
                  <span className="dato-value">{proveedorToView.nombreEncargado}</span>
                </div>
                <div className="dato-item">
                  <span className="dato-label">Móvil Encargado:</span>
                  <span className="dato-value">
                    {Array.isArray(proveedorToView.movilEncargado) 
                      ? proveedorToView.movilEncargado.join(", ")
                      : proveedorToView.movilEncargado}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Proveedores;
