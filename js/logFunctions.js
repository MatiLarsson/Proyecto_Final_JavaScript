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
        pullCompras();
    } else {
        usuarios.push(new Usuario('anonimo', '', '', ''));
        localStorage.setItem('usuario', JSON.stringify(usuarios[usuarios.length - 1]));
    }
    updateItemCount();
}
