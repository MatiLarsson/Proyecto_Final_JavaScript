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
    console.log(`Total del carrito USD ${total}`);
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
// Se crea una función para cargar un nuevo usuario y almacenarlo en el array de usuarios[]
function nuevoUsuario() {
    const nombreUsuario = prompt("Ingrese nombre: ");
    const apellidoUsuario = prompt("Ingrese apellido: ");
    const emailUsuario = prompt("Ingrese su email: ");
    const direccionUsuario = prompt("Ingrese su dirección para envíos: ");
    usuarios.push(new Usuario(nombreUsuario, apellidoUsuario, emailUsuario, direccionUsuario));
}
class Item {
    constructor(idP, cantidad) {
        this.idP = parseInt(idP);
        this.cantidad = parseInt(cantidad);
    }
    agregar(item) {
        this.itemsEnCarrito.push(item);
    }
    quitar(item) {
        this.itemsEnCarrito.pop(item);
    }
}
class Venta {
    constructor() {
        this.fecha = fechaActual;
        this.itemsEnCarrito = itemsEnCarrito;
        this.total = total;
        this.usuario = usuarios[usuarios.length - 1];
    }
}
// Se crea la función para agregar inicialmente productos a la tienda
function add(nombre, precio, cantidad) {
    productos.push(new Producto(nombre, precio, cantidad));
    productos[productos.length - 1].sumaIva();
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
// Comienzo de interacción con el usuario
confirm ("¡Bienvenidos a nuestra tienda online!");
confirm ("Antes que nada, te pediremos algunos datos...");
// Se crea un nuevo usuario al cargar el sitio y se lo carga como objeto en el array usuarios []
nuevoUsuario();
confirm ("A continuación podrás agregar productos al carrito y solicitar el envío a tu domicilio.");
confirm ("Vamos a iniciar tu pedido...");
do {
    let codigo = parseInt(prompt("Ingrese el código del producto que quiere agregar a su carrito: "));
    let cantidad = parseInt(prompt(`Ingrese cantidad del producto ${codigo} que quiere comprar: `));
    itemsEnCarrito.push(new Item(codigo, cantidad));
    if (!confirm(`Se han agregado ${cantidad} unidades de producto ${codigo} a su carrito de compras. "ACEPTAR" para confirmar, "CANCELAR" para anular.`)) {
        itemsEnCarrito.quitar(itemsEnCarrito[itemsEnCarrito.length - 1]);
    }
} while (confirm("¿Desea continuar comprando?"));
alert("Abra su consola para corroborar los productos en su carrito.");
mostrar("Su carrito contiene: ");
calcularCarrito();
if (!confirm("Click en 'Aceptar' para pagar, o en 'Cancelar' para eliminar todos los items del carrito.")) {
    itemsEnCarrito.splice();
    mostrar("Lamentamos que se haya arrepentido. Puede volver cuando quiera.");
} else {
    alert(`Se debitará un total de USD ${total} de su tarjeta`);
    actualizarStock();
    ventas.push(new Venta());
    mostrar("¡Gracias por comprar en nuestra tienda!");
}
