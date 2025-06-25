import { documentoTrazabilidadService } from "../services/documentoTrazabilidad.service.js";

export const documentoTrazabilidadController = {
  async crear(req, res) {
    const [doc, error] = await documentoTrazabilidadService.crear(req.body);
    if (error) return res.status(400).json({ error });
    res.status(201).json(doc);
  },

  async obtenerTodos(req, res) {
    const [docs, error] = await documentoTrazabilidadService.obtenerTodos();
    if (error) return res.status(500).json({ error });
    res.json(docs);
  },

  async actualizar(req, res) {
    const { id } = req.params;
    const [doc, error] = await documentoTrazabilidadService.actualizar(parseInt(id), req.body);
    if (error) return res.status(400).json({ error });
    res.json(doc);
  },

  async eliminar(req, res) {
    const { id } = req.params;
    const [_, error] = await documentoTrazabilidadService.eliminar(parseInt(id));
    if (error) return res.status(400).json({ error });
    res.json({ mensaje: "Documento eliminado correctamente" });
  },

  async agregarRegistro(req, res) {
    const { id } = req.params;
    const [registro, error] = await documentoTrazabilidadService.agregarRegistro(parseInt(id), req.body);
    if (error) return res.status(400).json({ error });
    res.status(201).json(registro);
  },

  async actualizarRegistro(req, res) {
    const { id, registroId } = req.params;
    const [registro, error] = await documentoTrazabilidadService.actualizarRegistro(
      parseInt(id), 
      parseInt(registroId), 
      req.body
    );
    if (error) return res.status(400).json({ error });
    res.json(registro);
  },

  async eliminarRegistro(req, res) {
    const { id, registroId } = req.params;
    const [_, error] = await documentoTrazabilidadService.eliminarRegistro(
      parseInt(id), 
      parseInt(registroId)
    );
    if (error) return res.status(400).json({ error });
    res.json({ mensaje: "Registro eliminado correctamente" });
  }
};
