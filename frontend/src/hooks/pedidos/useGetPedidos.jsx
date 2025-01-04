import { useState, useEffect } from "react";
import { getPedidos } from "@services/pedido.service.js";

const useGetPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPedidos = async () => {
    setLoading(true);
    try {
      const response = await getPedidos();
      console.log("Respuesta completa de la API:", response); // Para depurar
      if (response?.data) {
        setPedidos(response.data); // Accede a la propiedad `data`
      } else {
        console.error("Formato de respuesta inesperado:", response);
      }
    } catch (error) {
      console.error("Error al obtener los pedidos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPedidos();
  }, []);

  return { pedidos, loading, fetchPedidos };
};

export default useGetPedidos;
