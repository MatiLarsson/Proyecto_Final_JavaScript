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



