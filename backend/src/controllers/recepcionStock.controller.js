import { recepcionStockService } from "../services/recepcionStock.service.js";
import { recepcionStockBodyValidation, recepcionStockQueryValidation } from "../validations/recepcionStock.validation.js";
import { handleErrorClient, handleSuccess, handleErrorServer } from "../handlers/responseHandlers.js";

export const recepcionStockController = {
  async crear(req, res) {
    try {
      const { error } = recepcionStockBodyValidation.validate(req.body);
      if (error) {
        return handleErrorClient(res, 400, error.details[0].message);
      }

      const [data, serviceError] = await recepcionStockService.crear(req.body);
      if (serviceError) return res.status(400).json({ error: serviceError });
      return res.status(201).json(data);
    } catch (err) {
      console.error('Error en crear recepción stock:', err);
      return res.status(500).json({ error: "Error interno del servidor" });
    }
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
    const { error } = recepcionStockQueryValidation.validate(req.params);
    if (error) {
      return handleErrorClient(res, 400, error.details[0].message);
    }

    const { id } = req.params;
    const [result, serviceError] = await recepcionStockService.eliminar(id);
    if (serviceError) return res.status(400).json({ error: serviceError });
    return res.status(204).send();
  } catch (err) {
    console.error('Error en eliminar recepción stock:', err);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const actualizarRecepcion = async (req, res) => {
  try {
    const { error: bodyError } = recepcionStockBodyValidation.validate(req.body);
    if (bodyError) {
      return handleErrorClient(res, 400, bodyError.details[0].message);
    }

    const { error: queryError } = recepcionStockQueryValidation.validate(req.params);
    if (queryError) {
      return handleErrorClient(res, 400, queryError.details[0].message);
    }

    const { id } = req.params;
    const [actualizado, serviceError] = await recepcionStockService.actualizar(id, req.body);
    if (serviceError) return res.status(400).json({ error: serviceError });
    return res.status(200).json(actualizado);
  } catch (err) {
    console.error('Error en actualizar recepción stock:', err);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const exportarExcelRecepcionStock = async (req, res) => {
  try {
    const workbook = await recepcionStockService.generarExcelRecepcionStock();

    // Configurar la respuesta para enviar el archivo Excel
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=recepciones-stock.xlsx");

    // Enviar el archivo
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
};