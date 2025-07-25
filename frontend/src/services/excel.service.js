import axiosInstance from "./root.service";

export const descargarExcel = async (entidad) => {
    try {
        let endpoint;
        
        // Determinar el endpoint correcto según la entidad
        if (entidad === "productos" || entidad === "control-higiene") {
            endpoint = `/${entidad}/exportar/excel`;
        } else if (entidad === "documentos-trazabilidad" || entidad === "documentos-temperatura") {
            endpoint = `/${entidad}/excel`;
        } else {
            // Default para otras entidades
            endpoint = `/${entidad}/excel`;
        }
        
        const response = await axiosInstance.get(endpoint, {
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
