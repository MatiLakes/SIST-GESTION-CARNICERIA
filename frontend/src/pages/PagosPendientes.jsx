import React, { useState, useEffect } from "react";
import useGetPagosPendientes from "@hooks/pagosPendientes/useGetPagosPendientes.jsx";
import useCreatePagoPendiente from "@hooks/pagosPendientes/useCreatePagoPendiente.jsx";
import useDeletePagoPendiente from "@hooks/pagosPendientes/useDeletePagoPendiente.jsx";
import useEditPagoPendiente from "@hooks/pagosPendientes/useEditPagoPendiente.jsx";
import { useErrorHandlerPagoPendiente } from "@hooks/pagosPendientes/useErrorHandlerPagoPendiente.jsx";
import useGetClientes from "@hooks/clientes/useGetClientes.jsx";
import useCreateCliente from "@hooks/clientes/useCreateCliente.jsx";
import Table from "../components/Table";
import Modal from "react-modal";
import Swal from "sweetalert2";
import "@styles/formulariotable.css";
import "@styles/selectFix.css";
import "@styles/modalCrear.css";
import styles from "@styles/categoria.module.css";

// Estilos en línea para el selector de cliente y el modal de confirmación
const inlineStyles = {
  clienteSelectorContainer: {
    display: 'flex',
    gap: '10px',
    width: '100%',
    alignItems: 'center'
  },
  clienteSelector: {
    flex: 3,
    minWidth: '220px'
  },
  modalConfirmarTexto: {
    textAlign: 'center',
    margin: '20px 0',
    fontSize: '16px'
  }
};

const PagosPendientes = () => {
  const { pagosPendientes, loading, fetchPagosPendientes } = useGetPagosPendientes();
  const { create } = useCreatePagoPendiente(fetchPagosPendientes);
  const { remove } = useDeletePagoPendiente(fetchPagosPendientes);
  const { edit } = useEditPagoPendiente(fetchPagosPendientes);
  const { createError, editError, handleCreateError, handleEditError } = useErrorHandlerPagoPendiente();
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
          const empresaFields = form.querySelector('#razonSocial').closest('div[style*="display"]');
          empresaFields.style.display = 'none';
          
          const nombresField = form.querySelector('#nombres').closest('.formulario-grupo');
          const apellidosField = form.querySelector('#apellidos').closest('.formulario-grupo');
          nombresField.style.display = 'block';
          apellidosField.style.display = 'block';
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
      clienteId: formData.get("id_cliente"),
    };

    // Validar antes de enviar
    const hasErrors = handleCreateError(newPagoPendiente);
    if (hasErrors) {
      return;
    }

    try {
      // Convertir clienteId a id_cliente para el backend
      const dataToSend = {
        ...newPagoPendiente,
        id_cliente: newPagoPendiente.clienteId
      };
      delete dataToSend.clienteId;
      
      await create(dataToSend);
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
      clienteId: formData.get("id_cliente"),
    };

    // Validar antes de enviar
    const hasErrors = handleEditError(updatedPagoPendiente);
    if (hasErrors) {
      return;
    }

    try {
      // Convertir clienteId a id_cliente para el backend
      const dataToSend = {
        ...updatedPagoPendiente,
        id_cliente: updatedPagoPendiente.clienteId
      };
      delete dataToSend.clienteId;
      
      await edit(currentPagoPendiente.id, dataToSend);
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
  };const handleCreateCliente = async (event) => {
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
    { header: "Monto", key: "monto" },
    { header: "Fecha Pedido", key: "fechaPedido" },
    { header: "Fecha Límite", key: "fechaLimite" },
    { header: "Estado", key: "estado" },
    { header: "Cliente", key: "cliente" }
  ];  // Función para formatear los datos de forma personalizada
  const customFormat = (value, key) => {
    // Formateo de fechas
    if (key === 'fechaPedido' || key === 'fechaLimite') {
      if (!value) return 'No disponible';
      
      // Si ya es una fecha en formato YYYY-MM-DD, convertir a DD/MM/YYYY
      if (typeof value === "string" && value.match(/^\d{4}-\d{2}-\d{2}$/)) {
        const fecha = new Date(value + 'T00:00:00');
        if (!isNaN(fecha.getTime())) {
          return fecha.toLocaleDateString('es-CL', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          });
        }
      }
      
      // Si es un objeto Date
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString('es-CL', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
      }
      
      return 'Fecha inválida';
    }

    // Formateo del monto
    if (key === "monto" && (typeof value === "number" || !isNaN(parseFloat(value)))) {
      return `$${parseFloat(value).toLocaleString('es-CL')}`;
    }    // Formateo de cliente
    if (key === 'cliente') {
      // Verificar que tengamos el array de clientes y el valor del ID
      if (!Array.isArray(clientes) || !value?.id) {
        console.warn('Datos de clientes no disponibles o ID de cliente no válido:', { clientes, value });
        return "No disponible";
      }

      const cliente = clientes.find(c => c.id === value.id);
      if (!cliente) {
        console.warn('Cliente no encontrado para el ID:', value.id);
        return "Cliente no encontrado";
      }      try {
        if (cliente.tipoCliente === "Empresa") {
          return cliente.razonSocial?.trim() || 'Sin razón social';
        } else {
          const nombres = cliente.nombres?.trim() || "Sin nombres";
          const apellidos = cliente.apellidos?.trim() || "Sin apellidos";
          return `${nombres} ${apellidos}`;
        }
      } catch (err) {
        console.error('Error al formatear datos del cliente:', err, cliente);
        return "Error al mostrar cliente";
      }
    }

    

    // Formateo del estado
    if (value === "Pendiente" || value === "Pagado" || value === "Vencido") {
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

          {/* Modal de Creación */}          <Modal
            isOpen={isModalOpen}
            onRequestClose={closeModal}
            contentLabel="Crear Pago Pendiente"
            ariaHideApp={false}
            className="modal-crear"
            overlayClassName="modal-overlay"
            closeTimeoutMS={300}
          >
            <form onSubmit={handleCreatePagoPendiente} className="modal-crear-formulario">
              <div className="modal-crear-header">
                <h2 className="modal-crear-titulo">Crear Nuevo Pago Pendiente</h2>
                <button type="button" onClick={closeModal} className="modal-crear-cerrar">×</button>
                <button type="submit" className="modal-boton-crear">Guardar</button>
              </div>              <div className="formulario-grupo">
                <label className="formulario-etiqueta">Monto:</label>
                <div className="input-container">
                  <input
                    type="number"
                    id="monto" 
                    name="monto"
                    required
                    min="0"
                    step="1"                    
                    pattern="^[0-9]+$"
                    inputMode="numeric"
                    onKeyDown={e => {
                      if (e.key === '-' || e.key === '.' || e.key === ',') e.preventDefault();
                    }}
                    className={`formulario-input ${createError && createError.errors?.some(error => error.field === 'monto') ? 'input-error' : ''}`}
                  />
                  {createError && createError.errors?.map((error, index) => (
                    error.field === 'monto' && (
                      <div key={index} className="error-message">
                        {error.message}
                      </div>
                    )
                  ))}
                </div>
              </div>              <div className="formulario-grupo">
                <label className="formulario-etiqueta">Fecha Pedido:</label>
                <div className="input-container">
                  <input
                    type="date"
                    id="fechaPedido"
                    name="fechaPedido"
                    required
                    className={`formulario-input ${createError && createError.errors?.some(error => error.field === 'fechaPedido') ? 'input-error' : ''}`}
                  />
                  {createError && createError.errors?.map((error, index) => (
                    error.field === 'fechaPedido' && (
                      <div key={index} className="error-message">
                        {error.message}
                      </div>
                    )
                  ))}
                </div>
              </div>              <div className="formulario-grupo">
                <label className="formulario-etiqueta">Fecha Límite:</label>
                <div className="input-container">
                  <input
                    type="date"
                    id="fechaLimite"
                    name="fechaLimite"
                    required
                    className={`formulario-input ${createError && createError.errors?.some(error => error.field === 'fechaLimite') ? 'input-error' : ''}`}
                  />
                  {createError && createError.errors?.map((error, index) => (
                    error.field === 'fechaLimite' && (
                      <div key={index} className="error-message">
                        {error.message}
                      </div>
                    )
                  ))}
                </div>
              </div>              <div className="formulario-grupo">
                <label className="formulario-etiqueta">Estado:</label>
                <div className="input-container">
                  <select 
                    id="estado"
                    name="estado"
                    required
                    className={`formulario-input ${createError && createError.errors?.some(error => error.field === 'estado') ? 'input-error' : ''}`}
                  >
                    <option value="Pendiente">Pendiente</option>
                    <option value="Pagado">Pagado</option>
                    <option value="Vencido">Vencido</option>
                  </select>
                  {createError && createError.errors?.map((error, index) => (
                    error.field === 'estado' && (
                      <div key={index} className="error-message">
                        {error.message}
                      </div>
                    )
                  ))}
                </div>
              </div>              <div className="formulario-grupo">
                <label className="formulario-etiqueta">Cliente:</label>
                <div className="input-container">
                  <div className="cliente-selector-container">
                    <select
                      id="id_cliente"
                      name="id_cliente"
                      required
                      className={`formulario-input cliente-selector ${createError && createError.errors?.some(error => error.field === 'clienteId') ? 'input-error' : ''}`}
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
                      )}
                    </select>
                    <button
                      type="button"
                      onClick={openClienteModal}
                      className="modal-boton-anadir"
                    >
                      Nuevo Cliente
                    </button>
                  </div>
                  {createError && createError.errors?.map((error, index) => (
                    error.field === 'clienteId' && (
                      <div key={index} className="error-message">
                        {error.message}
                      </div>
                    )
                  ))}
                </div>
              </div>              <div className="formulario-grupo">
                <label className="formulario-etiqueta">Factura (PDF/Imagen):</label>
                <div className="input-container">
                  <input
                    type="file"
                    id="factura"
                    name="factura"
                    accept=".pdf,.png,.jpg"
                    className={`formulario-input ${createError && createError.errors?.some(error => error.field === 'factura') ? 'input-error' : ''}`}
                  />
                  {createError && createError.errors?.map((error, index) => (
                    error.field === 'factura' && (
                      <div key={index} className="error-message">
                        {error.message}
                      </div>
                    )
                  ))}
                </div>
              </div>
            </form>
          </Modal>

          {/* Modal de Edición */}          <Modal
            isOpen={isEditModalOpen}
            onRequestClose={() => setIsEditModalOpen(false)}
            contentLabel="Editar Pago Pendiente"
            ariaHideApp={false}
            className="modal-crear"
            overlayClassName="modal-overlay"
            closeTimeoutMS={300}
          >
            {currentPagoPendiente && (
              <form onSubmit={handleEditPagoPendiente} className="modal-crear-formulario">
                <div className="modal-crear-header">
                  <h2 className="modal-crear-titulo">Editar Pago Pendiente</h2>
                  <button type="button" onClick={() => setIsEditModalOpen(false)} className="modal-crear-cerrar">×</button>
                  <button type="submit" className="modal-boton-crear">Guardar</button>
                </div>                <div className="formulario-grupo">
                  <label className="formulario-etiqueta">Monto:</label>
                  <div className="input-container">
                    <input
                      type="number"
                      id="monto"
                      name="monto"
                      defaultValue={currentPagoPendiente.monto}
                      required
                      min="0"
                      step="1"                      
                      pattern="^[0-9]+$"
                      inputMode="numeric"
                      onKeyDown={e => {
                        if (e.key === '-' || e.key === '.' || e.key === ',') e.preventDefault();
                      }}
                      className={`formulario-input ${editError && editError.errors?.some(error => error.field === 'monto') ? 'input-error' : ''}`}
                    />
                    {editError && editError.errors?.map((error, index) => (
                      error.field === 'monto' && (
                        <div key={index} className="error-message">
                          {error.message}
                        </div>
                      )
                    ))}
                  </div>
                </div>                <div className="formulario-grupo">
                  <label className="formulario-etiqueta">Fecha Pedido:</label>
                  <div className="input-container">
                    <input
                      type="date"
                      id="fechaPedido"
                      name="fechaPedido"
                      defaultValue={currentPagoPendiente.fechaPedido}
                      required
                      className={`formulario-input ${editError && editError.errors?.some(error => error.field === 'fechaPedido') ? 'input-error' : ''}`}
                    />
                    {editError && editError.errors?.map((error, index) => (
                      error.field === 'fechaPedido' && (
                        <div key={index} className="error-message">
                          {error.message}
                        </div>
                      )
                    ))}
                  </div>
                </div>                <div className="formulario-grupo">
                  <label className="formulario-etiqueta">Fecha Límite:</label>
                  <div className="input-container">
                    <input
                      type="date"
                      id="fechaLimite"
                      name="fechaLimite"
                      defaultValue={currentPagoPendiente.fechaLimite}
                      required
                      className={`formulario-input ${editError && editError.errors?.some(error => error.field === 'fechaLimite') ? 'input-error' : ''}`}
                    />
                    {editError && editError.errors?.map((error, index) => (
                      error.field === 'fechaLimite' && (
                        <div key={index} className="error-message">
                          {error.message}
                        </div>
                      )
                    ))}
                  </div>
                </div>                <div className="formulario-grupo">
                  <label className="formulario-etiqueta">Estado:</label>
                  <div className="input-container">
                    <select 
                      id="estado"
                      name="estado"
                      defaultValue={currentPagoPendiente.estado}
                      required
                      className={`formulario-input ${editError && editError.errors?.some(error => error.field === 'estado') ? 'input-error' : ''}`}
                    >
                      <option value="Pendiente">Pendiente</option>
                      <option value="Pagado">Pagado</option>
                      <option value="Vencido">Vencido</option>
                    </select>
                    {editError && editError.errors?.map((error, index) => (
                      error.field === 'estado' && (
                        <div key={index} className="error-message">
                          {error.message}
                        </div>
                      )
                    ))}
                  </div>
                </div>                <div className="formulario-grupo">
                  <label className="formulario-etiqueta">Cliente:</label>
                  <div className="input-container">
                    <div className="cliente-selector-container">
                      <select
                        id="id_cliente"
                        name="id_cliente"
                        defaultValue={currentPagoPendiente.cliente?.id}
                        required
                        className={`formulario-input cliente-selector ${editError && editError.errors?.some(error => error.field === 'clienteId') ? 'input-error' : ''}`}
                      >
                        <option value="">Selecciona un Cliente</option>
                        {clientes && clientes.map((cliente) => (
                          <option key={cliente.id} value={cliente.id}>
                            {cliente.tipoCliente === "Empresa" 
                              ? `${cliente.razonSocial || ''} - ${cliente.rut}` 
                              : `${cliente.nombres || ''} ${cliente.apellidos || ''} - ${cliente.rut}`}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={openClienteModal}
                        className="modal-boton-anadir"
                      >
                        Nuevo Cliente
                      </button>
                    </div>
                    {editError && editError.errors?.map((error, index) => (
                      error.field === 'clienteId' && (
                        <div key={index} className="error-message">
                          {error.message}
                        </div>
                      )
                    ))}
                  </div>
                </div>                <div className="formulario-grupo">
                  <label className="formulario-etiqueta">Factura (PDF/Imagen):</label>
                  <div className="input-container">
                    <input
                      type="file"
                      id="factura"
                      name="factura"
                      accept=".pdf,.png,.jpg"
                      className={`formulario-input ${editError && editError.errors?.some(error => error.field === 'factura') ? 'input-error' : ''}`}
                    />
                    {currentPagoPendiente.factura && (
                      <div style={{ marginTop: '5px', fontSize: '0.9em', color: '#666' }}>
                        Archivo actual: {currentPagoPendiente.factura.split('/').pop()}
                      </div>
                    )}
                    {editError && editError.errors?.map((error, index) => (
                      error.field === 'factura' && (
                        <div key={index} className="error-message">
                          {error.message}
                        </div>
                      )
                    ))}
                  </div>
                </div>
              </form>
            )}
          </Modal>      {/* Modal de Eliminación */}
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
        <p>¿Estás seguro de que deseas eliminar este pago pendiente?</p>
        {currentPagoPendiente && (
          <div style={{ margin: '20px 0', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
            <p><strong>Cliente:</strong> {clientes?.find(c => c.id === currentPagoPendiente.cliente?.id)?.tipoCliente === "Empresa" 
              ? clientes?.find(c => c.id === currentPagoPendiente.cliente?.id)?.razonSocial 
              : `${clientes?.find(c => c.id === currentPagoPendiente.cliente?.id)?.nombres} ${clientes?.find(c => c.id === currentPagoPendiente.cliente?.id)?.apellidos}`}</p>  
            <p><strong>Estado:</strong> {currentPagoPendiente.estado}</p>
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

          {/* Modal para Crear Cliente */}          <Modal
            isOpen={isClienteModalOpen}
            onRequestClose={() => setIsClienteModalOpen(false)}
            contentLabel="Crear Cliente"
            ariaHideApp={false}
            className="modal-crear"
            overlayClassName="modal-overlay"
            closeTimeoutMS={300}
          >
            <form onSubmit={handleCreateCliente} className="modal-crear-formulario" id="clienteForm">
              <div className="modal-crear-header">
                <h2 className="modal-crear-titulo">Crear Nuevo Cliente</h2>
                <button type="button" onClick={() => setIsClienteModalOpen(false)} className="modal-crear-cerrar">×</button>
                <button type="submit" className="modal-boton-crear">Guardar</button>
              </div>
              <div className="formulario-grupo">
                <label className="formulario-etiqueta">Tipo de Cliente:</label>
                <select
                  id="tipoCliente"
                  name="tipoCliente"
                  required
                  className="formulario-input"                  onChange={(e) => {
                    const form = e.target.form;
                    const isEmpresa = e.target.value === "Empresa";
                    
                    if (form) {
                      // Campos de empresa
                      const empresaFields = form.querySelector('div[style*="display"]:has(#razonSocial)');
                      if (empresaFields) {
                        empresaFields.style.display = isEmpresa ? 'block' : 'none';
                        // Actualizar required en campos de empresa
                        const razonSocialInput = form.querySelector('#razonSocial');
                        const giroInput = form.querySelector('#giro');
                        if (razonSocialInput) razonSocialInput.required = isEmpresa;
                        if (giroInput) giroInput.required = isEmpresa;
                      }
                      
                      // Campos de persona
                      const personaFields = form.querySelector('div[style*="display"]:has(#nombres)');
                      if (personaFields) {
                        personaFields.style.display = isEmpresa ? 'none' : 'block';
                        // Actualizar required en campos de persona
                        const nombresInput = form.querySelector('#nombres');
                        const apellidosInput = form.querySelector('#apellidos');
                        if (nombresInput) nombresInput.required = !isEmpresa;
                        if (apellidosInput) apellidosInput.required = !isEmpresa;
                      }
                    }
                  }}
                >
                  <option value="">Seleccione tipo</option>
                  <option value="Persona">Persona</option>
                  <option value="Empresa">Empresa</option>
                </select>
              </div>
              
              <div className="formulario-grupo">
                <label className="formulario-etiqueta">RUT:</label>
                <input
                  type="text"
                  id="rut"
                  name="rut"
                  required
                  className="formulario-input"
                  placeholder="Ej: 12345678-9"
                  pattern="(\d{1,2}(\.\d{3}){2}-[\dkK]|\d{7,8}-[\dkK])"
                  title="Formato válido: 12.345.678-9 o 12345678-9"
                />
              </div>

              {/* Campos para Persona */}
              <div style={{ width: '100%', margin: '0 auto', maxWidth: '800px', display: 'block' }}>
                <div className="subproducto-fila" style={{ flex: 1, minWidth: '300px' }}>
                  <div className="subproducto-nombre-grupo">
                    <span className="subproducto-nombre">Nombres</span>
                  </div>
                  <div className="subproducto-inputs-grupo">
                    <div className="input-grupo" style={{ width: '100%' }}>                      <input
                        type="text"
                        id="nombres"
                        name="nombres"
                        dir="ltr"
                        className="formulario-input"
                        style={{ minWidth: '220px', textAlign: 'left' }}
                      />
                    </div>
                  </div>
                </div>

                <div className="subproducto-fila" style={{ flex: 1, minWidth: '300px' }}>
                  <div className="subproducto-nombre-grupo">
                    <span className="subproducto-nombre">Apellidos</span>
                  </div>
                  <div className="subproducto-inputs-grupo">
                    <div className="input-grupo" style={{ width: '100%' }}>                      <input
                        type="text"
                        id="apellidos"
                        name="apellidos"
                        dir="ltr"
                        className="formulario-input"
                        style={{ minWidth: '220px', textAlign: 'left' }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Campos para Empresa */}
              <div style={{ width: '100%', margin: '0 auto', maxWidth: '800px', display: 'none' }}>
                <div className="subproducto-fila" style={{ flex: 1, minWidth: '300px' }}>
                  <div className="subproducto-nombre-grupo">
                    <span className="subproducto-nombre">Razón Social</span>
                  </div>
                  <div className="subproducto-inputs-grupo">
                    <div className="input-grupo" style={{ width: '100%' }}>
                      <input
                        type="text"
                        id="razonSocial"
                        name="razonSocial"
                        dir="ltr"
                        className="formulario-input"
                        style={{ minWidth: '220px', textAlign: 'left' }}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="subproducto-fila" style={{ flex: 1, minWidth: '300px' }}>
                  <div className="subproducto-nombre-grupo">
                    <span className="subproducto-nombre">Giro</span>
                  </div>
                  <div className="subproducto-inputs-grupo">
                    <div className="input-grupo" style={{ width: '100%' }}>
                      <input
                        type="text"
                        id="giro"
                        name="giro"
                        dir="ltr"
                        className="formulario-input"
                        style={{ minWidth: '220px', textAlign: 'left' }}
                      />
                    </div>
                  </div>
                </div>
              </div>              
              
              {/* Campos de Contacto */}
              <div style={{ width: '100%', margin: '0 auto', maxWidth: '800px' }}>
                <div style={{ display: 'flex', gap: '15px', marginBottom: '10px' }}>
                  <div className="subproducto-fila" style={{ flex: 1, minWidth: '300px' }}>
                    <div className="subproducto-nombre-grupo">
                      <span className="subproducto-nombre">Email</span>
                    </div>
                    <div className="subproducto-inputs-grupo">
                      <div className="input-grupo" style={{ width: '100%' }}>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          dir="ltr"
                          className="formulario-input"
                          placeholder="correo@ejemplo.com"
                          style={{ minWidth: '220px', textAlign: 'left' }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="subproducto-fila" style={{ flex: 1, minWidth: '300px' }}>
                    <div className="subproducto-nombre-grupo">
                      <span className="subproducto-nombre">Teléfono</span>
                    </div>
                    <div className="subproducto-inputs-grupo">
                      <div className="input-grupo" style={{ width: '100%' }}>
                        <input
                          type="text"
                          id="telefono"
                          name="telefono"
                          dir="ltr"
                          className="formulario-input"
                          placeholder="+56 9 XXXX XXXX"
                          style={{ minWidth: '220px', textAlign: 'left' }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Campos de Dirección */}
              <div style={{ width: '100%', margin: '0 auto', maxWidth: '800px' }}>
                <div className="subproducto-fila" style={{ flex: 1, minWidth: '300px', marginBottom: '10px' }}>
                  <div className="subproducto-nombre-grupo">
                    <span className="subproducto-nombre">Dirección</span>
                  </div>
                  <div className="subproducto-inputs-grupo">
                    <div className="input-grupo" style={{ width: '100%' }}>
                      <input
                        type="text"
                        id="direccion"
                        name="direccion"
                        required
                        dir="ltr"
                        className="formulario-input"
                        style={{ minWidth: '220px', textAlign: 'left' }}
                      />
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '15px', marginBottom: '10px' }}>
                  <div className="subproducto-fila" style={{ flex: 1, minWidth: '300px' }}>
                    <div className="subproducto-nombre-grupo">
                      <span className="subproducto-nombre">Comuna</span>
                    </div>
                    <div className="subproducto-inputs-grupo">
                      <div className="input-grupo" style={{ width: '100%' }}>
                        <input
                          type="text"
                          id="comuna"
                          name="comuna"
                          required
                          dir="ltr"
                          className="formulario-input"
                          style={{ minWidth: '220px', textAlign: 'left' }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="subproducto-fila" style={{ flex: 1, minWidth: '300px' }}>
                    <div className="subproducto-nombre-grupo">
                      <span className="subproducto-nombre">Ciudad</span>
                    </div>
                    <div className="subproducto-inputs-grupo">
                      <div className="input-grupo" style={{ width: '100%' }}>
                        <input
                          type="text"
                          id="ciudad"
                          name="ciudad"
                          required
                          dir="ltr"
                          className="formulario-input"
                          style={{ minWidth: '220px', textAlign: 'left' }}
                        />
                      </div>
                    </div>
                  </div>
                </div>                <div className="subproducto-fila" style={{ flex: 1, minWidth: '300px' }}>
                  <div className="subproducto-nombre-grupo">
                    <span className="subproducto-nombre">Región</span>
                  </div>
                  <div className="subproducto-inputs-grupo">
                    <div className="input-grupo" style={{ width: '100%' }}>
                      <select
                        id="region"
                        name="region"
                        required
                        className="formulario-input"
                        style={{ minWidth: '220px', textAlign: 'left' }}
                      >
                        <option value="">Seleccione Región</option>
                        <option value="Arica y Parinacota">Arica y Parinacota</option>
                        <option value="Tarapacá">Tarapacá</option>
                        <option value="Antofagasta">Antofagasta</option>
                        <option value="Atacama">Atacama</option>
                        <option value="Coquimbo">Coquimbo</option>
                        <option value="Valparaíso">Valparaíso</option>
                        <option value="Metropolitana de Santiago">Metropolitana de Santiago</option>
                        <option value="O'Higgins">O'Higgins</option>
                        <option value="Maule">Maule</option>
                        <option value="Ñuble">Ñuble</option>
                        <option value="Biobío">Biobío</option>
                        <option value="Araucanía">Araucanía</option>
                        <option value="Los Ríos">Los Ríos</option>
                        <option value="Los Lagos">Los Lagos</option>
                        <option value="Aysén">Aysén</option>
                        <option value="Magallanes y la Antártica Chilena">Magallanes y la Antártica Chilena</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </Modal>
        </>
      )}
    </div>
  );
};

export default PagosPendientes;