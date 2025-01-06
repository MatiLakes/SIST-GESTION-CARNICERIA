import { deleteSubproductoService } from "@services/subproductos.service";
import Swal from "sweetalert2";

const useDeleteSubproducto = (fetchSubproductos) => {
  const remove = async (id) => {
    try {
      const [message, error] = await deleteSubproductoService(id);
      if (error) {
        Swal.fire("Error", error, "error");
      } else {
        fetchSubproductos();
        Swal.fire("Éxito", message, "success");
      }
    } catch (err) {
      Swal.fire("Error", "No se pudo eliminar el subproducto", "error");
    }
  };

  return { remove };
};

export default useDeleteSubproducto;
