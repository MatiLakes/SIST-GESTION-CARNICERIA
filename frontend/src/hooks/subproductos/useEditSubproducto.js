import { updateSubproductoService } from "@services/subproductos.service";
import Swal from "sweetalert2";

const useEditSubproducto = (fetchSubproductos) => {
  const edit = async (id, subproductoData) => {
    try {
      const [updatedSubproducto, error] = await updateSubproductoService(id, subproductoData);
      if (error) {
        Swal.fire("Error", error, "error");
      } else {
        fetchSubproductos();
        Swal.fire("Éxito", "Subproducto actualizado con éxito", "success");
      }
    } catch (err) {
      Swal.fire("Error", "No se pudo actualizar el subproducto", "error");
    }
  };

  return { edit };
};

export default useEditSubproducto;
