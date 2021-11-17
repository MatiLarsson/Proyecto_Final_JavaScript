//  Se crea el arrary de productos
const productos = [];
// Se crea el array de usuarios de la tienda
const usuarios = [];
// Se crea un array con los IDs de los usuarios hasta el momento
const idUsuarios = [];
// Se crea un array con los items cargados en el Carrito
const itemsEnCarrito = [];
// Se crea el array de ventas para llevar un registro de las mismas
const ventas = [];
// Se crean las variables y constantes globales
let total = 0;
const idUsuario = idUsuarios.length + 1;
let hoy = new Date();
let fechaActual = hoy.getDate() + '/' + (hoy.getMonth() + 1) + '/' + hoy.getFullYear();
// Se crea la función para calcular el total a pagar
function CalculartotalCarrito() {
    for (let item of itemsEnCarrito) {
        for (let producto of productos) {
            if (producto.idProducto === item.idProducto) {
                let resultadoItem = item.cantidad * producto.precio;
                total += resultadoItem;
                console.log(`Producto código: ${producto.idProducto} ===> ${item.cantidad} unidades x USD ${producto.precio} = USD ${resultadoItem}`);
            }
        }
    }
    console.log(`Total del carrito USD ${total}`);
}
// Se crea la función para mantener acutalizado el stock luego de una compra
function actualizarStock() {
    for (let item of itemsEnCarrito) {
        for (let producto of productos) {
            if (producto.idProducto === item.idProducto) {
                producto.vender(item.cantidad);
                console.log(`Se han removido ${item.cantidad} unidades del stock del producto código: ${producto.idProducto}.`);
            }
        }
    }
}
// Se almacena el id del usuario actual en el array idUsuarios []
idUsuarios.push(idUsuario);
// Se crean las clases del sitio y sus métodos
class Producto {
    constructor(idProducto, nombre, precio, stock) {
        this.idProducto = parseInt(idProducto);
        this.nombre = nombre.toUpperCase();
        this.precio = parseFloat(precio);
        this.stock = parseInt(stock);
    }
    sumaIva() {
        this.precio = this.precio * 1.21;
    }
    vender(cantidadVendida) {
        this.stock -= cantidadVendida;
    }
}
class Usuario {
    constructor(id, nombre, apellido, email, direccionDeEnvio) {
        this.id = id;
        this.nombre = nombre.toUpperCase();
        this.apellido = apellido.toUpperCase();
        this.email = email;
        this.direccionDeEnvio = direccionDeEnvio.toUpperCase();
    }
}
class Carrito {
    constructor(id, items) {
        this.id = id;
        this.items = items;
    }
    agregar(item) {
        this.items.push(item);
    }
    quitar(item) {
        this.items.pop(item);
    }
}
// La siguiente clase se crea específicamente para uso dentro del array itemsEnCarrito, propiedad de los objetos de la clase Carrito
class Item {
    constructor(idProducto, cantidad) {
        this.idProducto = parseInt(idProducto);
        this.cantidad = parseInt(cantidad);
    }
}
class Venta {
    constructor(fecha, items, id, direccionDeEnvio) {
        this.fecha = fecha;
        this.items = items;
        this.id = id;
        this.direccionDeEnvio = direccionDeEnvio.toUpperCase();
    }
}
// Se agragan los productos de la tienda
productos.push(new Producto(1, "macbook pro", 2299, 10));
productos.push(new Producto(2, "macbook air", 1449, 10));
productos.push(new Producto(3, "imac", 2999, 10));
productos.push(new Producto(4, "iphone 13 pro max", 1299, 10));
productos.push(new Producto(5, "iphone 13 pro", 1199, 10));
productos.push(new Producto(6, "iphone 13", 999, 10));
productos.push(new Producto(7, "iphone 12", 899, 10));
productos.push(new Producto(8, "iphone SE", 499, 10));
productos.push(new Producto(9, "iphone 11", 549, 10));
// Se actualiza su precio para sumarle el IVA
for (const producto of productos) {
    producto.sumaIva();
}
// Comienzo de interacción con el usuario
confirm ("¡Bienvenidos a nuestra tienda online!");
confirm ("Antes que nada, te pediremos algunos datos...");
// Se crea un nuevo usuario al cargar el sitio y se lo carga como objeto en el array usuarios []
const nombreUsuario = prompt("Ingrese nombre: ");
const apellidoUsuario = prompt("Ingrese apellido: ");
const emailUsuario = prompt("Ingrese su email: ");
const direccionUsuario = prompt("Ingrese su dirección para envíos: ")
usuarios.push(new Usuario(idUsuario, nombreUsuario, apellidoUsuario, emailUsuario, direccionUsuario));
confirm ("A continuación podrás agregar productos al carrito y solicitar el envío a tu domicilio.");
confirm ("Vamos a iniciar tu pedido...");
// Se crea un nuevo carrito para este usuario
const carritoUsuarioID = new Carrito(idUsuario, itemsEnCarrito);
do {
    let codigo = prompt("Ingrese el código del producto que quiere agregar a su carrito: ");
    let cantidad = prompt(`Ingrese cantidad del producto ${codigo} que quiere comprar: `);
    carritoUsuarioID.agregar(new Item(codigo, cantidad));
    if (!confirm(`Se han agregado ${cantidad} unidades de producto ${codigo} a su carrito de compras. "ACEPTAR" para confirmar, "CANCELAR" para anular.`)) {
        carritoUsuarioID.quitar(itemsEnCarrito[itemsEnCarrito.length - 1]);
    }
} while (confirm("¿Desea continuar comprando?"));
alert("Abra su consola para corroborar los productos en su carrito.");
console.log("Su carrito contiene: ");
console.log(CalculartotalCarrito());
if (!confirm("Click en 'Aceptar' para pagar.")) {
    console.log("Lamentamos que se haya arrepentido. Puede volver cuando quiera.");
} else {
    alert(`Se debitará un total de USD ${total} de su tarjeta`);
    console.log(actualizarStock());
    ventas.push(new Venta(fechaActual, itemsEnCarrito, idUsuario, direccionUsuario));
    console.log("¡Gracias por comprar en nuestra tienda!");
}
