import React, { useState, useEffect } from "react";
import useGetClientes from "@hooks/clientes/useGetClientes.jsx";
import useCreateCliente from "@hooks/clientes/useCreateCliente.jsx";
import useDeleteCliente from "@hooks/clientes/useDeleteCliente.jsx";
import useEditCliente from "@hooks/clientes/useEditCliente.jsx";
import Table from "../components/Table";
import Modal from "react-modal";
import Swal from "sweetalert2";
import "@styles/formulariotable.css";
import "@styles/selectFix.css";
import styles from "@styles/categoria.module.css";

const Clientes = () => {
  const { clientes, loading, fetchClientes } = useGetClientes();
  const { create } = useCreateCliente(fetchClientes);
  const { remove } = useDeleteCliente(fetchClientes);
  const { edit } = useEditCliente(fetchClientes);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentCliente, setCurrentCliente] = useState(null);
  const [error, setError] = useState(null);
  const [clienteType, setClienteType] = useState("Persona");

  useEffect(() => {
    // Verificar los permisos del usuario
    const userData = JSON.parse(sessionStorage.getItem('usuario')) || {};
    
    if (!userData || !userData.rol) {
      setError("No hay información de usuario. Por favor inicia sesión nuevamente.");
      return;
    }
    
    if (userData.rol !== 'administrador') {
      setError("No tienes permisos para gestionar clientes. Se requiere rol de administrador.");
      return;
    }
    
    // Solo si el usuario es administrador, procedemos a cargar los clientes
    fetchClientes()
      .then(() => console.log("Clientes cargados exitosamente"))
      .catch(err => console.error("Error al cargar los clientes:", err));
  }, []);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleDeleteModalOpen = (cliente) => {
    setCurrentCliente(cliente);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
    setCurrentCliente(null);
  };

  const confirmDelete = async () => {
    if (!currentCliente) return;

    try {
      await remove(currentCliente.id);
      handleDeleteModalClose();

      // Mostrar alerta de éxito después de eliminar
      Swal.fire({
        title: "¡Eliminado!",
        text: "El cliente ha sido eliminado exitosamente",
        icon: "success",
        confirmButtonColor: "#000000"
      });
    } catch (error) {
      console.error("Error al eliminar cliente:", error);
      // Mostrar alerta de error
      Swal.fire({
        title: "Error",
        text: "No se pudo eliminar el cliente",
        icon: "error",
        confirmButtonColor: "#000000"
      });
    }
  };

  const handleCreateCliente = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const tipoCliente = formData.get("tipoCliente");
    const rut = formData.get("rut");
    
    // Validar el formato del RUT (formato chileno XX.XXX.XXX-X o sin puntos)
    const rutRegex = /^(\d{1,2}(?:\.\d{3}){2}-[\dkK]|\d{7,8}-[\dkK])$/;
    if (!rutRegex.test(rut)) {
      Swal.fire({
        title: 'Error de validación',
        text: 'El RUT debe tener un formato válido (Ej: 12.345.678-9 o 12345678-9)',
        icon: 'error',
        confirmButtonColor: '#000000',
      });
      return;
    }
    
    // Construir objeto de cliente según el tipo
    const newCliente = {
      tipoCliente: tipoCliente,
      rut: rut,
      email: formData.get("email"),
      telefono: formData.get("telefono"),
      direccion: formData.get("direccion"),
      comuna: formData.get("comuna"),
      ciudad: formData.get("ciudad"),
      region: formData.get("region")
    };
    
    // Agregar campos específicos según el tipo
    if (tipoCliente === "Empresa") {
      newCliente.razonSocial = formData.get("razonSocial");
      newCliente.giro = formData.get("giro");
    } else if (tipoCliente === "Persona") {
      newCliente.nombres = formData.get("nombres");
      newCliente.apellidos = formData.get("apellidos");
    }

    try {
      // Mostrar indicador de carga
      Swal.fire({
        title: 'Creando cliente...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
      
      await create(newCliente);
      closeModal();
      
      // Cerrar indicador de carga y mostrar éxito
      Swal.fire({
        title: '¡Cliente creado!',
        text: 'El cliente ha sido registrado exitosamente',
        icon: 'success',
        confirmButtonColor: '#000000',
      });
    } catch (error) {
      console.error("Error al crear el cliente:", error);
      
      // Mensaje de error más específico según la respuesta
      let errorMessage = 'No se pudo crear el cliente';
      
      if (error.response) {
        if (error.response.status === 400) {
          errorMessage = 'Datos incorrectos o incompletos. Verifica la información ingresada.';
        } else if (error.response.status === 409) {
          errorMessage = 'Ya existe un cliente con este RUT.';
        } else if (error.response.status === 500) {
          errorMessage = 'Error en el servidor. Intenta más tarde.';
        }
      }
      
      // Mostrar alerta de error
      Swal.fire({
        title: 'Error',
        text: errorMessage,
        icon: 'error',
        confirmButtonColor: '#000000',
      });
    }
  };

  const handleEditCliente = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const tipoCliente = formData.get("tipoCliente");
    const rut = formData.get("rut");
    
    // Validar el formato del RUT (formato chileno XX.XXX.XXX-X o sin puntos)
    const rutRegex = /^(\d{1,2}(?:\.\d{3}){2}-[\dkK]|\d{7,8}-[\dkK])$/;
    if (!rutRegex.test(rut)) {
      Swal.fire({
        title: 'Error de validación',
        text: 'El RUT debe tener un formato válido (Ej: 12.345.678-9 o 12345678-9)',
        icon: 'error',
        confirmButtonColor: '#000000',
      });
      return;
    }
    
    // Construir objeto de cliente según el tipo
    const updatedCliente = {
      tipoCliente: tipoCliente,
      rut: rut,
      email: formData.get("email"),
      telefono: formData.get("telefono"),
      direccion: formData.get("direccion"),
      comuna: formData.get("comuna"),
      ciudad: formData.get("ciudad"),
      region: formData.get("region")
    };
    
    // Agregar campos específicos según el tipo
    if (tipoCliente === "Empresa") {
      updatedCliente.razonSocial = formData.get("razonSocial");
      updatedCliente.giro = formData.get("giro");
    } else if (tipoCliente === "Persona") {
      updatedCliente.nombres = formData.get("nombres");
      updatedCliente.apellidos = formData.get("apellidos");
    }

    try {
      await edit(currentCliente.id, updatedCliente);
      setIsEditModalOpen(false);
      setCurrentCliente(null);
      
      // Mostrar alerta de éxito
      Swal.fire({
        title: '¡Actualizado!',
        text: 'El cliente ha sido actualizado exitosamente',
        icon: 'success',
        confirmButtonColor: '#000000',
      });
    } catch (error) {
      console.error("Error al actualizar el cliente:", error);
      
      // Mostrar alerta de error
      Swal.fire({
        title: 'Error',
        text: 'No se pudo actualizar el cliente',
        icon: 'error',
        confirmButtonColor: '#000000',
      });
    }
  };

  const handleTipoClienteChange = (event) => {
    setClienteType(event.target.value);
  };

  if (loading) return <p>Cargando datos...</p>;
  const columns = [
    { header: "ID", key: "id" },
    { header: "Tipo Cliente", key: "tipoCliente" },
    { header: "RUT", key: "rut" },
    { header: "Nombre/Razón Social", key: "nombreCompleto" }, // Usamos una clave personalizada para el nombre
    { header: "Dirección", key: "direccion" },
    { header: "Comuna", key: "comuna" },
    { header: "Ciudad", key: "ciudad" },
    { header: "Teléfono", key: "telefono" },
    { header: "Email", key: "email" }
  ];
  
  // Función para formatear los datos de forma personalizada
  const customFormat = (value, key) => {
    // Para formatear el nombre/razón social según el tipo de cliente
    if (key === "nombreCompleto") {
      // El valor aquí será el cliente completo
      const cliente = clientes.find(c => c.id === value);
      if (cliente) {
        if (cliente.tipoCliente === "Empresa") {
          return cliente.razonSocial || "No disponible";
        } else {
          return `${cliente.nombres || ''} ${cliente.apellidos || ''}`.trim() || "No disponible";
        }
      }
      return "No disponible";
    }
    
    if (key === "tipoCliente") {
      return (
        <span style={{
          backgroundColor: value === 'Empresa' ? '#d4edda' : '#fff3cd',
          padding: '3px 8px',
          borderRadius: '4px',
          color: value === 'Empresa' ? '#155724' : '#856404',
        }}>
          {value}
        </span>
      );
    }
    return value || "No disponible";
  };
  return (
    <div className={styles["categoria-container"]}>
      {error ? (
        <div className={styles.errorBox || {
          border: '1px solid #ff8080', 
          backgroundColor: '#fff0f0', 
          padding: '15px',
          borderRadius: '5px',
          margin: '15px 0',
          color: '#d32f2f'
        }}>
          <h3>{error.includes("permisos") ? "Error de permisos" : 
               error.includes("sesión") ? "Sesión expirada" : 
               "Error al cargar datos"}</h3>
          <p>{error}</p>
          {error.includes("permisos") && (
            <p>Por favor contacta al administrador para obtener los permisos necesarios.
              <br />Tu rol actual no tiene los privilegios requeridos para esta sección.</p>
          )}
          {error.includes("sesión") && (
            <>
              <p>Por favor inicia sesión nuevamente para continuar.</p>
              <button 
                onClick={() => window.location.href = "/auth"}
                style={{
                  backgroundColor: '#000',
                  color: '#fff',
                  padding: '8px 16px',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  marginTop: '10px'
                }}
              >
                Ir a iniciar sesión
              </button>
            </>
          )}
        </div>
      ) : (        <>
          <Table 
            data={clientes.map(cliente => ({
              ...cliente,
              // Añadimos el campo nombreCompleto con el ID para que el customFormat lo procese
              nombreCompleto: cliente.id
            }))}
            columns={columns}
            headerTitle="Clientes"
            onCreate={openModal}
            onEdit={(cliente) => {
              setCurrentCliente(cliente);
              setIsEditModalOpen(true);
              // Establecer el tipo de cliente para controlar la visibilidad de los campos
              setClienteType(cliente.tipoCliente);
            }}
            onDelete={handleDeleteModalOpen}
            showEditAllButton={false}
            showViewButton={false}
            entidad="clientes"
            customFormat={customFormat}
          />

          {/* Modal de Creación */}
          <Modal
            isOpen={isModalOpen}
            onRequestClose={closeModal}
            contentLabel="Crear Cliente"
            ariaHideApp={false}
            className="formulario-table-modal-form"
            overlayClassName="formulario-table-overlay"
          >
            <h2 className="formulario-table-modal-title">Crear Nuevo Cliente</h2>
            <form onSubmit={handleCreateCliente} className="formulario-table-formulario-table">
              <div className="formulario-table-field-group">
                <label htmlFor="tipoCliente">Tipo de Cliente:</label>
                <select 
                  id="tipoCliente"
                  name="tipoCliente"
                  required
                  className="formulario-table-input"
                  onChange={handleTipoClienteChange}
                  value={clienteType}
                >
                  <option value="Persona">Persona</option>
                  <option value="Empresa">Empresa</option>
                </select>
              </div>

              <div className="formulario-table-field-group">
                <label htmlFor="rut">RUT:</label>
                <input
                  type="text"
                  id="rut"
                  name="rut"
                  placeholder="12.345.678-9"
                  required
                  className="formulario-table-input"
                />
              </div>

              {clienteType === "Persona" && (
                <>
                  <div className="formulario-table-field-group">
                    <label htmlFor="nombres">Nombres:</label>
                    <input
                      type="text"
                      id="nombres"
                      name="nombres"
                      required
                      className="formulario-table-input"
                    />
                  </div>
                  <div className="formulario-table-field-group">
                    <label htmlFor="apellidos">Apellidos:</label>
                    <input
                      type="text"
                      id="apellidos"
                      name="apellidos"
                      required
                      className="formulario-table-input"
                    />
                  </div>
                </>
              )}

              {clienteType === "Empresa" && (
                <>
                  <div className="formulario-table-field-group">
                    <label htmlFor="razonSocial">Razón Social:</label>
                    <input
                      type="text"
                      id="razonSocial"
                      name="razonSocial"
                      required
                      className="formulario-table-input"
                    />
                  </div>
                  <div className="formulario-table-field-group">
                    <label htmlFor="giro">Giro:</label>
                    <input
                      type="text"
                      id="giro"
                      name="giro"
                      required
                      className="formulario-table-input"
                    />
                  </div>
                </>
              )}

              <div className="formulario-table-field-group">
                <label htmlFor="direccion">Dirección:</label>
                <input
                  type="text"
                  id="direccion"
                  name="direccion"
                  required
                  className="formulario-table-input"
                />
              </div>

              <div className="formulario-table-field-group">
                <label htmlFor="comuna">Comuna:</label>
                <input
                  type="text"
                  id="comuna"
                  name="comuna"
                  required
                  className="formulario-table-input"
                />
              </div>

              <div className="formulario-table-field-group">
                <label htmlFor="ciudad">Ciudad:</label>
                <input
                  type="text"
                  id="ciudad"
                  name="ciudad"
                  required
                  className="formulario-table-input"
                />
              </div>

              <div className="formulario-table-field-group">
                <label htmlFor="region">Región:</label>
                <input
                  type="text"
                  id="region"
                  name="region"
                  required
                  className="formulario-table-input"
                />
              </div>

              <div className="formulario-table-field-group">
                <label htmlFor="telefono">Teléfono:</label>
                <input
                  type="text"
                  id="telefono"
                  name="telefono"
                  className="formulario-table-input"
                />
              </div>

              <div className="formulario-table-field-group">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="formulario-table-input"
                />
              </div>

              <div className="formulario-table-form-actions">
                <button type="submit" className="formulario-table-btn-confirm">
                  Crear
                </button>
                <button type="button" onClick={closeModal} className="formulario-table-btn-cancel">
                  Cancelar
                </button>
              </div>
            </form>
          </Modal>

          {/* Modal de Edición */}
          <Modal
            isOpen={isEditModalOpen}
            onRequestClose={() => setIsEditModalOpen(false)}
            contentLabel="Editar Cliente"
            ariaHideApp={false}
            className="formulario-table-modal-form"
            overlayClassName="formulario-table-overlay"
          >
            <h2 className="formulario-table-modal-title">Editar Cliente</h2>
            {currentCliente && (
              <form onSubmit={handleEditCliente} className="formulario-table-formulario-table">
                <div className="formulario-table-field-group">
                  <label htmlFor="tipoCliente">Tipo de Cliente:</label>
                  <select 
                    id="tipoCliente"
                    name="tipoCliente"
                    defaultValue={currentCliente.tipoCliente}
                    required
                    className="formulario-table-input"
                    onChange={handleTipoClienteChange}
                  >
                    <option value="Persona">Persona</option>
                    <option value="Empresa">Empresa</option>
                  </select>
                </div>

                <div className="formulario-table-field-group">
                  <label htmlFor="rut">RUT:</label>
                  <input
                    type="text"
                    id="rut"
                    name="rut"
                    defaultValue={currentCliente.rut}
                    required
                    className="formulario-table-input"
                  />
                </div>

                {clienteType === "Persona" && (
                  <>
                    <div className="formulario-table-field-group">
                      <label htmlFor="nombres">Nombres:</label>
                      <input
                        type="text"
                        id="nombres"
                        name="nombres"
                        defaultValue={currentCliente.nombres}
                        required
                        className="formulario-table-input"
                      />
                    </div>
                    <div className="formulario-table-field-group">
                      <label htmlFor="apellidos">Apellidos:</label>
                      <input
                        type="text"
                        id="apellidos"
                        name="apellidos"
                        defaultValue={currentCliente.apellidos}
                        required
                        className="formulario-table-input"
                      />
                    </div>
                  </>
                )}

                {clienteType === "Empresa" && (
                  <>
                    <div className="formulario-table-field-group">
                      <label htmlFor="razonSocial">Razón Social:</label>
                      <input
                        type="text"
                        id="razonSocial"
                        name="razonSocial"
                        defaultValue={currentCliente.razonSocial}
                        required
                        className="formulario-table-input"
                      />
                    </div>
                    <div className="formulario-table-field-group">
                      <label htmlFor="giro">Giro:</label>
                      <input
                        type="text"
                        id="giro"
                        name="giro"
                        defaultValue={currentCliente.giro}
                        required
                        className="formulario-table-input"
                      />
                    </div>
                  </>
                )}

                <div className="formulario-table-field-group">
                  <label htmlFor="direccion">Dirección:</label>
                  <input
                    type="text"
                    id="direccion"
                    name="direccion"
                    defaultValue={currentCliente.direccion}
                    required
                    className="formulario-table-input"
                  />
                </div>

                <div className="formulario-table-field-group">
                  <label htmlFor="comuna">Comuna:</label>
                  <input
                    type="text"
                    id="comuna"
                    name="comuna"
                    defaultValue={currentCliente.comuna}
                    required
                    className="formulario-table-input"
                  />
                </div>

                <div className="formulario-table-field-group">
                  <label htmlFor="ciudad">Ciudad:</label>
                  <input
                    type="text"
                    id="ciudad"
                    name="ciudad"
                    defaultValue={currentCliente.ciudad}
                    required
                    className="formulario-table-input"
                  />
                </div>

                <div className="formulario-table-field-group">
                  <label htmlFor="region">Región:</label>
                  <input
                    type="text"
                    id="region"
                    name="region"
                    defaultValue={currentCliente.region}
                    required
                    className="formulario-table-input"
                  />
                </div>

                <div className="formulario-table-field-group">
                  <label htmlFor="telefono">Teléfono:</label>
                  <input
                    type="text"
                    id="telefono"
                    name="telefono"
                    defaultValue={currentCliente.telefono}
                    className="formulario-table-input"
                  />
                </div>

                <div className="formulario-table-field-group">
                  <label htmlFor="email">Email:</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    defaultValue={currentCliente.email}
                    className="formulario-table-input"
                  />
                </div>

                <div className="formulario-table-form-actions">
                  <button type="submit" className="formulario-table-btn-confirm">
                    Guardar
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setIsEditModalOpen(false)} 
                    className="formulario-table-btn-cancel"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            )}
          </Modal>

          {/* Modal de Confirmación de Eliminación */}
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
            <p>¿Estás seguro de que deseas eliminar este cliente?</p>
            {currentCliente && (
              <div style={{ margin: '20px 0', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
                <p><strong>Cliente:</strong> {currentCliente.tipoCliente === "Empresa" 
                  ? currentCliente.razonSocial 
                  : `${currentCliente.nombres} ${currentCliente.apellidos}`}</p>
                <p><strong>RUT:</strong> {currentCliente.rut}</p>
              </div>
            )}
            <div className="formulario-table-form-actions">
              <button onClick={confirmDelete} className="formulario-table-btn-confirm" style={{ backgroundColor: '#dc3545' }}>
                Eliminar
              </button>
              <button onClick={handleDeleteModalClose} className="formulario-table-btn-cancel">
                Cancelar
              </button>
            </div>
          </Modal>
        </>
      )}
    </div>
  );
};

export default Clientes;
