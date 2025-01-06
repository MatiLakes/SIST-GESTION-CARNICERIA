import { useState, useEffect } from "react";
import { getProductos } from "@services/producto.service.js";

const useGetProductos = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProductos = async () => {
    setLoading(true);
    try {
      const response = await getProductos();
      setProductos(response.data || []);
    } catch (error) {
      console.error("Error al obtener los productos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  return { productos, setProductos, loading, fetchProductos };
};

export default useGetProductos;
