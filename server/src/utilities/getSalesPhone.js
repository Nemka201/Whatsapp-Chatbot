let numerosTemporales = [];

router.get('/obtener-telefono', async (req, res) => {
    try {
        // Si la lista temporal está vacía, recárgala desde la base de datos
        if (numerosTemporales.length === 0) {
            const telefonos = await Telefono.find();
            if (telefonos.length === 0) {
                return res.status(404).json({ mensaje: 'No hay teléfonos en la base de datos' });
            }
            numerosTemporales = telefonos.map((t) => t.numero); // Recarga la lista
        }

        // Escoge un número aleatorio de la lista temporal
        const indice = Math.floor(Math.random() * numerosTemporales.length);
        const numeroSeleccionado = numerosTemporales[indice];

        // Elimina el número seleccionado de la lista temporal
        numerosTemporales.splice(indice, 1);

        // Devuelve el número seleccionado
        res.json({ numero: numeroSeleccionado });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener teléfonos', error });
    }
});
