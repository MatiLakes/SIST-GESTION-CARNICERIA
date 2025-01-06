import React, { useEffect, useState } from "react";
import { useGetProductoCarnico } from "@hooks/productoCarnico/useGetProductoCarnico";
import { useCreateProductoCarnico } from "@hooks/productoCarnico/useCreateProductoCarnico";
import { useDeleteProductoCarnico } from "@hooks/productoCarnico/useDeleteProductoCarnico";
import { useUpdateProductoCarnico } from "@hooks/productoCarnico/useUpdateProductoCarnico";
import { getCategoriasCarnicas }  from '../services/categoria.service';


import Table from "../components/Table";
import Modal from "react-modal";
import styles from "@styles/categoria.module.css";
import "@styles/formulariotabledatos.css";

const ProductoCarnico = () => {
  const { productosCarnicos, loading, error, fetchProductosCarnicos } = useGetProductoCarnico();
  const { handleCreate } = useCreateProductoCarnico(fetchProductosCarnicos);
  const { handleDelete } = useDeleteProductoCarnico(fetchProductosCarnicos);
  const { handleUpdate } = useUpdateProductoCarnico(fetchProductosCarnicos);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productoCarnicoToEdit, setProductoCarnicoToEdit] = useState(null);
  const [productoCarnicoToDelete, setProductoCarnicoToDelete] = useState(null);
  const [newProductoData, setNewProductoData] = useState({ 
    tipo_producto: "", marca: "", cantidad_kg: "", precio_kg_compra: "", precio_kg_venta: "",
    fecha_vencimiento: "", fecha_llegada: "", categoria: "",
  });
  const [formData, setFormData] = useState({
    tipo_producto: "", marca: "", cantidad_kg: "", precio_kg_compra: "", precio_kg_venta: "",
    fecha_vencimiento: "", fecha_llegada: "", categoria: "",
  });

  // Estado para las categorías
  const [categorias, setCategorias] = useState([]);

  // Cargar las categorías al montar el componente
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const categoriasData = await getCategoriasCarnicas(); // Función que obtiene las categorías
        setCategorias(categoriasData);
      } catch (error) {
        console.error("Error al obtener categorías:", error);
      }
    };

    fetchCategorias();
  }, []); // Este useEffect solo se ejecuta una vez, al montar el componente

  useEffect(() => {
    console.log("Productos Cárnicos obtenidos:", productosCarnicos);
  }, [productosCarnicos]);

  // Manejo del clic para eliminar
  const handleDeleteClick = (productoCarnico) => {
    setProductoCarnicoToDelete(productoCarnico);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
    setProductoCarnicoToDelete(null);
  };

  const confirmDelete = () => {
    handleDelete(productoCarnicoToDelete.id);
    setIsDeleteModalOpen(false);
    setProductoCarnicoToDelete(null);
  };

  // Manejo del clic para editar
  const handleUpdateClick = (productoCarnico) => {
    setProductoCarnicoToEdit(productoCarnico);
    setFormData({
      tipo_producto: productoCarnico.tipo_producto,
      marca: productoCarnico.marca,
      cantidad_kg: productoCarnico.cantidad_kg,
      precio_kg_compra: productoCarnico.precio_kg_compra,
      precio_kg_venta: productoCarnico.precio_kg_venta,
      fecha_vencimiento: productoCarnico.fecha_vencimiento,
      fecha_llegada: productoCarnico.fecha_llegada,
      categoria: productoCarnico.categoria?.nombre || "",
    });
    setIsEditModalOpen(true);
  };

  // Manejo del clic para crear
  const handleCreateClick = () => {
    setIsCreateModalOpen(true);
  };

  // Manejo de cambios en el modal de creación
  const handleCreateModalChange = (e) => {
    setNewProductoData({ ...newProductoData, [e.target.name]: e.target.value });
  };

  // Enviar los datos para crear el producto
  const handleCreateModalSubmit = (e) => {
    e.preventDefault();
    handleCreate(newProductoData);
    setNewProductoData({ nombre: "", precio: "", tipo_producto: "" });
    setIsCreateModalOpen(false);
  };

  // Manejo de cambios en el modal de edición
  const handleEditChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Enviar los datos para actualizar el producto
  const handleEditSubmit = (e) => {
    e.preventDefault();
    handleUpdate(productoCarnicoToEdit.id, formData);
    setIsEditModalOpen(false);
  };

  if (loading) return <p>Cargando productos cárnicos...</p>;
  if (error) return <p>Error: {error}</p>;

  const columns = [
    { header: "Tipo Producto", key: "tipo_producto" },
    { header: "Marca", key: "marca" },
    { header: "Cantidad (kg)", key: "cantidad_kg" },
    { header: "Precio Compra (kg)", key: "precio_kg_compra" },
    { header: "Precio Venta (kg)", key: "precio_kg_venta" },
    { header: "Fecha de Llegada", key: "fecha_llegada" },
    { header: "Fecha de Vencimiento", key: "fecha_vencimiento" },
    {
      header: "Categoría",
      key: "categoria",
      customFormat: (value) => (value?.nombre ? value.nombre : value), // Formato personalizado
    },
  ];

  return (
    <div className={styles["categoria-container"]}>
      <Table
        data={productosCarnicos}
        columns={columns}
        headerTitle="Productos Cárnicos"
        onCreate={handleCreateClick}
        onEdit={handleUpdateClick}
        onDelete={handleDeleteClick}
        showEditAllButton={false}
        showViewButton={false}
        showCalendarButton={true}
        customFormat={(value) => (value?.nombre ? value.nombre : value)}
      />

      {/* Modal de Creación */}
      <Modal
        isOpen={isCreateModalOpen}
        onRequestClose={() => setIsCreateModalOpen(false)}
        contentLabel="Añadir Producto Cárnico"
        ariaHideApp={false}
        className="formulario-table-modal-form-datos"
        overlayClassName="formulario-table-overlay"
      >
        <h2 className="formulario-table-modal-title">Añadir Producto Cárnico</h2>
        <form onSubmit={handleCreateModalSubmit} className="formulario-table-formulario-table">
          <div className="formulario-table-formulario-table-datos">
            <label htmlFor="tipo_producto">Tipo de Producto:</label>
            <input
              type="text"
              id="tipo_producto"
              name="tipo_producto"
              value={newProductoData.tipo_producto}
              onChange={handleCreateModalChange}
              required
              className="formulario-table-input"
            />
          </div>
          <div className="formulario-table-formulario-table-datos">
            <label htmlFor="marca">Marca:</label>
            <input
              type="text"
              id="marca"
              name="marca"
              value={newProductoData.marca}
              onChange={handleCreateModalChange}
              required
              className="formulario-table-input"
            />
                      <div className="formulario-table-formulario-table-datos">
            <label htmlFor="cantidad_kg">cantidad kg:</label>
            <input
              type="number"
              id="cantidad_kg"
              name="cantidad_kg"
              value={newProductoData.cantidad_kg}
              onChange={handleCreateModalChange}
              required
              className="formulario-table-input"
            />
      
          </div>
      
          </div>
          <div className="formulario-table-formulario-table-datos">
            <label htmlFor="precio_kg_compra">Precio (kg) Compra:</label>
            <input
              type="number"
              id="precio_kg_compra"
              name="precio_kg_compra"
              value={newProductoData.precio_kg_compra}
              onChange={handleCreateModalChange}
              required
              className="formulario-table-input"
            />
      
          </div>


          <div className="formulario-table-formulario-table-datos">
            <label htmlFor="precio_kg_venta">Precio (kg) Venta:</label>
            <input
              type="number"
              id="precio_kg_venta"
              name="precio_kg_venta"
              value={newProductoData.precio_kg_venta}
              onChange={handleCreateModalChange}
              required
              className="formulario-table-input"
            />
          </div>
          <div className="formulario-table-field-group">
                        <label htmlFor="fecha_llegada">Fecha de Llegada:</label>
                        <input
                            type="date"
                            id="fecha_llegada"
                            name="fecha_llegada"
                            value={newProductoData.fecha_llegada}
                            onChange={handleCreateModalChange}
                            required
                            className="formulario-table-input"
                        />
                    </div>
                    <div className="formulario-table-field-group">
                        <label htmlFor="fecha_vencimiento">Fecha de Vencimiento:</label>
                        <input
                            type="date"
                            id="fecha_vencimiento"
                            name="fecha_vencimiento"
                            value={newProductoData.fecha_fecha_vencimiento}
                            onChange={handleCreateModalChange}
                            required
                            className="formulario-table-input"
                        />
                    </div>
                    <div className="formulario-table-field-group">
            <label htmlFor="categoria">Categoría:</label>
            <select
              id="categoria"
              name="categoria"
              value={newProductoData.categoria}
              onChange={handleCreateModalChange}
              className="formulario-table-input tipo-cuenta-select"
              required
            >
              <option value="">Selecciona una Categoría</option>
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.nombre}>
                  {categoria.nombre}
                </option>
              ))}
            </select>
          </div>

          
          <div className="formulario-table-form-actions">
            <button type="submit" className="formulario-table-btn-confirm">
              Crear
            </button>
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="formulario-table-btn-cancel"
            >
              Cancelar
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal de Edición */}
      <Modal
        isOpen={isEditModalOpen}
        onRequestClose={() => setIsEditModalOpen(false)}
        contentLabel="Editar Producto Cárnico"
        ariaHideApp={false}
        className="formulario-table-modal-form-datos"
        overlayClassName="formulario-table-overlay"
      >
        <h2 className="formulario-table-modal-title">Editar Producto Cárnico</h2>
        <form onSubmit={handleEditSubmit} className="formulario-table-formulario-table">
          <div className="formulario-table-formulario-table-datos">
            <label htmlFor="tipo_producto">Tipo_producto:</label>
            <input
              type="text"
              id="tipo_producto"
              name="tipo_producto"
              value={formData.tipo_producto}
              onChange={handleEditChange}
              className="formulario-table-input"
              required
            />
          </div>
          <div className="formulario-table-formulario-table-datos">
            <label htmlFor="marca">Marca:</label>
            <input
              type="text"
              id="marca"
              name="marca"
              value={formData.marca}
              onChange={handleEditChange}
              className="formulario-table-input"
              required
            />
          </div>
          <div className="formulario-table-formulario-table-datos">
            <label htmlFor="cantidad_kg">Cantidad kg:</label>
            <input
              type="text"
              id="cantidad_kg"
              name="cantidad_kg"
              value={formData.cantidad_kg}
              onChange={handleEditChange}
              className="formulario-table-input"
              required
            />
          </div>
          <div className="formulario-table-formulario-table-datos">
            <label htmlFor="precio_kg_compra">Precio (kg) Compra:</label>
            <input
              type="text"
              id="precio_kg_compra"
              name="precio_kg_compra"
              value={formData.precio_kg_compra}
              onChange={handleEditChange}
              className="formulario-table-input"
              required
            />
          </div>
          <div className="formulario-table-formulario-table-datos">
            <label htmlFor="precio_kg_venta">Precio (kg) Venta:</label>
            <input
              type="text"
              id="precio_kg_venta"
              name="precio_kg_venta"
              value={formData.precio_kg_venta}
              onChange={handleEditChange}
              className="formulario-table-input"
              required
            />
          </div>
          <div className="formulario-table-field-group">
                        <label htmlFor="fecha_llegada">Fecha de Llegada:</label>
                        <input
                            type="date"
                            id="fecha_llegada"
                            name="fecha_llegada"
                            value={formData.fecha_llegada}
                            onChange={handleEditChange}
                            required
                            className="formulario-table-input"
                        />
                    </div>
                    <div className="formulario-table-field-group">
                        <label htmlFor="fecha_vencimiento">Fecha de Vencimiento:</label>
                        <input
                            type="date"
                            id="fecha_vencimiento"
                            name="fecha_vencimiento"
                            value={formData.fecha_vencimiento}
                            onChange={handleEditChange}
                            required
                            className="formulario-table-input"
                        />
                    </div>
                    <div className="formulario-table-field-group">
            <label htmlFor="categoria">Categoría:</label>
            <select
              id="categoria"
              name="categoria"
              value={formData.categoria}
              onChange={handleEditChange}
              className="formulario-table-input tipo-cuenta-select"
              required
            >
              <option value="">Selecciona una Categoría</option>
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.nombre}>
                  {categoria.nombre}
                </option>
              ))}
            </select>
          </div>
          <div className="formulario-table-form-actions">
            <button type="submit" className="formulario-table-btn-confirm">
              Actualizar
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
      </Modal>

      {/* Modal de Confirmación de Eliminación */}
      <Modal
        isOpen={isDeleteModalOpen}
        onRequestClose={handleDeleteModalClose}
        contentLabel="Confirmar Eliminación"
        ariaHideApp={false}
        className="formulario-table-modal-form-datos"
        overlayClassName="formulario-table-overlay"
      >
        <h2 className="formulario-table-modal-title">Eliminar Producto Cárnico</h2>
        <p>¿Estás seguro de que deseas eliminar este producto cárnico?</p>
        <div className="formulario-table-form-actions">
          <button onClick={confirmDelete} className="formulario-table-btn-confirm">
            Confirmar
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

export default ProductoCarnico;
