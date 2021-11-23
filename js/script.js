//  Se crea el arrary de productos
let productos = [];
// Se crea el array de usuarios de la tienda
let usuarios = [];
// Se crea un array con los items cargados en el Carrito
let itemsEnCarrito = [];
// Se crea el array de ventas para llevar un registro de las mismas
let ventas = [];
// Se crean las variables y constantes globales
let total = 0;
let hoy = new Date();
let fechaActual = hoy.getDate() + '/' + (hoy.getMonth() + 1) + '/' + hoy.getFullYear();
// Se crea la función para imprimir en consoola
function mostrar(elemento) {
    console.log(elemento);
}
// Se crea la función para calcular el total a pagar
function calcularCarrito() {
    for (let item of itemsEnCarrito) {
        for (let producto of productos) {
            if (producto.idP === item.idP) {
                let sumatoriaItem = item.cantidad * producto.precio;
                total += sumatoriaItem;
                console.log(`Producto código: ${producto.idP} ===> ${item.cantidad} unidades x USD ${producto.precio} = USD ${sumatoriaItem}`);
            }
        }
    }
    mostrar('---------------------------------------');
    console.log(`Total del carrito USD ${total}`);
    mostrar('---------------------------------------');
}
// Se crea la función para mantener acutalizado el stock luego de una compra
function actualizarStock() {
    console.log("Actualización de stock:")
    for (let item of itemsEnCarrito) {
        for (let producto of productos) {
            if (producto.idP === item.idP) {
                producto.vender(item.cantidad);
                console.log(`Se han removido ${item.cantidad} unidades del stock del producto código: ${producto.idP}.`);
            }
        }
    }
    for (const producto of productos) {
        if (producto.stock === 0) {
            const p = document.getElementsByClassName('producto')[productos.indexOf(producto)];
            p.children[4].innerHTML = "sin stock";
            p.children[4].classList.remove('btn-primary');
            p.children[4].classList.add('btn-secondary');
            p.children[4].setAttribute('disabled', "");
        }
    }
}
// Se crean las clases del sitio y sus métodos
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
class Usuario {
    constructor(nombre, apellido, email, direccionDeEnvio) {
        this.nombre = nombre.toUpperCase();
        this.apellido = apellido.toUpperCase();
        this.email = email;
        this.direccionDeEnvio = direccionDeEnvio.toUpperCase();
        this.carrito = itemsEnCarrito;
        this.idU = Usuario.ID;
        Usuario.ID++
    }
    static ID = 0;
}
class Item {
    constructor(idP, cantidad) {
        this.idP = parseInt(idP);
        this.cantidad = parseInt(cantidad);
    }
}
class Venta {
    constructor() {
        this.fecha = fechaActual;
        this.itemsEnCarrito = itemsEnCarrito;
        this.total = total;
        this.usuario = JSON.parse(localStorage.getItem('usuario'));
    }
}
// Se crea una función para cargar un nuevo usuario y almacenarlo en el array de usuarios[]
function checkUsuario() {
    if (JSON.parse(localStorage.getItem('usuario')) === null) {
        confirm ("¡Bienvenidos a nuestra tienda online!");
        confirm ("Antes que nada, te pediremos algunos datos...");
        const nombreUsuario = prompt("Ingrese nombre: ");
        const apellidoUsuario = prompt("Ingrese apellido: ");
        const emailUsuario = prompt("Ingrese su email: ");
        const direccionUsuario = prompt("Ingrese su dirección para envíos: ");
        usuarios.push(new Usuario(nombreUsuario, apellidoUsuario, emailUsuario, direccionUsuario));
        localStorage.setItem('usuario', JSON.stringify(usuarios[usuarios.length - 1]));
    } else {
        usuarios.push(JSON.parse(localStorage.getItem('usuario')));
        alert(`Bienvenido de regreso ${JSON.parse(localStorage.getItem('usuario')).nombre} ${JSON.parse(localStorage.getItem('usuario')).apellido}`);
    }
}
// Se crea una función para verificar si el usuario dejó un carrito
function checkCarrito() {
    if (JSON.parse(localStorage.getItem('usuario')).carrito.length > 0) {
        itemsEnCarrito = JSON.parse(localStorage.getItem('usuario')).carrito;
        calcularCarrito();
        if (!confirm('Vemos que dejaste productos en tu carrito en tu última visita. (Abre tu consola) ¿Deseas retomarlo?')) {
            alert("De acuerdo, vaciaremos tu carrito y comenzaremos de nuevo.");
            itemsEnCarrito = [];
            const idUWeb = JSON.parse(localStorage.getItem('usuario')).idU;
            usuarios[idUWeb].carrito = itemsEnCarrito;
            localStorage.setItem('usuario', JSON.stringify(usuarios[idUWeb]));
        } else {
            alert("De acuerdo, lo retomaremos...");
        }
    } else {
        alert("A continuación comenzaremos con tu compra.");
    }
}
// Se crea una función para iniciar un proceso interactivo de compra (adición de productos al carrito)
function shop() {
    do {
        let codigo = parseInt(prompt("Ingrese el código del producto que quiere agregar a su carrito: "));
        let cantidad = parseInt(prompt(`Ingrese cantidad del producto ${codigo} que quiere comprar: `));
        itemsEnCarrito.push(new Item(codigo, cantidad));
        if (!confirm(`Se han agregado ${cantidad} unidades de producto ${codigo} a su carrito de compras. "ACEPTAR" para confirmar, "CANCELAR" para anular.`)) {
            itemsEnCarrito.pop(itemsEnCarrito[itemsEnCarrito.length - 1]);
        }
    } while (confirm("¿Desea continuar comprando?"));
    const idUWeb = JSON.parse(localStorage.getItem('usuario')).idU;
    usuarios[idUWeb].carrito = itemsEnCarrito;
    localStorage.setItem('usuario', JSON.stringify(usuarios[idUWeb]));
}
// Se crea un algoritmo para el checkout
function checkOut() {
    if (total > 0) {
        if (!confirm("Click en 'Aceptar' para pagar, o en 'Cancelar' para suspender la compra.")) {
            mostrar("Lamentamos que se haya arrepentido. Puede volver cuando quiera.");
        } else {
            alert(`Se debitará un total de USD ${total} de su tarjeta`);
            mostrar("Su carrito ya fué abonado con éxito.");
            mostrar('---------------------------------------');
            actualizarStock();
            ventas.push(new Venta());
            itemsEnCarrito = [];
            const idUWeb = JSON.parse(localStorage.getItem('usuario')).idU;
            usuarios[idUWeb].carrito = itemsEnCarrito;
            localStorage.setItem('usuario', JSON.stringify(usuarios[idUWeb]));
            mostrar('---------------------------------------');
            mostrar("¡Gracias por comprar en nuestra tienda!");
        }
    } else {
        mostrar("Su carrito está vacío.");
    }
}
// Se crea la función para agregar inicialmente productos a la tienda
function add(nombre, precio, cantidad) {
    productos.push(new Producto(nombre, precio, cantidad));
    productos[productos.length - 1].sumaIva();
    if (productos[productos.length - 1].stock > 0) {
        const p = document.getElementsByClassName('producto')[productos.indexOf(productos[productos.length - 1])];
        const b = p.children[4];
        b.innerHTML = "comprar";
        b.classList.remove('btn-secondary');
        b.classList.add('btn-primary');
        b.removeAttribute('disabled', "");
    } else {
        const p = document.getElementsByClassName('producto')[productos.indexOf(producto)];
        p.children[4].innerHTML = "sin stock";
        p.children[4].classList.remove('btn-primary');
        p.children[4].classList.add('btn-secondary');
        p.children[4].setAttribute('disabled', "");
    }
}
// Se agragan los productos de la tienda
add("macbook pro", 2299, 10);
add("macbook air", 1449, 10);
add("imac", 2999, 10);
add("iphone 13 pro max", 1299, 10);
add("iphone 13 pro", 1199, 10);
add("iphone 13", 999, 10);
add("iphone 12", 899, 10);
add("iphone SE", 499, 10);
add("iphone 11", 549, 10);
// Se verifica si es la primera vez que el usuario se loguea
checkUsuario();
// Se verifica la preexistencia de un carrito
checkCarrito();
// Se agregan items al carrito
shop();
// Se muestra el carrito
alert("Abra su consola para corroborar los productos en su carrito.");
mostrar("Su carrito contiene: ");
calcularCarrito();
// Se finaliza el proceso de compra
checkOut();