// Script para probar en la consola del navegador
// Abre http://localhost:4200 y pega esto en la consola

console.log("🔍 Probando API de productos...");

fetch('http://localhost:9000/producto/api/producto/list', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => {
  console.log("✅ Respuesta del API:", data);
  console.log("📷 URLs de imágenes:", data.dato.map(p => p.url));
})
.catch(error => {
  console.error("❌ Error:", error);
});
