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
  }
};
