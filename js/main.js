/*
Comentarios sobre el funcionamiento de la tienda:

El carrito del usuario asi como tambien sus datos se almacenan en el local storage.
Al cargar la pagina, js busca en la memoria local si el usuario ya se habia registrado anteriormente y trae su informacion asi como
su carrito en el estado en el que lo dejo, si el usuario hubiese sido anonimo, no traerá su estado de carrito, lo vaciará al recargar
y le permitirá hacer una nueva compra anónima desde cero.
Se habilita la carga de productos al carrito tanto para un usuario registrado como para un usuario anonimo. En este ultimo caso,
se le exigira que se registre al clickear en el boton pagar.
Si el usuario no coincide, se puede resetear el usuario. Los datos del carrito y de usuario previo se perderán.
Al ir añadiendo productos js lleva un carrito que es pusheado al local Storage inmediatamente luego de cada adición o
baja de producto.
Al arrepentirse de compras, cambiar las cantidades, o al vaciar el carrito el stock de los productos en cuestion es devuelto al
stock de la tienda.
Al pagar, se crea un objeto venta y se remueve el stock del/los productos comprados.
Vale mencionar que el stock de los productos los lleva js y no el local storage. Por ello, al recargar la pagina, si hubieren
ocurrido ventas en sesiones anteriores, el stock se renueva nuevamente a default (2 unidades de cada producto).
Se implementa llamada GET para conseguir el listado de productos y cargarlos al array productos.
Se implementa envío POST para enviar la "órden de compra" al clickear pagar, y al recibir un estado "exitoso" se procede a notificar
al usuario que la compra se concretó con éxito, se crea un objeto venta y se vacía el carrito.
Se implementa envío POST para enviar los datos del formulario de registro al clickear en boton "Registrarse".
*/

// Variables globales

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

// Event listeners:

// Solo para abrir sin liveserver:
/* document.addEventListener("DOMContentLoaded", () => {
    cargarProductos();
    mostrarProductos();
    checkUser();
    comprar();
    detalleDeProductos();
}); */

$.getJSON('../json/productos.json', function (data) {
    data.forEach(elemento => productos.push(new Producto(elemento.nombre, elemento.precio, elemento.stock, elemento.thumbnail, elemento.img1, elemento.img2, elemento.categoria, elemento.descripcion)));
    mostrarProductos();
    checkUser();
    updateBotonMisCompras();
    comprar();
    detalleDeProductos();
})

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
    // Comentar para abrir sin liveserver:
    $.post('https://jsonplaceholder.typicode.com/posts', JSON.stringify(usuarioPrevioEnBackEnd), function(respuesta, estado) {
        console.log(respuesta);
        if (estado) {
            checkUser();
        }
    })
}

botonCarrito.onclick = () => {
    displayCarrito();
}

botonIrAPagar.onclick = () => {
    if (carritoBackEnd.length > 0) {
        if (!registrado()) {
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

botonPagar.onclick = () => {
    // Comentar para abrir sin liveserver:
    $.post('https://jsonplaceholder.typicode.com/posts', JSON.stringify(carritoBackEnd), function(respuesta, estado) {
        console.log(respuesta);
        if (estado) {
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: "¡Pagado!",
                text: "¡Gracias por comprar en nuestra tienda!",
                showConfirmButton: false,
                timer: 3000
            });
        }
    })
    const nuevaVenta = new Venta();
    ventas.push(nuevaVenta);
    misCompras.push(nuevaVenta);
    pushCompras()
    updateBotonMisCompras();
    carritoBackEnd = [];
    pushCarrito();
    displayCarrito();
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
    updateItemCount();
    Swal.fire({
        position: 'center',
        icon: 'success',
        text: "Usuario eliminado. Puedes registrarte o continuar con una compra anónima.",
        showConfirmButton: false,
        timer: 2500
    });
}

$('.xbtn, .btn-cerrar').click(function(){
    $('.productOverlay, .productContent').fadeOut();
});

botonCartFocus.onclick = () => {
    displayCarrito();
}

document.querySelector('.btn-comprar').onclick = () => {
    const id = parseInt(document.querySelector('.btn-comprar').getAttributeNode('id').value);
    const buttonToTrigger = botonesComprar[id];
    if (buttonToTrigger.hasAttribute('disabled')) {
        Swal.fire({
            position: 'center',
            icon: 'info',
            text: '¡No hay más stock!',
            showConfirmButton: false,
            timer: 900
        });
    } else{
        buttonToTrigger.click();
    }
}

document.querySelector('#misCompras').onclick = () => {
    const compras = document.querySelector('#compras');
    compras.innerHTML = "";
    const table = document.createElement('table');
    const header = document.createElement('tr');
    const th1 = document.createElement('th');
    th1.textContent = "Nº compra";
    header.appendChild(th1);
    const th2 = document.createElement('th');
    th2.textContent = "Fecha";
    header.appendChild(th2);
    const th3 = document.createElement('th');
    th3.textContent = "Importe";
    header.appendChild(th3);
    const th4 = document.createElement('th');
    th4.textContent = "Detalle";
    header.appendChild(th4);
    table.appendChild(header);
    misCompras.forEach(compra => {
        const row = document.createElement('tr');
        const td1 = document.createElement('td');
        td1.textContent = misCompras.indexOf(compra) + 1;
        row.appendChild(td1);
        const td2 = document.createElement('td');
        td2.textContent = compra.fecha;
        row.appendChild(td2);
        const td3 = document.createElement('td');
        td3.textContent = formatter.format(compra.total);
        row.appendChild(td3);
        const td4 = document.createElement('td');
        const botonToggle = document.createElement('div');
        botonToggle.classList.add('btn-toggle-details');
        botonToggle.setAttribute('id', `btn-toggle-details_${misCompras.indexOf(compra)}`)
        const imgDown = document.createElement('img');
        imgDown.classList.add('detail');
        imgDown.classList.add(`detail_${misCompras.indexOf(compra)}`);
        imgDown.src = "assets/images/logos/arrow-down-circle-fill.svg";
        botonToggle.appendChild(imgDown);
        const imgUp = document.createElement('img');
        imgUp.classList.add('detail');
        imgUp.classList.add(`detail_${misCompras.indexOf(compra)}`);
        imgUp.style.display = "none";
        imgUp.src = "assets/images/logos/arrow-up-circle-fill.svg";
        botonToggle.appendChild(imgUp);
        td4.appendChild(botonToggle);
        row.appendChild(td4);
        const rowHeaderD = document.createElement('tr');
        rowHeaderD.style.display = "none";
        rowHeaderD.classList.add('detail-row-header');
        rowHeaderD.classList.add(`detail-row-header_${misCompras.indexOf(compra)}`);
        const tdHD1 = document.createElement('td');
        rowHeaderD.appendChild(tdHD1);
        const tdHD2 = document.createElement('td');
        tdHD2.textContent = "Producto";
        rowHeaderD.appendChild(tdHD2);
        const tdHD3 = document.createElement('td');
        tdHD3.textContent = "Precio unitario";
        rowHeaderD.appendChild(tdHD3);
        const tdHD4 = document.createElement('td');
        tdHD4.textContent = "Cantidad";
        rowHeaderD.appendChild(tdHD4);
        table.appendChild(row);
        const emptyRowAfter = document.createElement('tr');
        emptyRowAfter.classList.add('empty-row');
        const emptyTd1 = document.createElement('td');
        emptyRowAfter.appendChild(emptyTd1);
        const emptyTd2 = document.createElement('td');
        emptyRowAfter.appendChild(emptyTd2);
        const emptyTd3 = document.createElement('td');
        emptyRowAfter.appendChild(emptyTd3);
        const emptyTd4 = document.createElement('td');
        emptyRowAfter.appendChild(emptyTd4);
        table.appendChild(emptyRowAfter);
        table.appendChild(rowHeaderD);
        compra.carritoBackEnd.forEach(item => {
            const prod = productos.find(producto => producto.idP === item.idP);
            const rowD = document.createElement('tr');
            rowD.style.display = "none";
            rowD.classList.add("detail-row");
            rowD.classList.add(`detail-row_${misCompras.indexOf(compra)}`);
            rowD.classList.add("text-secondary");
            const tdD1 = document.createElement('td');
            const imgD = document.createElement('img');
            imgD.classList.add('imgD');
            imgD.src = prod.thumbnail;
            tdD1.appendChild(imgD);
            rowD.appendChild(tdD1);
            const tdD2 = document.createElement('td');
            tdD2.textContent = prod.nombre;
            rowD.appendChild(tdD2);
            const tdD3 = document.createElement('td');
            tdD3.textContent = formatter.format(prod.precio);
            rowD.appendChild(tdD3);
            const tdD4 = document.createElement('td');
            tdD4.textContent = item.cantidad;
            rowD.appendChild(tdD4);
            table.appendChild(rowD);
        })
        const decorativeRowAfter = document.createElement('tr');
        decorativeRowAfter.classList.add("deco-row");
        decorativeRowAfter.classList.add(`deco-row_${misCompras.indexOf(compra)}`);
        decorativeRowAfter.style.display = "none";
        const decotd1 = document.createElement('td');
        decorativeRowAfter.appendChild(decotd1);
        const decotd2 = document.createElement('td');
        decorativeRowAfter.appendChild(decotd2);
        const decotd3 = document.createElement('td');
        decorativeRowAfter.appendChild(decotd3);
        const decotd4 = document.createElement('td');
        decorativeRowAfter.appendChild(decotd4);
        table.appendChild(decorativeRowAfter);
        const emptyRowAfter2 = document.createElement('tr');
        emptyRowAfter2.classList.add('empty-row2');
        const emptyTd5 = document.createElement('td');
        emptyRowAfter2.appendChild(emptyTd5);
        const emptyTd6 = document.createElement('td');
        emptyRowAfter2.appendChild(emptyTd6);
        const emptyTd7 = document.createElement('td');
        emptyRowAfter2.appendChild(emptyTd7);
        const emptyTd8 = document.createElement('td');
        emptyRowAfter2.appendChild(emptyTd8);
        table.appendChild(emptyRowAfter2);
    })
    compras.appendChild(table);
    detailButtons = document.querySelectorAll('.btn-toggle-details');
    addListenersToDetailButtons();
}
function addListenersToDetailButtons() {
    detailButtons.forEach(button => {
        const numeroDeBotonDeLaCompra = parseInt(button.getAttribute('id').split("_")[1]);
        button.addEventListener('click', () => {
            $(`.detail-row-header_${numeroDeBotonDeLaCompra}`).toggle("slow");
            $(`.detail-row_${numeroDeBotonDeLaCompra}`).toggle("slow");
            $(`.deco-row_${numeroDeBotonDeLaCompra}`).toggle("slow");
            $(`.detail_${numeroDeBotonDeLaCompra}`).toggle();
        })
    })
}