import { deleteDocumento } from "@services/documentoTrazabilidad.service.js";

const useDeleteDocumento = (fetchDocumentos) => {
  const remove = async (id) => {
    await deleteDocumento(id);
    if (fetchDocumentos) fetchDocumentos();
  };

  return { remove };
};

export default useDeleteDocumento;
