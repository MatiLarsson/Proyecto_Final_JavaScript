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

botonCartFocus.onclick = () => {
    displayCarrito();
}

$('.xbtn, .btn-cerrar').click(function(){
    $('.productOverlay, .productContent').fadeOut();
});

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
