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
    $.post('https://jsonplaceholder.typicode.com/posts', JSON.stringify(usuarioPrevioEnBackEnd), function(respuesta, estado) {
        console.log(respuesta);
        if (estado) {
            checkUser();
        }
    })
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