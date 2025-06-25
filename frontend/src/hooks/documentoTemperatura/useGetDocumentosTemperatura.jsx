import { useState, useEffect } from "react";
import { getDocumentosTemperatura } from "@services/documentoTemperatura.service.js";

const useGetDocumentosTemperatura = () => {
  const [documentos, setDocumentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDocumentos = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDocumentosTemperatura();
      console.log("Respuesta de getDocumentosTemperatura:", data);
      setDocumentos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error al obtener documentos de temperatura:", err);
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

export default useGetDocumentosTemperatura;
