const express = require('express');
const path = require('path');
const app = express();

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'dist/farmacia-dey/browser')));

// Todas las rutas devuelven index.html (para Angular routing)
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, 'dist/farmacia-dey/browser/index.html'));
});

// Puerto dinámico de Render o 8080 por defecto
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
