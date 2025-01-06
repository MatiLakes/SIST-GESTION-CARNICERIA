import axiosInstance from "./root.service";

// Obtener todos los productos
export const getProductos = async () => {
  try {
    const response = await axiosInstance.get("/productos");
    return response.data;
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    throw error;
  }
};

// Crear un nuevo producto
export const createProducto = async (productoData) => {
  try {
    const response = await axiosInstance.post("/productos", productoData);
    return response.data;
  } catch (error) {
    console.error("Error al crear el producto:", error);
    throw error;
  }
};

/// Filtrar productos por nombre
export const filterProductosByNombre = async (nombre) => {
    try {
      const response = await axiosInstance.get(`/productos/filtrar/nombre/${nombre}`);
      return response.data.data;
    } catch (error) {
      console.error("Error al filtrar los productos por nombre:", error);
      throw error;
    }
  };
  
  // Filtrar productos por marca
  export const filterProductosByMarca = async (nombreMarca) => {
    try {
      const response = await axiosInstance.get(`/productos/filtrar/marca/${nombreMarca}`);
      return response.data.data;
    } catch (error) {
      console.error("Error al filtrar los productos por marca:", error);
      throw error;
    }
  };
  
  // Filtrar productos por tipo
  export const filterProductosByTipo = async (nombreTipo) => {
    try {
      const response = await axiosInstance.get(`/productos/filtrar/tipo/${nombreTipo}`);
      return response.data.data;
    } catch (error) {
      console.error("Error al filtrar los productos por tipo:", error);
      throw error;
    }
  };

// Modificar un producto existente
export const updateProducto = async (id, productoData) => {
  try {
    const response = await axiosInstance.put(`/productos/${id}`, productoData);
    return response.data;
  } catch (error) {
    console.error("Error al modificar el producto:", error);
    throw error;
  }
};

// Eliminar un producto existente
export const deleteProducto = async (id) => {
  try {
    await axiosInstance.delete(`/productos/${id}`);
  } catch (error) {
    console.error("Error al eliminar el producto:", error);
    throw error;
  }
};

export const descargarExcel = async () => {
    try {
      const response = await axiosInstance.get("http://localhost:3050/api/productos/exportar/excel", {
        responseType: "blob", // Necesario para manejar archivos
      });
  
      // Lógica para descargar el archivo
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "productos.xlsx"); // Nombre del archivo
      document.body.appendChild(link);
      link.click();
      link.remove(); // Eliminar el enlace después de usarlo
    } catch (error) {
      console.error("Error al descargar el archivo Excel:", error);
      throw new Error("Error al descargar el archivo Excel");
    }
  };
  
