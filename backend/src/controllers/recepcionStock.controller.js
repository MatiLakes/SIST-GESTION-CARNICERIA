import { recepcionStockService } from "../services/recepcionStock.service.js";

export const recepcionStockController = {
  async crear(req, res) {
    const [data, error] = await recepcionStockService.crear(req.body);
    if (error) return res.status(400).json({ error });
    return res.status(201).json(data);
  },

  async obtenerTodas(req, res) {
    try {
      const [data, error] = await recepcionStockService.obtenerTodas();
      if (error) return res.status(500).json({ error, success: false });
      
      // Verificar si hay datos y son un array
      if (!data || !Array.isArray(data)) {
        // Devolver un array vacío si los datos no son válidos
        return res.json({ data: [], success: true });
      }
      
      // Verificar cada elemento para asegurarse de que tenga la estructura correcta
      const dataValidated = data.map(item => {
        if (!item.producto || typeof item.producto !== 'object') {
          return {
            ...item,
            producto: { nombre: "Producto no disponible", variante: "" }
          };
        }
        return item;
      });
      
      // Formato consistente con otras respuestas de la API
      return res.json({ data: dataValidated, success: true, count: dataValidated.length });
    } catch(e) {
      console.error("Error al obtener recepciones de stock:", e);
      return res.status(500).json({ error: "Error interno del servidor", success: false });
    }
  },
}
export const eliminarRecepcion = async (req, res) => {
  try {
    const { id } = req.params;
    const [result, error] = await recepcionStockService.eliminar(id);
    if (error) return res.status(400).json({ error });
    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({ error: "Error del servidor" });
  }
};

export const actualizarRecepcion = async (req, res) => {
  try {
    const { id } = req.params;
    const [actualizado, error] = await recepcionStockService.actualizar(id, req.body);
    if (error) return res.status(400).json({ error });
    return res.status(200).json(actualizado);
  } catch (err) {
    return res.status(500).json({ error: "Error del servidor" });
  }
};

