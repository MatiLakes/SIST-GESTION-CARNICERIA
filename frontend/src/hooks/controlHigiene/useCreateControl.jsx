import { createControl } from "@services/controlHigiene.service.js";

const useCreateControl = (fetchControles) => {
  const create = async (data) => {
    const res = await createControl(data);
    if (fetchControles) fetchControles();
    return res;
  };

  return { create };
};

export default useCreateControl;
