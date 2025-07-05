import { useState } from "react";
import { filterMermasByPersonal } from "@services/merma.service.js";

const useFilterMermasByPersonal = () => {
  const [filteredMermas, setFilteredMermas] = useState([]);
  const [loading, setLoading] = useState(false);

  const filterByPersonal = async (personalId) => {
    setLoading(true);
    try {
      const data = await filterMermasByPersonal(personalId);
      setFilteredMermas(data);
    } catch (error) {
      console.error("Error al filtrar mermas por personal:", error);
    } finally {
      setLoading(false);
    }
  };

  return { filteredMermas, loading, filterByPersonal };
};

export default useFilterMermasByPersonal;
