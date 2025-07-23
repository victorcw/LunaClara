// Asigna evento clic a todos los botones con la clase "comprar" del HTML
let botonesComprar = document.getElementsByClassName('button');
for (let i = 0; i < botonesComprar.length; i++) {
    botonesComprar[i].addEventListener('click', agregarProducto);
}

// Vacía carrito
document.getElementById('vaciar-carrito').addEventListener('click', function () {
    localStorage.removeItem('carrito');
    cargarCarrito();
});

// Agrega productos al carrito
function agregarProducto(event) {
    let producto = {
        id: event.target.getAttribute('data-id'),
        nombre: event.target.getAttribute('data-nombre'),
        precio: event.target.getAttribute('data-precio')
    };

    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito.push(producto);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    cargarCarrito();
}

// Mostrar/ocultar carrito desde el icono
document.getElementById('icono-carrito').addEventListener('click', function (e) {
    e.preventDefault();
    document.getElementById('carrito-menu').classList.toggle('oculto');
});

// Actualiza contador de productos en el ícono
function actualizarContadorCarrito() {
    //const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    //document.getElementById('contador-carrito').textContent = carrito.length;
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    
    // Calcular la suma de las cantidades de productos
    let totalCantidad = carrito.reduce((suma, producto) => suma + producto.cantidad, 0);
    
    // Actualizar el contador en el DOM
    const contadorCarrito = document.getElementById('contador-carrito');
    contadorCarrito.textContent = totalCantidad;
}

function cargarCarrito() {
    const listaCarrito = document.getElementById('lista-carrito');
    const totalCarrito = document.getElementById('total-carrito');

    listaCarrito.innerHTML = '';
    totalCarrito.textContent = '0';

    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    let total = 0;

    carrito.forEach((producto, index) => {
        const li = document.createElement('li');
        li.classList.add('d-flex', 'justify-content-between', 'align-items-center');

        li.innerHTML = `
            <span>${producto.nombre} (x${producto.cantidad}) - $${producto.precio}</span>
            <button class="eliminar-producto btn btn-sm btn-outline-danger" data-index="${index}">
                <i class="fas fa-trash-alt"></i>
            </button>
        `;

        listaCarrito.appendChild(li);
        total += parseFloat(producto.precio) * producto.cantidad || 0; // Multiplicar precio por cantidad
    });

    totalCarrito.textContent = total.toFixed(2);
    actualizarContadorCarrito();

    document.querySelectorAll('.eliminar-producto').forEach(btn => {
        btn.addEventListener('click', function () {
            const index = this.getAttribute('data-index');
            eliminarProducto(index);
        });
    });
}

function eliminarProducto(index) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito.splice(index, 1);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    cargarCarrito();
}

function agregarProducto(event) {
    //let producto = {
    //    id: event.target.getAttribute('data-id'),
    //    nombre: event.target.getAttribute('data-nombre'),
    //    precio: event.target.getAttribute('data-precio')
    //};

    //let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    //carrito.push(producto);
    //localStorage.setItem('carrito', JSON.stringify(carrito));
    //cargarCarrito();
    let productoId = event.target.getAttribute('data-id');
    let productoNombre = event.target.getAttribute('data-nombre');
    let productoPrecio = event.target.getAttribute('data-precio');

    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    // Verificar si el producto ya existe en el carrito
    let productoExistente = carrito.find(producto => producto.id === productoId);

    if (productoExistente) {
        // Si el producto ya existe, incrementar la cantidad
        productoExistente.cantidad += 1;
    } else {
        // Si el producto no existe, agregarlo con cantidad inicial de 1
        let nuevoProducto = {
            id: productoId,
            nombre: productoNombre,
            precio: productoPrecio,
            cantidad: 1
        };
        carrito.push(nuevoProducto);
    }

    // Guardar el carrito actualizado en localStorage
    localStorage.setItem('carrito', JSON.stringify(carrito));
    cargarCarrito();
}

document.addEventListener('DOMContentLoaded', function () {
    let botonesComprar = document.getElementsByClassName('comprar');
    for (let i = 0; i < botonesComprar.length; i++) {
        botonesComprar[i].addEventListener('click', agregarProducto);
    }

    document.getElementById('vaciar-carrito').addEventListener('click', () => {
        localStorage.removeItem('carrito');
        cargarCarrito();
    });

    document.getElementById('btnPagar').addEventListener('click', pagar);

    cargarCarrito(); // Cargar al inicio
});

function pagar() {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    if (carrito.length === 0) {
        alert("El carrito está vacío");
        return;
    }

    let total = 0;
    let cantidadTotal = 0;
    for (let i = 0; i < carrito.length; i++) {
        total += parseFloat(carrito[i].precio) *  carrito[i].cantidad || 0;
        cantidadTotal += carrito[i].cantidad;
    }

    // Guardar datos en sessionStorage
    sessionStorage.setItem('productos', JSON.stringify(carrito));
    sessionStorage.setItem('cantidadTotal', cantidadTotal);
    sessionStorage.setItem('total', total.toFixed(2));
    alert(`Total a pagar: $${total.toFixed(2)}\nCantidad total de productos: ${cantidadTotal}`);
     // Mostrar el modal
    // abrirModal();
    window.location.href = "resumen.html";
}

function abrirModal() {
    const modal = document.getElementById('modalResumen');
    const modalBody = document.getElementById('modalBody');

    // Cargar contenido de resumen.html
    fetch('resumen.html')
        .then(response => response.text())
        .then(html => {
            modalBody.innerHTML = html; // Insertar el contenido en el modal
            modal.style.display = 'flex'; // Mostrar el modal
        })
        .catch(error => console.error('Error al cargar resumen.html:', error));
}

// Cerrar el modal
document.getElementById('closeModal').addEventListener('click', function () {
    document.getElementById('modalResumen').style.display = 'none';
});


// Asignar el evento al botón (cuando el DOM esté listo)
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('btnPagar').addEventListener('click', pagar);
});

document.addEventListener("DOMContentLoaded", function () {
    const productos = JSON.parse(sessionStorage.getItem('productos')) || [];
    const total = sessionStorage.getItem('total') || 0;
    const totalNumerico = parseFloat(total) || 0;
    const totalFormateado = totalNumerico.toFixed(2);

    const resumenDiv = document.getElementById("detalle");

    let resumenTextoHTML = "<h3>Resumen de tu Compra:</h3><br>";

    for (let i = 0; i < productos.length; i++) {
        const productoActual = productos[i]; 
        resumenTextoHTML += `${productoActual.nombre}: $${parseFloat(productoActual.precio).toFixed(2)}<br>`;
    }

    resumenTextoHTML += `<br><strong>Total a pagar: $${totalFormateado}</strong>`;
    resumenDiv.innerHTML = resumenTextoHTML;

    function enviarFormulario(event) {
        event.preventDefault();

        const nombreContacto = document.getElementById('nombre').value.trim();
        const emailContacto = document.getElementById('contactoEmail').value.trim();
        const telefonoContacto = document.getElementById('telefono').value.trim();

        if (!nombreContacto || !emailContacto || !telefonoContacto) {
            alert("Por favor, completa todos los campos de contacto antes de enviar.");
            return;
        }

        let detallesCarritoParaEnvio = '';
        for (let i = 0; i < productos.length; i++) {
            const productoActual = productos[i];
            detallesCarritoParaEnvio += `${productoActual.nombre} - $${parseFloat(productoActual.precio).toFixed(2)}\n`;
        }

        document.getElementById('carritoData').value = detallesCarritoParaEnvio;
        document.getElementById('totalCarrito').value = `$${totalFormateado}`;
        document.getElementById('formulario').submit();
    }

    const botonEnviar = document.getElementById('botonEnviar');
   
    if (botonEnviar) {
        botonEnviar.addEventListener('click', enviarFormulario);
    } else {
        console.warn("ADVERTENCIA: No se encontró el botón con ID 'botonEnviar'.");
    }
});

