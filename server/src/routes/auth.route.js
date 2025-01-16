router.get('/protected-route', authenticateToken, (req, res) => {
    // Solo usuarios autenticados pueden acceder a esta ruta
    res.json({ message: 'Welcome ' + req.user.name });
});