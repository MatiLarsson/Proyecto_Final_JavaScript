/*
Comentarios sobre el funcionamiento de la tienda:

El carrito del usuario asi como tambien sus datos se almacenan en el local storage.
Al cargar la pagina, js busca en la memoria local si el usuario ya se habia registrado anteriormente y trae su informacion asi como
su carrito en el estado en el que lo dejo.
Se habilita la carga de productos al carrito tanto para un usuario registrado como para un usuario anonimo. En este ultimo caso,
se le exigira que se registra al clickear en el boton pagar.
Al ir añadiendo productos js lleva un carrito que es pusheado al local Storage inmediatamente luego de cada adición o
baja de producto.
Al arrepentirse de compras,cambiar las cantidades, o al vaciar el carrito el stock de los productos en cuestion es devuelto al
stock de la tienda.
Al pagar, se crea un objeto venta y se remueve el stock del/los productos comprados.
Vale mencionar que el stock de los productos los lleva js y no el local storage. Por ello, al recargar la pagina, si hubieren
ocurrido ventas en sesiones anteriores, el stock se renueva nuevamente a default (2 unidades de cada producto).
*/

// Variables globales

let productos = [];
let usuarios = [];
let carritoBackEnd = [];
let ventas = [];
let total = 0;
let hoy = new Date();
let fechaActual = hoy.getDate() + '/' + (hoy.getMonth() + 1) + '/' + hoy.getFullYear();
let nombreUsuario;
let apellidoUsuario;
let emailUsuario;
let direccionUsuario;
let botonRegistrarmeHeader = document.getElementById('btn_registrarme_header');
let saludoHeader = document.getElementById('saludo');
let botonRegistrarme = document.getElementById('btn_registrarme');
let botonCambiarUsuario = document.getElementById('btn_changeUser');
let botonesComprar = document.querySelectorAll('.comprar');
let botonCarrito = document.getElementById('carritoHeader');
let contenidoCarrito = document.getElementById('carrito');
let botonVaciarCarrito = document.getElementById('vaciar');
let botonPagar = document.getElementById('pagar');
let formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});
let minusButtons = HTMLCollection;
let plusButtons = HTMLCollection;
let trashButtons = HTMLCollection;
let divErrorName = document.getElementById('inp_errorName');
let divErrorSurname = document.getElementById('inp_errorSurname');
let divErrorEmail = document.getElementById('inp_errorEmail');
let divErrorAdress = document.getElementById('inp_errorAdress');

// Event listeners:

document.addEventListener("DOMContentLoaded", () => {
    cargarProductos();
    mostrarProductos();
    checkUser();
    comprar();
});

document.getElementById('inp_nombre').onblur = () => {
    nombreUsuario = document.getElementById('inp_nombre').value;
    divErrorName.innerHTML = '';
    if (!isNameOk()) {
        divErrorName.textContent = 'No es un nombre válido.';
    }
    if (isNameOk() && isSurnameOk() && isEmailOk() && isAdressOk()) {
        if (botonRegistrarme.hasAttribute('disabled')) {
            botonRegistrarme.removeAttribute('disabled');
        }
    } else {
        if (!botonRegistrarme.hasAttribute('disabled')) {
            botonRegistrarme.setAttribute('disabled', '');
        }
    }
}

document.getElementById('inp_nombre').onfocus = () => {
    if (!botonRegistrarme.hasAttribute('disabled')) {
        botonRegistrarme.setAttribute('disabled', '');
    }
}

document.getElementById('inp_apellido').onblur = () => {
    apellidoUsuario = document.getElementById('inp_apellido').value;
    divErrorSurname.innerHTML = '';
    if (!isSurnameOk()) {
        divErrorSurname.textContent = 'No es un apellido válido.';
    }
    if (isNameOk() && isSurnameOk() && isEmailOk() && isAdressOk()) {
        if (botonRegistrarme.hasAttribute('disabled')) {
            botonRegistrarme.removeAttribute('disabled');
        }
    } else {
        if (!botonRegistrarme.hasAttribute('disabled')) {
            botonRegistrarme.setAttribute('disabled', '');
        }
    }
}

document.getElementById('inp_apellido').onfocus = () => {
    if (!botonRegistrarme.hasAttribute('disabled')) {
        botonRegistrarme.setAttribute('disabled', '');
    }
}

document.getElementById('inp_email').onblur = () => {
    emailUsuario = document.getElementById('inp_email').value;
    divErrorEmail.innerHTML = '';
    if (!isEmailOk()) {
        divErrorEmail.textContent = 'No es un e-mail válido.';
    }
    if (isNameOk() && isSurnameOk() && isEmailOk() && isAdressOk()) {
        if (botonRegistrarme.hasAttribute('disabled')) {
            botonRegistrarme.removeAttribute('disabled');
        }
    } else {
        if (!botonRegistrarme.hasAttribute('disabled')) {
            botonRegistrarme.setAttribute('disabled', '');
        }
    }
}

document.getElementById('inp_email').onfocus = () => {
    if (!botonRegistrarme.hasAttribute('disabled')) {
        botonRegistrarme.setAttribute('disabled', '');
    }
}

document.getElementById('inp_direccion').onblur = () => {
    direccionUsuario = document.getElementById('inp_direccion').value;
    divErrorAdress.innerHTML = '';
    if (!isAdressOk()) {
        divErrorAdress.textContent = 'No es una dirección válida.';
    }
    if (isNameOk() && isSurnameOk() && isEmailOk() && isAdressOk()) {
        if (botonRegistrarme.hasAttribute('disabled')) {
            botonRegistrarme.removeAttribute('disabled');
        }
    } else {
        if (!botonRegistrarme.hasAttribute('disabled')) {
            botonRegistrarme.setAttribute('disabled', '');
        }
    }
}

document.getElementById('inp_direccion').onfocus = () => {
    if (!botonRegistrarme.hasAttribute('disabled')) {
        botonRegistrarme.setAttribute('disabled', '');
    }
}

botonRegistrarmeHeader.onclick = () => {
    document.getElementById('inp_nombre').value = "";
    document.getElementById('inp_apellido').value = "";
    document.getElementById('inp_email').value = "";
    document.getElementById('inp_direccion').value = "";
    divErrorName.innerHTML = '';
    divErrorSurname.innerHTML = '';
    divErrorEmail.innerHTML = '';
    divErrorAdress.innerHTML = '';
}

botonRegistrarme.onclick = () => {
    usuarioPrevioEnMemoriaLocal = JSON.parse(localStorage.getItem('usuario'));
    usuarioPrevioEnBackEnd = usuarios.find(usuario => usuario.idU === usuarioPrevioEnMemoriaLocal.idU);
    usuarioPrevioEnBackEnd.nombre = nombreUsuario;
    usuarioPrevioEnBackEnd.apellido = apellidoUsuario;
    usuarioPrevioEnBackEnd.email = emailUsuario;
    usuarioPrevioEnBackEnd.direccion = direccionUsuario;
    localStorage.setItem('usuario', JSON.stringify(usuarioPrevioEnBackEnd));
    checkUser();
}

botonCarrito.onclick = () => {
    displayCarrito();
}

botonPagar.onclick = () => {
    if (carritoBackEnd.length > 0) {
        if (registrado()) {
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: "¡Pagado!",
                text: "¡Gracias por comprar en nuestra tienda!",
                showConfirmButton: false,
                timer: 1500
            });
            ventas.push(new Venta());
            carritoBackEnd = [];
            pushCarrito();
            displayCarrito();
        } else {
            Swal.fire({
                position: 'center',
                icon: 'info',
                text: '¡Primero debes registrarte!',
                showConfirmButton: false,
                timer: 1500
            });
        }
    } else {
        Swal.fire({
            position: 'center',
            icon: 'error',
            text: '¡Tu carrito está vacío!',
            showConfirmButton: false,
            timer: 1500
        });
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

botonCambiarUsuario.onclick = () => {
    usuarios = [];
    usuarios.push(new Usuario('anonimo', '', '', ''));
    localStorage.setItem('usuario', JSON.stringify(usuarios[usuarios.length - 1]));
    desactivarSaludo();
    displayRegistro();
    Swal.fire({
        position: 'center',
        icon: 'success',
        text: "Usuario eliminado. Puedes registrarte o continuar con una compra anónima.",
        showConfirmButton: false,
        timer: 2500
    });
}
