import api from "./InterceptorService";

async function uploadImageToCloudinary(file) {
    const formData = new FormData();
    formData.append("image", file);

    try {
        const response = await api.post("/cloudinary/upload", formData);
        return response.data.url; // URL de la imagen en Cloudinary
    } catch (error) {
        console.error("Error al subir la imagen:", error);
        throw error;
    }
}

async function deleteImageFromCloudinary(imageUrl) {
    const publicId = imageUrl.split("/").pop().split(".")[0];

    try {
        const response = await api.delete("/cloudinary/delete", {
            data: { public_id: publicId } // Axios usa `data` para el cuerpo en DELETE
        });
        return response.data;
    } catch (error) {
        console.error("Error al eliminar la imagen:", error);
        throw error;
    }
}

export { uploadImageToCloudinary, deleteImageFromCloudinary };
