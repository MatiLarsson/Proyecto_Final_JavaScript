/* Descripción del proyecto:

- Se implementa una tienda virtual de productos apple utilizando el framework bootstrap, javascript nativo y JQuery.
- Se pude añadir productos al carrito de manera anónima o registrado. Al querer terminar el proceso de compra se requerirá al usuario
que se registre y luego proceda a pagar.
- Los datos de usuario, ya sea éste anónimo o registrado previamente se llevan en el local storage. Al cargar la página se recuperan los
mismos si es que existen. Si no existe info previa de algún usuario, se generará un usuario anónimo, el cual podrá reescribirse luego al
registrarse (los datos de carrito y de historial de compras no se pierden).
- En cualquier momento se puede reescribir los datos de usuario clickeando en el nombre de usuario en el encabezado.
- El botón con ícono de carrito lleva un contador de productos "en carrito".
- El carrito cuenta con funcionalidades de "Vaciar carrito" y "Eliminación del grupo un mismo producto", y "modificacion de la cantidad"
de un determinado producto con los iconos + y -.
- Al terminar una compra, los datos de la misma se guardan en un historial de compras creado para el usuario actual. El mismo y su detalle
de cada uno de los productos puede verse en la modal que se ejectua al clickear sobre el botón "Mis compras" en el encabezado.
- Se implementan llamadas GET y POST en:
Archivo main.js linea 61 (GET)
Archivo logEvents.js linea 112 (POST)
Archivo shopEvents.js línea 28 (POST)
*/

// Variables globales:
let productos = [];
let usuarios = [];
let carritoBackEnd = [];
let ventas = [];
let misCompras = []
let total = 0;
let hoy = new Date();
let fechaActual = hoy.getDate() + '/' + (hoy.getMonth() + 1) + '/' + hoy.getFullYear();
let nombreUsuario = "";
let apellidoUsuario = "";
let emailUsuario = "";
let direccionUsuario = "";
let botonRegistrarmeHeader = document.getElementById('btn_registrarme_header');
let saludoHeader = document.getElementById('saludo');
let botonRegistrarme = document.getElementById('btn_registrarme');
let botonCambiarUsuario = document.getElementById('btn_changeUser');
let botonCarrito = document.getElementById('carritoHeader');
let botonCartFocus = document.getElementById('cartFocus');
let contenidoCarrito = document.getElementById('carrito');
let botonVaciarCarrito = document.getElementById('vaciar');
let botonIrAPagar = document.getElementById('pagar_1');
let botonPagar = document.getElementById('pagar_2');
let botonVolverAlCarrito = document.getElementById('volverAlCarrito');
let formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});
let minusButtons = HTMLCollection;
let plusButtons = HTMLCollection;
let trashButtons = HTMLCollection;
let botonesComprar = HTMLCollection;
let nombresDeProductos = HTMLCollection;
let detailButtons = HTMLCollection;
let divErrorName = document.getElementById('inp_errorName');
let divErrorSurname = document.getElementById('inp_errorSurname');
let divErrorEmail = document.getElementById('inp_errorEmail');
let divErrorAdress = document.getElementById('inp_errorAdress');

// Al conseguir los datos con método GET:
$.getJSON('../json/productos.json', function (data) {
    data.forEach(elemento => productos.push(new Producto(elemento.nombre, elemento.precio, elemento.stock, elemento.thumbnail, elemento.img1, elemento.img2, elemento.categoria, elemento.descripcion)));
    mostrarProductos();
    checkUser();
    updateBotonMisCompras();
    comprar();
    detalleDeProductos();
})



