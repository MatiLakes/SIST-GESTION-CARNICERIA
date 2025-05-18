import React, { useState, useEffect } from "react";
import useGetPagosPendientes from "@hooks/pagosPendientes/useGetPagosPendientes.jsx";
import useCreatePagoPendiente from "@hooks/pagosPendientes/useCreatePagoPendiente.jsx";
import useDeletePagoPendiente from "@hooks/pagosPendientes/useDeletePagoPendiente.jsx";
import useEditPagoPendiente from "@hooks/pagosPendientes/useEditPagoPendiente.jsx";
import useGetClientes from "@hooks/clientes/useGetClientes.jsx";
import useCreateCliente from "@hooks/clientes/useCreateCliente.jsx";
import Table from "../components/Table";
import Modal from "react-modal";
import Swal from "sweetalert2";
import stylesPagoPendiente from "@styles/pagoPendiente.module.css";
import "@styles/formulariotable.css";
import "@styles/selectFix.css";
import styles from "@styles/categoria.module.css";

const PagosPendientes = () => {  const { pagosPendientes, loading, fetchPagosPendientes } = useGetPagosPendientes();
  const { create } = useCreatePagoPendiente(fetchPagosPendientes);
  const { remove } = useDeletePagoPendiente(fetchPagosPendientes);
  const { edit } = useEditPagoPendiente(fetchPagosPendientes);
  const { clientes, loading: loadingClientes, fetchClientes } = useGetClientes();
  const { create: createCliente } = useCreateCliente(fetchClientes);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isClienteModalOpen, setIsClienteModalOpen] = useState(false);
  const [currentPagoPendiente, setCurrentPagoPendiente] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Verificar los permisos del usuario
    const userData = JSON.parse(sessionStorage.getItem('usuario')) || {};
    
    if (!userData || !userData.rol) {
      setError("No hay información de usuario. Por favor inicia sesión nuevamente.");
      return;
    }
    
    if (userData.rol !== 'administrador') {
      setError("No tienes permisos para ver los pagos pendientes. Se requiere rol de administrador.");
      return;
    }
    
    // Solo si el usuario es administrador, procedemos a cargar los pagos pendientes
    fetchPagosPendientes();
    
    // Cargar los clientes
    fetchClientes()
      .then(() => console.log("Clientes cargados exitosamente"))
      .catch(err => console.error("Error al cargar los clientes:", err));
  }, []); // Eliminamos la dependencia para evitar el bucle infinito
  
  // Efecto adicional para verificar que los clientes estén cargados
  useEffect(() => {
    console.log("Estado actual de clientes:", clientes);
  }, [clientes]);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Función para abrir el modal de cliente con reseteo de campos
  const openClienteModal = () => {
    setIsClienteModalOpen(true);
    
    // Dar tiempo para que el modal se monte en el DOM
    setTimeout(() => {
      // Resetear el formulario y establecer valor por defecto
      const form = document.querySelector('#clienteForm');
      if (form) {
        form.reset();
        
        // Establecer "Persona" como tipo por defecto
        const tipoSelect = form.querySelector('#tipoCliente');
        if (tipoSelect) {
          tipoSelect.value = "Persona";
          
          // Mostrar/ocultar campos según tipo por defecto
          form.querySelector('#razonSocial').parentNode.style.display = 'none';
          form.querySelector('#giro').parentNode.style.display = 'none';
          form.querySelector('#nombres').parentNode.style.display = 'block';
          form.querySelector('#apellidos').parentNode.style.display = 'block';
        }
      }
    }, 100);
  };

  const handleDeleteModalOpen = (pagoPendiente) => {
    setCurrentPagoPendiente(pagoPendiente);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
    setCurrentPagoPendiente(null);
  };

  const confirmDelete = async () => {
    if (!currentPagoPendiente) return;

    try {
      await remove(currentPagoPendiente.id);
      handleDeleteModalClose();

      // Mostrar alerta de éxito después de eliminar
      Swal.fire({
        title: "¡Eliminado!",
        text: "El pago pendiente ha sido eliminado exitosamente",
        icon: "success",
        confirmButtonColor: "#000000"
      });
    } catch (error) {
      console.error("Error al eliminar pago pendiente:", error);
      // Mostrar alerta de error
      Swal.fire({
        title: "Error",
        text: "No se pudo eliminar el pago pendiente",
        icon: "error",
        confirmButtonColor: "#000000"
      });
    }
  };

  const handleCreatePagoPendiente = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const newPagoPendiente = {
      monto: formData.get("monto"),
      fechaPedido: formData.get("fechaPedido"),
      fechaLimite: formData.get("fechaLimite"),
      estado: formData.get("estado"),
      id_cliente: formData.get("id_cliente"),
    };

    try {
      await create(newPagoPendiente);
      closeModal();
      // Mostrar alerta de éxito
      Swal.fire({
        title: '¡Éxito!',
        text: 'El pago pendiente ha sido creado exitosamente',
        icon: 'success',
        confirmButtonColor: '#000000',
      });
    } catch (error) {
      console.error("Error al crear el pago pendiente:", error);
      // Mostrar alerta de error
      Swal.fire({
        title: 'Error',
        text: 'No se pudo crear el pago pendiente',
        icon: 'error',
        confirmButtonColor: '#000000',
      });
    }
  };

  const handleEditPagoPendiente = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const updatedPagoPendiente = {
      monto: formData.get("monto"),
      fechaPedido: formData.get("fechaPedido"),
      fechaLimite: formData.get("fechaLimite"),
      estado: formData.get("estado"),
      id_cliente: formData.get("id_cliente"),
    };

    try {
      await edit(currentPagoPendiente.id, updatedPagoPendiente);
      setIsEditModalOpen(false);
      setCurrentPagoPendiente(null);
      
      // Mostrar alerta de éxito
      Swal.fire({
        title: '¡Actualizado!',
        text: 'El pago pendiente ha sido actualizado exitosamente',
        icon: 'success',
        confirmButtonColor: '#000000',
      });
    } catch (error) {
      console.error("Error al actualizar el pago pendiente:", error);
      // Mostrar alerta de error
      Swal.fire({
        title: 'Error',
        text: 'No se pudo actualizar el pago pendiente',
        icon: 'error',
        confirmButtonColor: '#000000',
      });
    }
  };  const handleCreateCliente = async (event) => {
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
    }    try {
      // Mostrar indicador de carga
      Swal.fire({
        title: 'Creando cliente...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
      
      const response = await createCliente(newCliente);
      setIsClienteModalOpen(false);
      
      // Actualizar la lista de clientes después de crear uno nuevo
      await fetchClientes();
      
      // Cerrar indicador de carga y mostrar éxito
      Swal.fire({
        title: '¡Cliente creado!',
        text: 'El cliente ha sido registrado exitosamente',
        icon: 'success',
        confirmButtonColor: '#000000',
      });
      
      // Seleccionar automáticamente el cliente recién creado si estamos en el modal de pagos pendientes
      if (document.getElementById('id_cliente')) {
        const selectElement = document.getElementById('id_cliente');
        if (response && response.id) {
          selectElement.value = response.id;
        }
      }
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

  if (loading || loadingClientes) return <p>Cargando datos...</p>;

  const columns = [
    { header: "ID", key: "id" },
    { header: "Monto", key: "monto" },
    { header: "Fecha Pedido", key: "fechaPedido" },
    { header: "Fecha Límite", key: "fechaLimite" },
    { header: "Estado", key: "estado" },
    { header: "Cliente", key: "cliente" }
  ];
  // Función para formatear los datos de forma personalizada
  const customFormat = (value, key) => {
    // Solo aplica el formato de moneda si la key es "monto"
    if (key === "monto" && (typeof value === "number" || !isNaN(parseFloat(value)))) {
      return `$${parseFloat(value).toFixed(2)}`;
    } else if (typeof value === "object" && value !== null && value.nombres) {
      return `${value.nombres} ${value.apellidos}`;
    } else if (typeof value === "string" && value.match(/^\d{4}-\d{2}-\d{2}/)) {
      return new Date(value).toLocaleDateString('es-ES');
    } else if (value === "Pendiente" || value === "Pagado" || value === "Vencido") {
      return (
        <span style={{
          backgroundColor: value === 'Pendiente' ? '#fff3cd' : 
                         value === 'Pagado' ? '#d4edda' : 
                         value === 'Vencido' ? '#f8d7da' : '#e2e3e5',
          padding: '3px 8px',
          borderRadius: '4px',
          color: value === 'Pendiente' ? '#856404' : 
                 value === 'Pagado' ? '#155724' : 
                 value === 'Vencido' ? '#721c24' : '#383d41',
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
      ) : (
        <>          <Table 
            data={pagosPendientes}
            columns={columns}
            headerTitle="Pagos Pendientes"
            onCreate={openModal}
            onEdit={(pagoPendiente) => {
              setCurrentPagoPendiente(pagoPendiente);
              setIsEditModalOpen(true);
            }}
            onDelete={handleDeleteModalOpen}
            showEditAllButton={false}
            showViewButton={false}
            entidad="pagosPendientes"
            customFormat={customFormat}
          />

          {/* Modal de Creación */}
          <Modal
            isOpen={isModalOpen}
            onRequestClose={closeModal}
            contentLabel="Crear Pago Pendiente"
            ariaHideApp={false}
            className="formulario-table-modal-form"
            overlayClassName="formulario-table-overlay"
          >
            <h2 className="formulario-table-modal-title">Crear Nuevo Pago Pendiente</h2>
            <form onSubmit={handleCreatePagoPendiente} className="formulario-table-formulario-table">
              <div className="formulario-table-field-group">
                <label htmlFor="monto">Monto:</label>
                <input
                  type="number"
                  step="0.01"
                  id="monto"
                  name="monto"
                  required
                  className="formulario-table-input"
                />
              </div>
              <div className="formulario-table-field-group">
                <label htmlFor="fechaPedido">Fecha Pedido:</label>
                <input
                  type="date"
                  id="fechaPedido"
                  name="fechaPedido"
                  required
                  className="formulario-table-input"
                />
              </div>
              <div className="formulario-table-field-group">
                <label htmlFor="fechaLimite">Fecha Límite:</label>
                <input
                  type="date"
                  id="fechaLimite"
                  name="fechaLimite"
                  required
                  className="formulario-table-input"
                />
              </div>
              <div className="formulario-table-field-group">
                <label htmlFor="estado">Estado:</label>
                <select 
                  id="estado"
                  name="estado"
                  required
                  className="formulario-table-input"
                >
                  <option value="Pendiente">Pendiente</option>
                  <option value="Pagado">Pagado</option>
                  <option value="Vencido">Vencido</option>
                </select>
              </div>              <div className="formulario-table-field-group">
                <label htmlFor="id_cliente">Cliente:</label>
                <div style={{ display: 'flex', gap: '10px', width: '100%', alignItems: 'center' }}>                  <select
                    id="id_cliente"
                    name="id_cliente"
                    required
                    className="formulario-table-input"
                    style={{ 
                      flex: 3, 
                      height: '38px', 
                      fontSize: '15px',
                      paddingRight: '25px',
                      textOverflow: 'ellipsis',
                      width: '100%',
                      minWidth: '220px'
                    }}
                  >
                    <option value="">Seleccione un cliente</option>
                    {clientes && clientes.length > 0 ? (
                      clientes.map((cliente) => (
                        <option key={cliente.id} value={cliente.id}>
                          {cliente.tipoCliente === "Empresa" 
                            ? `${cliente.razonSocial || ''} - ${cliente.rut}` 
                            : `${cliente.nombres || ''} ${cliente.apellidos || ''} - ${cliente.rut}`}
                        </option>
                      ))
                    ) : (
                      <option disabled>No hay clientes disponibles</option>
                    )}                  </select>
                  <button
                    type="button"
                    onClick={openClienteModal}
                    className="formulario-table-btn-confirm"
                    style={{ 
                      whiteSpace: 'nowrap',
                      padding: '6px 10px',
                      fontSize: '12px',
                      flex: 1,
                      height: '38px'
                    }}
                  >
                    Nuevo Cliente
                  </button>
                </div>
              </div>
              <div className="formulario-table-field-group">
                <label htmlFor="factura">Factura (PDF/Imagen):</label>
                <input
                  type="file"
                  id="factura"
                  name="factura"
                  accept=".pdf,.png,.jpg"
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
            contentLabel="Editar Pago Pendiente"
            ariaHideApp={false}
            className="formulario-table-modal-form"
            overlayClassName="formulario-table-overlay"
          >
            <h2 className="formulario-table-modal-title">Editar Pago Pendiente</h2>
            {currentPagoPendiente && (
              <form onSubmit={handleEditPagoPendiente} className="formulario-table-formulario-table">
                <div className="formulario-table-field-group">
                  <label htmlFor="monto">Monto:</label>
                  <input
                    type="number"
                    step="0.01"
                    id="monto"
                    name="monto"
                    defaultValue={currentPagoPendiente.monto}
                    required
                    className="formulario-table-input"
                  />
                </div>
                <div className="formulario-table-field-group">
                  <label htmlFor="fechaPedido">Fecha Pedido:</label>
                  <input
                    type="date"
                    id="fechaPedido"
                    name="fechaPedido"
                    defaultValue={currentPagoPendiente.fechaPedido}
                    required
                    className="formulario-table-input"
                  />
                </div>
                <div className="formulario-table-field-group">
                  <label htmlFor="fechaLimite">Fecha Límite:</label>
                  <input
                    type="date"
                    id="fechaLimite"
                    name="fechaLimite"
                    defaultValue={currentPagoPendiente.fechaLimite}
                    required
                    className="formulario-table-input"
                  />
                </div>
                <div className="formulario-table-field-group">
                  <label htmlFor="estado">Estado:</label>
                  <select 
                    id="estado"
                    name="estado"
                    defaultValue={currentPagoPendiente.estado}
                    required
                    className="formulario-table-input"
                  >
                    <option value="Pendiente">Pendiente</option>
                    <option value="Pagado">Pagado</option>
                    <option value="Vencido">Vencido</option>
                  </select>
                </div>                <div className="formulario-table-field-group">
                  <label htmlFor="id_cliente">Cliente:</label>
                  <div style={{ display: 'flex', gap: '10px', width: '100%', alignItems: 'center' }}>                    <select
                      id="id_cliente"
                      name="id_cliente"
                      defaultValue={currentPagoPendiente.id_cliente}
                      required
                      className="formulario-table-input"
                      style={{ 
                        flex: 3, 
                        height: '38px', 
                        fontSize: '15px',
                        paddingRight: '25px',
                        textOverflow: 'ellipsis',
                        width: '100%',
                        minWidth: '220px'
                      }}
                    >
                      <option value="">Seleccione un cliente</option>
                      {clientes && clientes.length > 0 ? (
                        clientes.map((cliente) => (
                          <option key={cliente.id} value={cliente.id}>
                            {cliente.tipoCliente === "Empresa" 
                              ? `${cliente.razonSocial || ''} - ${cliente.rut}` 
                              : `${cliente.nombres || ''} ${cliente.apellidos || ''} - ${cliente.rut}`}
                          </option>
                        ))
                      ) : (
                        <option disabled>No hay clientes disponibles</option>
                      )}                    </select>                    <button
                      type="button"
                      onClick={openClienteModal}
                      className="formulario-table-btn-confirm"
                      style={{ 
                        whiteSpace: 'nowrap',
                        padding: '6px 10px',
                        fontSize: '12px',
                        flex: 1,
                        height: '38px'
                      }}
                    >
                      Nuevo Cliente
                    </button>
                  </div>
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

          {/* Modal de Eliminación */}
          <Modal
            isOpen={isDeleteModalOpen}
            onRequestClose={handleDeleteModalClose}
            contentLabel="Eliminar Pago Pendiente"
            ariaHideApp={false}
            className="formulario-table-modal-form"
            overlayClassName="formulario-table-overlay"
          >
            <h2 className="formulario-table-modal-title">¿Estás seguro que deseas eliminar este pago pendiente?</h2>
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

          {/* Modal para Crear Cliente */}
          <Modal
            isOpen={isClienteModalOpen}
            onRequestClose={() => setIsClienteModalOpen(false)}
            contentLabel="Crear Cliente"
            ariaHideApp={false}
            className="formulario-table-modal-form"
            overlayClassName="formulario-table-overlay"
          >            <h2 className="formulario-table-modal-title">Crear Nuevo Cliente</h2>
            <form onSubmit={handleCreateCliente} className="formulario-table-formulario-table" id="clienteForm">
              <div className="formulario-table-field-group">
                <label htmlFor="tipoCliente">Tipo de Cliente:</label>
                <select
                  id="tipoCliente"
                  name="tipoCliente"
                  required
                  className="formulario-table-input"
                  onChange={(e) => {
                    const form = e.target.form;
                    const isEmpresa = e.target.value === "Empresa";
                    
                    // Mostrar/ocultar campos según tipo
                    if (form) {
                      // Campos de empresa
                      form.querySelector('#razonSocial').parentNode.style.display = isEmpresa ? 'block' : 'none';
                      form.querySelector('#giro').parentNode.style.display = isEmpresa ? 'block' : 'none';
                      
                      // Campos de persona
                      form.querySelector('#nombres').parentNode.style.display = isEmpresa ? 'none' : 'block';
                      form.querySelector('#apellidos').parentNode.style.display = isEmpresa ? 'none' : 'block';
                    }
                  }}
                >
                  <option value="">Seleccione tipo</option>
                  <option value="Persona">Persona</option>
                  <option value="Empresa">Empresa</option>
                </select>
              </div>              <div className="formulario-table-field-group">
                <label htmlFor="rut">RUT:</label>
                <input
                  type="text"
                  id="rut"
                  name="rut"
                  required
                  className="formulario-table-input"
                  placeholder="Ej: 12345678-9"
                  pattern="(\d{1,2}(\.\d{3}){2}-[\dkK]|\d{7,8}-[\dkK])"
                  title="Formato válido: 12.345.678-9 o 12345678-9"
                />
              </div>
              
              {/* Campos para Empresa */}
              <div className="formulario-table-field-group" style={{ display: 'none' }}>
                <label htmlFor="razonSocial">Razón Social:</label>
                <input
                  type="text"
                  id="razonSocial"
                  name="razonSocial"
                  className="formulario-table-input"
                />
              </div>
              <div className="formulario-table-field-group" style={{ display: 'none' }}>
                <label htmlFor="giro">Giro:</label>
                <input
                  type="text"
                  id="giro"
                  name="giro"
                  className="formulario-table-input"
                />
              </div>
              
              {/* Campos para Persona */}
              <div className="formulario-table-field-group">
                <label htmlFor="nombres">Nombres:</label>
                <input
                  type="text"
                  id="nombres"
                  name="nombres"
                  className="formulario-table-input"
                />
              </div>
              <div className="formulario-table-field-group">
                <label htmlFor="apellidos">Apellidos:</label>
                <input
                  type="text"
                  id="apellidos"
                  name="apellidos"
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
              <div className="formulario-table-field-group">
                <label htmlFor="telefono">Teléfono:</label>
                <input
                  type="text"
                  id="telefono"
                  name="telefono"
                  className="formulario-table-input"
                />
              </div>              <div className="formulario-table-field-group">
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
              </div>              <div className="formulario-table-form-actions">
                <button type="submit" className="formulario-table-btn-confirm">
                  Crear
                </button>
                <button
                  type="button"
                  onClick={() => setIsClienteModalOpen(false)}
                  className="formulario-table-btn-cancel"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </Modal>
        </>
      )}
    </div>
  );
};

export default PagosPendientes;