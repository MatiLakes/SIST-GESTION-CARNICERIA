import { useState, useEffect } from "react";
import { getDocumentos } from "@services/documentoTrazabilidad.service.js";

const useGetDocumentos = () => {
  const [documentos, setDocumentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDocumentos = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDocumentos();
      console.log("Respuesta de getDocumentos:", data);
      setDocumentos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error al obtener documentos de trazabilidad:", err);
      setError(err.message || "Error al cargar los registros");
      setDocumentos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocumentos();
  }, []);

  return { documentos, loading, error, fetchDocumentos };
};

export default useGetDocumentos;
