const cloudinary = require("cloudinary").v2;

// Configurar Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImage = async (file) => {
    try {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { resource_type: 'image' },
                (error, result) => {
                    if (error) {
                        console.error('Error al subir la imagen a Cloudinary:', error);
                        reject(new Error('Error al subir la imagen'));
                    } else {
                        resolve(result);
                    }
                }
            );

            // Asegurar que el archivo es un Buffer antes de enviarlo
            const buffer = Buffer.isBuffer(file.buffer) ? file.buffer : Buffer.from(file.buffer);
            uploadStream.end(buffer);
        });
    } catch (error) {
        console.error('Error al subir la imagen a Cloudinary:', error);
        throw new Error('Error al subir la imagen');
    }
};

const deleteImage = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    } catch (error) {
        console.error('Error al eliminar la imagen de Cloudinary:', error);
        throw new Error('Error al eliminar la imagen');
    }
};

module.exports = {
    uploadImage,
    deleteImage,
};
