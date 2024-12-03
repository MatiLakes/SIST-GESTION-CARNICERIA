import React, { useEffect, useState } from "react";
import { useGetCategoria } from "@hooks/categoria/useGetCategoria";
import { useUpdateCategoria } from "@hooks/categoria/useUpdateCategoria";
import { useDeleteCategoria } from "@hooks/categoria/useDeleteCategoria";
import { useCreateCategoria } from "@hooks/categoria/useCreateCategoria";
import Swal from "sweetalert2";
import MaterialTable from "material-table";
import "@styles/MaterialTable.css";
import '@styles/navbar.css';
import "@styles/formulariotable.css"; // Aquí se importa el CSS de formulariotable
import { AiTwotoneDelete } from "react-icons/ai";
import { MdOutlineEdit } from "react-icons/md";
import { CiEdit } from "react-icons/ci";  // Importa CiEdit
import { RiSave3Fill } from "react-icons/ri"; // Importa RiSave3Fill
import Modal from 'react-modal';
import { MdOutlineCancel } from "react-icons/md";



const Categorias = () => {
  const { categorias: initialCategorias, loading, error } = useGetCategoria();
  const { handleUpdate } = useUpdateCategoria();
  const { deleteCategoriaById } = useDeleteCategoria();
  const { handleCreate } = useCreateCategoria();

  const [categorias, setCategorias] = useState(initialCategorias);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [categoriaToEdit, setCategoriaToEdit] = useState(null);
  const [formData, setFormData] = useState({ nombre: "" });

  useEffect(() => {
    setCategorias(initialCategorias);
  }, [initialCategorias]);

  const handleEditClick = (rowData) => {
    setCategoriaToEdit(rowData);
    setFormData({ nombre: rowData.nombre });
    setIsEditModalOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await handleUpdate({ id: categoriaToEdit.id, nombre: formData.nombre });
      const updatedCategorias = categorias.map((categoria) =>
        categoria.id === categoriaToEdit.id ? { ...categoria, nombre: formData.nombre } : categoria
      );
      setCategorias(updatedCategorias);
      setIsEditModalOpen(false);
      Swal.fire("Éxito", "Categoría actualizada exitosamente.", "success");
    } catch (error) {
      console.error("Error al actualizar la categoría:", error);
      Swal.fire("Error", "Hubo un problema al actualizar la categoría.", "error");
    }
  };

  const handleDeleteClick = async (id) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      await deleteCategoriaById(id);
      setCategorias(categorias.filter((categoria) => categoria.id !== id));
      Swal.fire("Eliminado", "La categoría ha sido eliminada.", "success");
    }
  };

  const handleCreateClick = async (newData) => {
    try {
      await handleCreate({ nombre: newData.nombre });
      setCategorias((prevCategorias) => [
        ...prevCategorias,
        { id: newData.id, nombre: newData.nombre },
      ]);
      Swal.fire({
        icon: 'success',
        title: 'Categoría creada con éxito',
        text: 'La nueva categoría se ha añadido correctamente.',
      });
    } catch (error) {
      console.error("Error al crear la categoría:", error);
      Swal.fire("Error", "Hubo un problema al crear la categoría.", "error");
    }
  };

  if (loading) return <p>Cargando categorías...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="material-table">
      <div className="body-navbar">
        <MaterialTable
          title={<div className="table-title-formulario">Categoría</div>}
          columns={[
            { title: "ID", field: "id", editable: "never" },
            {
              title: "Nombre", 
              field: "nombre",
              render: (rowData) => rowData.nombre ? rowData.nombre : 'Categorías', // Asegurarse de que el nombre sea un string
            },
          ]}
          data={categorias.map((categoria) => ({
            id: categoria.id, 
            nombre: categoria.nombre,
          }))} // Asegúrate de que no haya objetos complejos en el array de categorías
          editable={{
            onRowAdd: handleCreateClick,
          }}
          options={{
            actionsColumnIndex: -1,
            addRowPosition: "first",
            maxBodyHeight: "770px",
            pageSize: categorias.length,
            exportButton: true,
            paging: false,
          }}
          actions={[
            {
              icon: () => <MdOutlineEdit />,
              tooltip: "Editar",
              onClick: (event, rowData) => handleEditClick(rowData),
            },
            {
              icon: () => <AiTwotoneDelete />,
              tooltip: "Eliminar",
              onClick: (event, rowData) => handleDeleteClick(rowData.id),
            },
          ]}
          localization={{
            toolbar: {
              searchTooltip: "Buscar",
              searchPlaceholder: "Buscar",
              exportCSVName: "Exportar en EXCEL",
            },
            header: {
              actions: "Acciones"
            },
          }}
        />
      </div>

      {/* Modal de Edición */}
      <Modal
        isOpen={isEditModalOpen}
        onRequestClose={() => setIsEditModalOpen(false)}
        contentLabel="Editar Categoría"
        ariaHideApp={false}
        className="formulario-table-modal-form" // Clase personalizada para el modal
        overlayClassName="formulario-table-overlay"
      >
        <h2 className="formulario-table-modal-title">
          <CiEdit style={{ marginRight: '8px' }} /> Editar Categoría
        </h2>
        <form onSubmit={handleEditSubmit} className="formulario-table-formulario-table"> {/* Clase de formulario */}
          <div className="formulario-table-form-group">
            <label htmlFor="nombre">Nombre de la Categoría:</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleEditChange}
              required
              className="formulario-table-input" // Aseguramos que tenga estilo de input
            />
          </div>
          <div className="formulario-table-form-actions">
            <button type="submit" className="formulario-table-btn-confirm">
            Guardar Cambios <RiSave3Fill className="icono-save-form" style={{ marginLeft: '8px' }} />
            </button>
            <button
            type="button"
            onClick={() => setIsEditModalOpen(false)} 
            className="formulario-table-btn-cancel"
          >
            Cancelar
            <MdOutlineCancel className="icono-cancelar-form" style={{ marginLeft: '8px' }} />
          </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Categorias;
