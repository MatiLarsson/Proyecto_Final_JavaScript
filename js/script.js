/*
Comentarios sobre el funcionamiento de la tienda:

El carrito del usuario asi como tambien sus datos se almacenan en el local storage.
Al cargar la pagina, js busca en la memoria local si el usuario ya se habia registrado anteriormente y trae su informacion asi como
su carrito en el estado en el que lo dejo.
Se habilita la compra de los productos solo si el usuario ya se encuentra registrado.
Al ir añadiendo productos js lleva un carrito que es pusheado al local Storage inmediatamente luego de cada adición de producto.
Al arrepentirse de compras o al vaciar el carrito el stock de los productos en cuestion es devuelto al stock de la tienda.
Al pagar, se crea un objeto venta y se remueve el stock del/los productos comprados.
Vale mencionar que el stock de los productos los lleva js y no el local storage. Por ello, al recargar la pagina, si hubieren
ocurrido ventas en sesiones anteriores, el stock se renueva nuevamente a default (2 unidades de cada producto).

*/

//  Arrays

let productos = [];
let usuarios = [];
let carritoBackEnd = [];
let ventas = [];

// Variables globales

let total = 0;
let hoy = new Date();
let fechaActual = hoy.getDate() + '/' + (hoy.getMonth() + 1) + '/' + hoy.getFullYear();
let nombreUsuario;
let apellidoUsuario;
let emailUsuario;
let direccionUsuario;
let botonesComprar = document.querySelectorAll('.comprar');
let botonRegistrarmeHeader = document.getElementById('btn_registrarme_header');
let saludoHeader = document.getElementById('saludo');
let botonRegistrarme = document.getElementById('btn_registrarme');
let botonCarrito = document.getElementById('carritoHeader');
let contenidoCarrito = document.getElementById('carrito');
let botonVaciarCarrito = document.getElementById('vaciar');
let botonPagar = document.getElementById('pagar');

// Clases y sus métodos

class Producto {
    constructor(nombre, precio, stock) {
        this.nombre = nombre.toUpperCase();
        this.precio = parseFloat(precio);
        this.stock = parseInt(stock);
        this.idP = Producto.ID;
        Producto.ID++;
    }
    static ID = 0
    sumaIva() {
        this.precio = this.precio * 1.21;
    }
    vender(cantidad) {
        this.stock -= cantidad;
    }
    reponer(cantidad) {
        this.stock += cantidad;
        if (this.stock > 0) {
            const p = document.getElementsByClassName('producto')[productos.indexOf(this)];
            const b = p.children[4];
            b.innerHTML = "comprar";
            b.classList.remove('btn-secondary');
            b.classList.add('btn-primary');
            b.removeAttribute('disabled', "");
        }
    }
}

class Item {
    constructor(idP, cantidad) {
        this.idP = parseInt(idP);
        this.cantidad = parseInt(cantidad);
    }
}

class Usuario {
    constructor(nombre, apellido, email, direccionDeEnvio) {
        this.nombre = nombre.toUpperCase();
        this.apellido = apellido.toUpperCase();
        this.email = email;
        this.direccionDeEnvio = direccionDeEnvio.toUpperCase();
        this.carrito = carritoBackEnd;
        this.idU = Usuario.ID;
        Usuario.ID++
    }
    static ID = 0;
}

class Venta {
    constructor() {
        this.fecha = fechaActual;
        this.carritoBackEnd = carritoBackEnd;
        this.total = total;
        this.usuario = JSON.parse(localStorage.getItem('usuario'));
    }
}

// Funciones:

function mostrar(element) {
    console.log(element);
}

function removeAllChildNodes(padre) {
    while (padre.firstChild) {
        padre.removeChild(padre.firstChild);
    }
}

function displayCarrito() {
    total = 0;
    const cart = document.getElementById('carrito');
    removeAllChildNodes(cart);
    const titulo = document.createElement('p');
    if (carritoBackEnd.length > 0) {
        titulo.innerHTML = `Tu carrito contiene:`
        cart.appendChild(titulo);
        const ul = document.createElement('ul');
        cart.appendChild(ul);
        for (let item of carritoBackEnd) {
            for (let producto of productos) {
                if (producto.idP === item.idP) {
                    let sumatoriaItem = item.cantidad * producto.precio;
                    total += sumatoriaItem;
                    const li = document.createElement('li');
                    li.innerHTML = `${producto.nombre}: ${item.cantidad} x USD${producto.precio} = USD${sumatoriaItem}`;
                    ul.appendChild(li);
                }
            }
        }
        const suma = document.createElement('p');
        suma.innerHTML = `Total del carrito: USD ${total}`;
        cart.appendChild(suma);
    } else {
        titulo.innerHTML = `Tu carrito está vacío.`
        cart.appendChild(titulo);
    }
}

function pullCarrito() {
    if (registrado()) {
        carritoBackEnd = JSON.parse(localStorage.getItem('usuario')).carrito;
        if (carritoBackEnd.length > 0) {
            for (const item of carritoBackEnd) {
                if (productos.find(obj => obj.idP === item.idP)) {
                    const p = productos.find(obj => obj.idP === item.idP);
                    p.vender(item.cantidad);
                }
            }
        }
        updateBuyButtons();
    }
}

function pushCarrito() {
    user = JSON.parse(localStorage.getItem('usuario'));
    user.carrito = carritoBackEnd;
    localStorage.setItem('usuario', JSON.stringify(user));
}

function updateBuyButtons() {
    for (const producto of productos) {
        const buyButton = document.getElementsByClassName('producto')[productos.indexOf(producto)].children[4];
        if (producto.stock > 0) {
            if (buyButton.hasAttribute('disabled')) {
                buyButton.innerHTML = "comprar";
                buyButton.classList.add('btn-primary');
                buyButton.classList.remove('btn-secondary');
                buyButton.removeAttribute('disabled');
            }
        } else {
            if (!(buyButton.hasAttribute('disabled'))) {
                buyButton.innerHTML = "sin stock";
                buyButton.classList.remove('btn-primary');
                buyButton.classList.add('btn-secondary');
                buyButton.setAttribute('disabled', "");
            }
        }
    }
}

function registrado() {
    if (JSON.parse(localStorage.getItem('usuario')) != null && JSON.parse(localStorage.getItem('usuario')).length != 0) {
        return true;
    } else {
        return false;
    }
}

function desactivarRegistro() {
    if (registrado()) {
        if (!(botonRegistrarmeHeader.classList.contains('d-none'))) {
            botonRegistrarmeHeader.classList.add('d-none');
        }
    }
}

function displaySaludo() {
    if (registrado()) {
        const name = JSON.parse(localStorage.getItem(('usuario'))).nombre;
        const surname = JSON.parse(localStorage.getItem(('usuario'))).apellido;
        saludoHeader.children[0].innerHTML = `Bienvenido ${name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()} ${surname.charAt(0).toUpperCase() + surname.slice(1).toLowerCase()}`;
        if (saludoHeader.classList.contains('d-none')) {
            saludoHeader.classList.remove('d-none');
        }
    }
}

function activarCarrito() {
    if (registrado()) {
        if (botonVaciarCarrito.classList.contains('d-none')) {
            botonVaciarCarrito.classList.remove('d-none');
        }
        if (botonPagar.classList.contains('d-none')) {
            botonPagar.classList.remove('d-none');
        }
    }
}

function checkUser() {
    if (registrado()) {
        desactivarRegistro();
        displaySaludo();
        pullCarrito();
        activarCarrito();
    }
}

function add(nombre, precio, cantidad) {
    productos.push(new Producto(nombre, precio, cantidad));
    productos[productos.length - 1].sumaIva();
    updateBuyButtons();
}

// Carga de productos a la tienda (backend):

add("macbook pro", 2299, 2);
add("macbook air", 1449, 2);
add("imac", 2999, 2);
add("iphone 13 pro max", 1299, 2);
add("iphone 13 pro", 1199, 2);
add("iphone 13", 999, 2);
add("iphone 12", 899, 2);
add("iphone SE", 499, 2);
add("iphone 11", 549, 2);

// Event listeners:

document.getElementById('inp_nombre').onblur = () => {nombreUsuario = document.getElementById('inp_nombre').value};
document.getElementById('inp_apellido').onblur = () => {apellidoUsuario = document.getElementById('inp_apellido').value};
document.getElementById('inp_email').onblur = () => {emailUsuario = document.getElementById('inp_email').value};
document.getElementById('inp_direccion').onblur = () => {direccionUsuario = document.getElementById('inp_direccion').value};

botonRegistrarmeHeader.onclick = () => {
    document.getElementById('inp_nombre').value = "";
    document.getElementById('inp_apellido').value = "";
    document.getElementById('inp_email').value = "";
    document.getElementById('inp_direccion').value = "";
}

botonRegistrarme.onclick = () => {
    usuarios.push(new Usuario(nombreUsuario, apellidoUsuario, emailUsuario, direccionUsuario));
    localStorage.setItem('usuario', JSON.stringify(usuarios[usuarios.length - 1]));
    checkUser();
}

botonesComprar.forEach(botonComprar => {
    botonComprar.addEventListener('click', () => {
        if (registrado()) {
            const nombreDelProductoAgregado = botonComprar.parentNode.children[1].innerHTML.toUpperCase();
            const productoAgregado = productos.find(obj => obj.nombre === nombreDelProductoAgregado);
            const codigo = productoAgregado.idP;
            carritoBackEnd.push(new Item(codigo, 1));
            if (!confirm(`Se ha agregado 1 unidad de ${productoAgregado.nombre} a su carrito de compras. "ACEPTAR" para confirmar, "CANCELAR" para anular.`)) {
                carritoBackEnd.pop(carritoBackEnd[carritoBackEnd.length - 1]);
            } else {
                productoAgregado.vender(1);
                alert(`Se ha removido 1 unidad del stock del producto ${productoAgregado.nombre}.`);
                updateBuyButtons();
                pushCarrito();
            }
        } else {
            alert('¡Primero debes registrarte!');
        }
    });
});

botonCarrito.onclick = () => {
    if (registrado()) {
        displayCarrito();
    }
}

botonPagar.onclick = () => {
    if (carritoBackEnd.length > 0) {
        alert(`Se debitará un total de USD ${total} de su tarjeta`);
        alert("Su carrito ya fué abonado con éxito ¡Gracias por comprar en nuestra tienda!");
        ventas.push(new Venta());
        carritoBackEnd = [];
        pushCarrito();
        displayCarrito();
    } else {
        alert ("Usted no tiene nada en su carrito.");
    }
}

botonVaciarCarrito.onclick = () => {
    if (carritoBackEnd.length > 0) {
        for (const item of carritoBackEnd) {
            if (productos.find(obj => obj.idP === item.idP)) {
                const p = productos.find(obj => obj.idP === item.idP);
                p.reponer(item.cantidad);
            }
        }
    }
    carritoBackEnd = [];
    pushCarrito();
    updateBuyButtons();
    displayCarrito();
}

// Script que se corre al cargar la página inicialmente:

checkUser();
pullCarrito();