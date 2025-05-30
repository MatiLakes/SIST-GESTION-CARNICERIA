import { deleteControl } from "@services/controlHigiene.service.js";

const useDeleteControl = (fetchControles) => {
  const remove = async (id) => {
    await deleteControl(id);
    if (fetchControles) fetchControles();
  };

  return { remove };
};

export default useDeleteControl;
