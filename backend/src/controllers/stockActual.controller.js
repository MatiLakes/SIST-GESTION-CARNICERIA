"use strict";

import { stockActualService } from "../services/stockActual.service.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";

export const stockActualController = {
  async obtenerStockActual(req, res) {
    try {
      const [stock, error] = await stockActualService.obtenerStockActual();
      if (error) return handleErrorClient(res, 500, error);

      handleSuccess(res, 200, "Stock actual obtenido correctamente.", stock);
    } catch (error) {
      handleErrorServer(res, 500, error.message);
    }
  },
};

export const exportarExcelStockActual = async (req, res) => {
  try {
    const workbook = await stockActualService.generarExcelStockActual();

    // Configurar la respuesta para enviar el archivo Excel
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=stock-actual.xlsx");

    // Enviar el archivo
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
};
