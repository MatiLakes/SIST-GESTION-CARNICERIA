import { useState } from "react";
import { filterMermasByTipo } from "@services/merma.service.js";

const useFilterMermasByTipo = () => {
  const [filteredMermas, setFilteredMermas] = useState([]);
  const [loading, setLoading] = useState(false);

  const filterByTipo = async (tipo) => {
    setLoading(true);
    try {
      const data = await filterMermasByTipo(tipo);
      setFilteredMermas(data);
    } catch (error) {
      console.error("Error al filtrar mermas por tipo:", error);
    } finally {
      setLoading(false);
    }
  };

  return { filteredMermas, loading, filterByTipo };
};

export default useFilterMermasByTipo;
