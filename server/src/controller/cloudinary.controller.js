const express = require("express");
const router = express.Router();
const multer = require("multer");
const CloudinaryService = require("../services/cloudinary.service");

// Configurar Multer (para recibir archivos en la API)
const upload = multer({ dest: "uploads/" });

// Ruta para subir imagen
router.post("/upload", upload.array("image"), async (req, res) => {
    try {
        const result = await CloudinaryService.uploadImage(req.file.path);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ruta para eliminar imagen
router.delete("/delete", async (req, res) => {
    try {
        const { public_id } = req.body;

        if (!public_id) {
            return res.status(400).json({ error: "public_id es requerido" });
        }

        const result = await CloudinaryService.deleteImage(public_id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;