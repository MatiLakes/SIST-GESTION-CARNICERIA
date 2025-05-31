import React, { useState, useEffect } from "react";
import useGetClientes from "@hooks/clientes/useGetClientes.jsx";
import useCreateCliente from "@hooks/clientes/useCreateCliente.jsx";
import {useDeleteCliente} from "@hooks/clientes/useDeleteCliente.jsx";
import useEditCliente from "@hooks/clientes/useEditCliente.jsx";
import Table from "../components/Table";
import Modal from "react-modal";
import Swal from "sweetalert2";
import "@styles/formulariotable.css";
import "@styles/selectFix.css";
import styles from "@styles/categoria.module.css";

const Clientes = () => {  const { clientes, loading, fetchClientes } = useGetClientes();
  const { create } = useCreateCliente(fetchClientes);
  const { handleDelete } = useDeleteCliente(fetchClientes);
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
  };  const confirmDelete = () => {
    handleDelete(currentCliente.id);
    setIsDeleteModalOpen(false);
    setCurrentCliente(null);
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
    { header: "Tipo Cliente", key: "tipoCliente" },
    { header: "RUT", key: "rut" },
    { header: "Nombre/Razón Social", key: "nombreCompleto" },
    { header: "Dirección", key: "direccion" }, // Usamos una clave personalizada para el nombre
    { header: "Región", key: "region" },
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
            showCalendarButton={false}
          />

          {/* Modal de Creación */}
          <Modal
            isOpen={isModalOpen}
            onRequestClose={closeModal}
            contentLabel="Crear Cliente"
            ariaHideApp={false}
            className="modal-crear"
            overlayClassName="modal-overlay"
            closeTimeoutMS={300}
          >
            <form onSubmit={handleCreateCliente} className="modal-crear-formulario">
              <div className="modal-crear-header">
                <h2 className="modal-crear-titulo">Crear Nuevo Cliente</h2>
                <button type="button" onClick={closeModal} className="modal-crear-cerrar">×</button>
                <button type="submit" className="modal-boton-crear">Guardar</button>
              </div>

              <div className="formulario-grupo">
                <label className="formulario-etiqueta">Tipo de Cliente:</label>
                <select
                  id="tipoCliente"
                  name="tipoCliente"
                  required
                  className="formulario-input"
                  onChange={(e) => {
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
                    <div className="input-grupo" style={{ width: '100%' }}>
                      <input
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
                    <div className="input-grupo" style={{ width: '100%' }}>
                      <input
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
                </div>

                <div className="subproducto-fila" style={{ flex: 1, minWidth: '300px' }}>
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

          {/* Modal de Edición */}
          <Modal
            isOpen={isEditModalOpen}
            onRequestClose={() => setIsEditModalOpen(false)}
            contentLabel="Editar Cliente"
            ariaHideApp={false}
            className="modal-crear"
            overlayClassName="modal-overlay"
            closeTimeoutMS={300}
          >
            {currentCliente && (
              <form onSubmit={handleEditCliente} className="modal-crear-formulario">
                <div className="modal-crear-header">
                  <h2 className="modal-crear-titulo">Editar Cliente</h2>
                  <button type="button" onClick={() => setIsEditModalOpen(false)} className="modal-crear-cerrar">×</button>
                  <button type="submit" className="modal-boton-crear">Guardar</button>
                </div>

                <div className="formulario-grupo">
                  <label className="formulario-etiqueta">Tipo de Cliente:</label>
                  <select
                    id="tipoCliente"
                    name="tipoCliente"
                    required
                    className="formulario-input"
                    onChange={(e) => {
                      setClienteType(e.target.value);
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
                    value={clienteType}
                    defaultValue={currentCliente.tipoCliente}
                  >
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
                    defaultValue={currentCliente.rut}
                  />
                </div>

                {/* Campos para Persona */}
                <div style={{ width: '100%', margin: '0 auto', maxWidth: '800px', display: clienteType === 'Persona' ? 'block' : 'none' }}>
                  <div className="subproducto-fila" style={{ flex: 1, minWidth: '300px' }}>
                    <div className="subproducto-nombre-grupo">
                      <span className="subproducto-nombre">Nombres</span>
                    </div>
                    <div className="subproducto-inputs-grupo">
                      <div className="input-grupo" style={{ width: '100%' }}>
                        <input
                          type="text"
                          id="nombres"
                          name="nombres"
                          dir="ltr"
                          className="formulario-input"
                          style={{ minWidth: '220px', textAlign: 'left' }}
                          required={clienteType === 'Persona'}
                          defaultValue={currentCliente.nombres}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="subproducto-fila" style={{ flex: 1, minWidth: '300px' }}>
                    <div className="subproducto-nombre-grupo">
                      <span className="subproducto-nombre">Apellidos</span>
                    </div>
                    <div className="subproducto-inputs-grupo">
                      <div className="input-grupo" style={{ width: '100%' }}>
                        <input
                          type="text"
                          id="apellidos"
                          name="apellidos"
                          dir="ltr"
                          className="formulario-input"
                          style={{ minWidth: '220px', textAlign: 'left' }}
                          required={clienteType === 'Persona'}
                          defaultValue={currentCliente.apellidos}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Campos para Empresa */}
                <div style={{ width: '100%', margin: '0 auto', maxWidth: '800px', display: clienteType === 'Empresa' ? 'block' : 'none' }}>
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
                          required={clienteType === 'Empresa'}
                          defaultValue={currentCliente.razonSocial}
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
                          required={clienteType === 'Empresa'}
                          defaultValue={currentCliente.giro}
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
                            defaultValue={currentCliente.email}
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
                            defaultValue={currentCliente.telefono}
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
                          defaultValue={currentCliente.direccion}
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
                            defaultValue={currentCliente.comuna}
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
                            defaultValue={currentCliente.ciudad}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="subproducto-fila" style={{ flex: 1, minWidth: '300px' }}>
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
                          defaultValue={currentCliente.region}
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
