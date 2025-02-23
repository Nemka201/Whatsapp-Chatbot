async function uploadImageToCloudinary(file) {
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch("http://localhost:3000/api/cloudinary/upload", {
        method: "POST",
        body: formData,
    });

    const data = await response.json();
    return data.url; // URL de la imagen en Cloudinary
}
async function deleteImageFromCloudinary(imageUrl) {
    const publicId = imageUrl.split("/").pop().split(".")[0];
    const response = await fetch("http://localhost:3000/api/cloudinary/delete", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ public_id: publicId }),
    });

    const data = await response.json();
    return data;
}

module.exports = {
    uploadImageToCloudinary,
    deleteImageFromCloudinary
};