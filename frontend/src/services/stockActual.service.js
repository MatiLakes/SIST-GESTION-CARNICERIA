import axios from "@services/root.service.js";

// Obtener el stock actual consolidado
export async function getStockActual() {
  try {
    const response = await axios.get("/stock-actual");
    return [response.data.data, null];
  } catch (error) {
    return [null, error.response?.data || error.message];
  }
}
