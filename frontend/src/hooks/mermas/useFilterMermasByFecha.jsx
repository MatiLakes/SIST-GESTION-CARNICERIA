import { useState } from "react";
import { filterMermasByFecha } from "@services/merma.service.js";

const useFilterMermasByFecha = () => {
  const [filteredMermas, setFilteredMermas] = useState([]);
  const [loading, setLoading] = useState(false);

  const filterByFecha = async (fechaInicio, fechaFin) => {
    setLoading(true);
    try {
      const data = await filterMermasByFecha(fechaInicio, fechaFin);
      setFilteredMermas(data);
    } catch (error) {
      console.error("Error al filtrar mermas por fecha:", error);
    } finally {
      setLoading(false);
    }
  };

  return { filteredMermas, loading, filterByFecha };
};

export default useFilterMermasByFecha;
