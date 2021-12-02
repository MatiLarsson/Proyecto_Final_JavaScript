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
        const table = document.createElement('table');
        cart.appendChild(table);
        const trHeader = document.createElement('tr');
        table.appendChild(trHeader);
        const thImagen = document.createElement('th');
        trHeader.appendChild(thImagen);
        const thNombreProducto = document.createElement('th');
        thNombreProducto.textContent = 'Producto';
        trHeader.appendChild(thNombreProducto);
        const thPrecioProducto = document.createElement('th');
        thPrecioProducto.textContent = 'Precio';
        trHeader.appendChild(thPrecioProducto);
        const thCantidadProducto = document.createElement('th');
        thCantidadProducto.textContent = 'Cantidad';
        trHeader.appendChild(thCantidadProducto);
        const thSumatoriaItem = document.createElement('th');
        thSumatoriaItem.textContent = 'Total';
        trHeader.appendChild(thSumatoriaItem);
        const thToTrashButtons = document.createElement('th');
        trHeader.appendChild(thToTrashButtons);
        table.appendChild(trHeader);
        for (let item of carritoBackEnd) {
            for (let producto of productos) {
                if (producto.idP === item.idP) {
                    let sumatoriaItem = item.cantidad * producto.precio;
                    total += sumatoriaItem;
                    const trContent = document.createElement('tr');
                    const td1 = document.createElement('td');
                    const img = document.createElement('img');
                    img.src = producto.img;
                    td1.appendChild(img);
                    trContent.appendChild(td1);
                    const td2 = document.createElement('td');
                    td2.textContent = producto.nombre;
                    trContent.appendChild(td2);
                    const td3 = document.createElement('td');
                    td3.textContent = formatter.format(producto.precio);
                    trContent.appendChild(td3);
                    const td4 = document.createElement('td');
                    const minusButton = document.createElement('button');
                    minusButton.setAttribute('type', 'button');
                    minusButton.setAttribute('id', `minus_${item.idP}`);
                    minusButton.classList.add('minusButton');
                    const minusImg = document.createElement('img');
                    minusImg.src = 'assets/images/logos/dash-square.svg';
                    const span = document.createElement('span');
                    span.textContent = item.cantidad;
                    const plusButton = document.createElement('button');
                    plusButton.setAttribute('type', 'button');
                    plusButton.setAttribute('id', `plus_${item.idP}`);
                    plusButton.classList.add('plusButton');
                    const plusImg = document.createElement('img');
                    plusImg.src = 'assets/images/logos/plus-square.svg';
                    minusButton.appendChild(minusImg);
                    plusButton.appendChild(plusImg);
                    td4.appendChild(minusButton);
                    td4.appendChild(span);
                    td4.appendChild(plusButton);
                    trContent.appendChild(td4);
                    const td5 = document.createElement('td');
                    td5.textContent = formatter.format(sumatoriaItem);
                    trContent.appendChild(td5);
                    const td6 = document.createElement('td');
                    const toTrashButton = document.createElement('button');
                    toTrashButton.setAttribute('type', 'button');
                    toTrashButton.classList.add('trashButton');
                    toTrashButton.setAttribute('id', `${item.idP}`);
                    const trashImage = document.createElement('img');
                    trashImage.src = 'assets/images/logos/trash.svg';
                    toTrashButton.appendChild(trashImage);
                    td6.appendChild(toTrashButton);
                    trContent.appendChild(td6);
                    table.appendChild(trContent);
                }
            }
        }
        const suma = document.createElement('p');
        suma.innerHTML = `Total a Pagar: ${formatter.format(total)}`;
        cart.appendChild(suma);
        minusButtons = document.getElementsByClassName('minusButton');
        plusButtons = document.getElementsByClassName('plusButton');
        trashButtons = document.getElementsByClassName('trashButton');
        activateMinusButtons();
        activatePlusButtons();
        activateTrashButtons();

    } else {
        titulo.innerHTML = 'Tu carrito está vacío.'
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

function isNameOk() {
    if (nombreUsuario.length > 0) {
        return true;
    } else {
        return false;
    }
}

function isSurnameOk() {
    if (apellidoUsuario.length > 0) {
        return true;
    } else {
        return false;
    }
}

function isEmailOk() {
    if (emailUsuario.length > 0 && emailUsuario.includes('@')) {
        return true;
    } else {
        return false;
    }
}

function isAdressOk() {
    if (direccionUsuario.length > 0) {
        return true;
    } else {
        return false;
    }
}

function registrado() {
    if (JSON.parse(localStorage.getItem('usuario')) != null && JSON.parse(localStorage.getItem('usuario')).length != 0 && JSON.parse(localStorage.getItem('usuario')).nombre != 'ANONIMO') {
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

function displayRegistro() {
    if ((botonRegistrarmeHeader.classList.contains('d-none'))) {
        botonRegistrarmeHeader.classList.remove('d-none');
    }
}

function desactivarSaludo() {
    if (!(saludoHeader.classList.contains('d-none'))) {
        saludoHeader.classList.add('d-none');
    }
}

function displaySaludo() {
    if (registrado()) {
        const name = JSON.parse(localStorage.getItem(('usuario'))).nombre;
        const surname = JSON.parse(localStorage.getItem(('usuario'))).apellido;
        saludoHeader.children[0].innerHTML = `Bienvenido/a ${name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()} ${surname.charAt(0).toUpperCase() + surname.slice(1).toLowerCase()}`;
        if (saludoHeader.classList.contains('d-none')) {
            saludoHeader.classList.remove('d-none');
        }
    }
}

function checkUser() {
    if (registrado()) {
        desactivarRegistro();
        displaySaludo();
        pullCarrito();
    } else {
        usuarios.push(new Usuario('anonimo', '', '', ''));
        localStorage.setItem('usuario', JSON.stringify(usuarios[usuarios.length - 1]));
    }
}

function add(nombre, precio, cantidad, img, categoria) {
    productos.push(new Producto(nombre, precio, cantidad, img, categoria));
    productos[productos.length - 1].sumaIva();
}
// Carga de productos a la tienda (backend):

function cargarProductos() {
    add("macbook pro", 2299, 2, "assets/images/products/macbookpro.png", 'mac');
    add("macbook air", 1449, 2, "assets/images/products/macbookair.png", 'mac');
    add("imac", 2999, 2, "assets/images/products/imac.png", 'mac');
    add("iphone 13 pro max", 1299, 2, "assets/images/products/iphone13promax.png", 'iphone');
    add("iphone 13 pro", 1199, 2, "assets/images/products/iphone13pro.png", 'iphone');
    add("iphone 13", 999, 2, "assets/images/products/iphone13.png", 'iphone');
    add("iphone 12", 899, 2, "assets/images/products/iphone12.png", 'iphone');
    add("iphone SE", 499, 2, "assets/images/products/iphoneSE.png", 'iphone');
    add("iphone 11", 549, 2, "assets/images/products/iphone11.png", 'iphone');
}

// Carga de productos al FrontEnd

function mostrarProductos() {
    productos.forEach((producto) => {
        let nodoPadre;
        if (producto.categoria === 'MAC') {
            nodoPadre = document.querySelector('#mac');
        }

        if (producto.categoria === 'IPHONE') {
            nodoPadre = document.querySelector('#iphone');
        }

        const divContenedor = document.createElement('div');
        divContenedor.classList.add('col-12', 'col-md-4');

        const divProducto = document.createElement('div');
        divProducto.classList.add('producto', 'p2', 'd-flex', 'flex-column', 'justify-content-center', 'align-items-center');

        const imagenProd = document.createElement('img');
        imagenProd.src = producto.img;
        imagenProd.setAttribute('alt', `${producto.nombre}`);

        const nombreProd = document.createElement('p');
        nombreProd.classList.add('nombreProducto', 'text-primary');
        nombreProd.textContent = producto.nombre;

        const precioProd = document.createElement('p');
        precioProd.classList.add('text-secondary');
        precioProd.textContent = `${formatter.format(producto.precio)}`;

        const codigoProd = document.createElement('p');
        codigoProd.classList.add('text-secondary', 'd-none');
        codigoProd.textContent = `Código: ${producto.idP}`;

        const botonProd = document.createElement('button');
        botonProd.setAttribute('type', 'button');
        botonProd.classList.add('comprar', 'btn', 'btn-primary', 'rounded-pill');
        botonProd.textContent = 'comprar';

        nodoPadre.appendChild(divContenedor);
        divContenedor.appendChild(divProducto);
        divProducto.appendChild(imagenProd);
        divProducto.appendChild(nombreProd);
        divProducto.appendChild(precioProd);
        divProducto.appendChild(codigoProd);
        divProducto.appendChild(botonProd);
    })
    botonesComprar = document.querySelectorAll('.comprar');
}

function activateMinusButtons() {
    for (const minusButton of minusButtons) {
        minusButton.addEventListener('click', () => {
            const idOfProductToSubstract = parseInt(minusButton.getAttribute('id').split('_')[1]);
            const itemToSubstract = carritoBackEnd.find(item => item.idP === idOfProductToSubstract);
            const p = productos.find(obj => obj.idP === itemToSubstract.idP);
            if (itemToSubstract.cantidad > 1) {
                itemToSubstract.cantidad --;
                p.reponer(1);
            } else {
                const index = carritoBackEnd.indexOf(itemToSubstract);
                carritoBackEnd.splice(index,1);
                p.reponer(1);
            }
            pushCarrito();
            displayCarrito();
        })
    }
}

function activatePlusButtons() {
    for (const plusButton of plusButtons) {
        plusButton.addEventListener('click', () => {
            const idOfProductToAdd = parseInt(plusButton.getAttribute('id').split('_')[1]);
            const itemToAdd = carritoBackEnd.find(item => item.idP === idOfProductToAdd);
            const p = productos.find(obj => obj.idP === itemToAdd.idP);
            if (p.stock >= 1) {
                itemToAdd.cantidad ++;
                p.vender(1);
                pushCarrito();
                displayCarrito();
            } else {
                Swal.fire({
                    position: 'center',
                    icon: 'info',
                    text: '¡No hay más stock!',
                    showConfirmButton: false,
                    timer: 900
                });
            }
        })
    }
}

function activateTrashButtons() {
    for (const trashButton of trashButtons) {
        trashButton.addEventListener('click', () => {
            const idOfProductToTrash = parseInt(trashButton.getAttribute('id'));
            const itemToTrash = carritoBackEnd.find(item => item.idP === idOfProductToTrash);
            const index = carritoBackEnd.indexOf(itemToTrash);
            if (productos.find(obj => obj.idP === itemToTrash.idP)) {
                const p = productos.find(obj => obj.idP === itemToTrash.idP);
                p.reponer(itemToTrash.cantidad);
            }
            carritoBackEnd.splice(index, 1);
            pushCarrito();
            displayCarrito();
        });
    }
}

function comprar()  {
    botonesComprar.forEach(botonComprar => {
        botonComprar.addEventListener('click', () => {
            const nombreDelProductoAgregado = botonComprar.parentNode.children[1].innerHTML.toUpperCase();
            const productoAgregado = productos.find(producto => producto.nombre === nombreDelProductoAgregado);
            const codigo = productoAgregado.idP;
            if (carritoBackEnd.some(item => item.idP === codigo)) {
                const itemExistenteEnCarrito = carritoBackEnd.find(item => item.idP === codigo);
                itemExistenteEnCarrito.cantidad += 1;
            } else {
                carritoBackEnd.push(new Item(codigo, 1));
            }
            Swal.fire({
                position: 'center',
                icon: 'success',
                text: "¡Agregado al carrito!",
                showConfirmButton: false,
                timer: 800
            });
            productoAgregado.vender(1);
            updateBuyButtons();
            pushCarrito();
        });
    });
}

