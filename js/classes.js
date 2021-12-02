// Clases

class Producto {
    constructor(nombre, precio, stock, img, categoria) {
        this.nombre = nombre.toUpperCase();
        this.precio = parseFloat(precio);
        this.stock = parseInt(stock);
        this.img = img;
        this.categoria = categoria.toUpperCase();
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
