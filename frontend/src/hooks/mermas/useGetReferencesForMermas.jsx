import { useState, useEffect } from "react";
import axiosInstance from "@services/root.service";

const useGetReferencesForMermas = () => {
  const [personal, setPersonal] = useState([]);
  const [productos, setProductos] = useState([]);
  const [subproductos, setSubproductos] = useState([]);
  const [animalCortes, setAnimalCortes] = useState([]);
  const [animalVaras, setAnimalVaras] = useState([]);
  const [recepcionesStock, setRecepcionesStock] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPersonal = async () => {
    try {
      const response = await axiosInstance.get("/personal");
      setPersonal(response.data.data || []);
    } catch (error) {
      console.error("Error al obtener el personal:", error);
    }
  };

  const fetchProductos = async () => {
    try {
      const response = await axiosInstance.get("/productos");
      setProductos(response.data.data || []);
    } catch (error) {
      console.error("Error al obtener los productos:", error);
    }
  };

  const fetchSubproductos = async () => {
    try {
      const response = await axiosInstance.get("/subproductos");
      setSubproductos(response.data.data || []);
    } catch (error) {
      console.error("Error al obtener los subproductos:", error);
    }
  };

  const fetchAnimalCortes = async () => {
    try {
      const response = await axiosInstance.get("/animal-corte");
      setAnimalCortes(response.data.data || []);
    } catch (error) {
      console.error("Error al obtener los cortes de animal:", error);
    }
  };

  const fetchAnimalVaras = async () => {
    try {
      const response = await axiosInstance.get("/animal-vara");
      setAnimalVaras(response.data.data || []);
    } catch (error) {
      console.error("Error al obtener las varas de animal:", error);
    }
  };

  const fetchRecepcionesStock = async () => {
    try {
      const response = await axiosInstance.get("/recepcion-stock");
      setRecepcionesStock(response.data.data || []);
    } catch (error) {
      console.error("Error al obtener las recepciones de stock:", error);
    }
  };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchPersonal(),
        fetchProductos(),
        fetchSubproductos(),
        fetchAnimalCortes(),
        fetchAnimalVaras(),
        fetchRecepcionesStock()
      ]);
    } catch (error) {
      console.error("Error al cargar los datos de referencia:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  return {
    personal,
    productos,
    subproductos,
    animalCortes,
    animalVaras,
    recepcionesStock,
    loading,
    fetchAllData
  };
};

export default useGetReferencesForMermas;
