import { updateControl } from "@services/controlHigiene.service.js";

const useEditControl = (fetchControles) => {
  const edit = async (id, data) => {
    const res = await updateControl(id, data);
    if (fetchControles) fetchControles();
    return res;
  };

  return { edit };
};

export default useEditControl;
