let currentIndex = 1;
const reseñas = document.querySelectorAll('.reseniaAPI');

function mostrarSiguienteReseña() {
  // Oculta la reseña actual
  reseñas[currentIndex].classList.remove('active');
  
  // Calcula el índice de la siguiente reseña
  currentIndex = (currentIndex + 1) % reseñas.length;
  
  // Muestra la siguiente reseña
  reseñas[currentIndex].classList.add('active');
}

function traer() {

    const contenido = document.getElementById("contenido"); // Selecciona el id="contenido" del html
   
    fetch('https://randomuser.me/api') // Llamada a la API
        .then(res => res.json()) // Convierte la respuesta de la API a JSON (objeto)
        .then(res => {
            console.log(res); // Mostrar toda la respuesta en consola.
            console.log(res.results[0].email); // Mostrar solo el email en consola.

            // Crear el contenido dinámicamente
            contenido.innerHTML = `
                <img src="${res.results[0].picture.large}" width="150px" class="img-fluid rounded-circle">
                <p>Nombre: ${res.results[0].name.first}</p>
                <p>Email: ${res.results[0].email}</p>
                <p>País: ${res.results[0].location.country}</p>
            `;
        })
        .catch(error => console.error('Error al obtener los datos:', error)); // Manejo de errores
}


setInterval(traer, 5000);   