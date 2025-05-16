import { useState, useEffect } from "react";
import { getAllSubproductosService } from "@services/subproductos.service";

const useGetSubproductos = () => {
  const [subproductos, setSubproductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSubproductos = async () => {
    setLoading(true);
    const [data, error] = await getAllSubproductosService();
    if (error) setError(error);
    else setSubproductos(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchSubproductos();
  }, []);

  return { subproductos, loading, error, fetchSubproductos };
};

export default useGetSubproductos;
