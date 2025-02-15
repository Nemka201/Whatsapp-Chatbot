const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

async function uploadImageToCloudinary(file) {
    try {
        const result = await cloudinary.uploader.upload(file, {
            folder: process.env.CLOUDINARY_FOLDER
        });
        return result.secure_url;
    } catch (error) {
        console.error('Error al subir la imagen a Cloudinary:', error);
        throw error;
    }
}

async function deleteImageFromCloudinary(imageUrl) {
    try {
        const public_id = imageUrl.split('/').slice(-1)[0]; // Extraer el public_id de la URL
        await cloudinary.uploader.destroy(public_id);
    } catch (error) {
        console.error('Error al eliminar la imagen de Cloudinary:', error);
        throw error;
    }
}
module.exports = {
    uploadImageToCloudinary,
    deleteImageFromCloudinary
};