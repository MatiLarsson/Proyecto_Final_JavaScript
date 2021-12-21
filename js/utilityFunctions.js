function removeAllChildNodes(padre) {
    while (padre.firstChild) {
        padre.removeChild(padre.firstChild);
    }
}


