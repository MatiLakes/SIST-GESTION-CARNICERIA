import axiosInstance from "./root.service";

export const descargarExcel = async (entidad) => {
    try {
        const response = await axiosInstance.get(`/${entidad}/exportar/excel`, {
            responseType: "blob",
        });

        // Lógica para descargar el archivo
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${entidad}.xlsx`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    } catch (error) {
        console.error(`Error al descargar el archivo Excel de ${entidad}:`, error);
        throw new Error(`Error al descargar el archivo Excel de ${entidad}`);
    }
};
