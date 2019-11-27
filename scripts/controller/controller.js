const productStore = new Store(1);

window.addEventListener('load', ()=>{
	document.getElementById('new-prod').addEventListener('submit', newProd);
	document.getElementById('new-prod').addEventListener('reset', resetFormProd);
	document.getElementById('list-prod').addEventListener('submit', listProd);
	document.getElementById('low-prod').addEventListener('submit', lowProd);

	Array.from(document.querySelectorAll('.nav-link')).forEach(menu=>menu.addEventListener('click', event=>{
		const menuItem = event.target.href.split('#')[1];	// El href quitando el 1º carácter: productos/forms/listados
		activeMenuItem(event.target.parentElement);			// Ponemos la clase 'active' al item clickado
		showSection(menuItem);								// Mostramos la sección que toca
		// Si queremos ver el form lo preparamos para añadir
		if (menuItem == 'forms') renderEditForm(null, false);		
	}))
})

function loadStore() {
	getProducts().forEach(product => renderNewProduct(product));
	renderStoreImport(productStore.totalImport());		// Pintamos el total
}

function resetFormProd(e) {
	if (document.getElementById('new-id').value) {
		// Estamos editando. Reset es volver a cargar el producto en el formulario
		e.preventDefault();
		const id = document.getElementById('new-id').value;
		const product = productStore.findProduct(id);
		if (!product) {
			alert('Error: no existe el producto con id ' + id);
			return false;
		}
		renderEditForm(product, true);	// El 2º param indica si queremos editar (true) o añadir (false)
	}
}

function newProd(e) {
	e.preventDefault();
	let id = document.getElementById('new-id').value;
	const name = document.getElementById('new-name').value;
	const units = Number(document.getElementById('new-units').value);
	const price = Number(document.getElementById('new-price').value);

	if (id) {
		// Estamos modificando
		if (!productStore.editProduct(id, name, units, price)) {
			alert('Error al modificar el producto en el almacén');
			return false;
		}
	} else {
		// Estamos añadiendo un nuevo producto
		id = getMaxProductId() + 1;
		if (!productStore.addProduct(id, name, price)) {
			alert('Error al añadir el producto al almacén');
			return false;
		}
	}
	renderNewProduct(productStore.findProduct(id));
	renderStoreImport(productStore.totalImport());		// Pintamos el total

	if (id) {
		alert('Producto modificado correctamente en el almacén');
	} else {
		alert('Producto añadido correctamente al almacén');
	}
	// Lanzo un 'click' al menú 'Productos' y se oculta el formulario
	document.querySelector('.nav-link[href="#productos"]').click();
}

function editProd(e) {
	e.preventDefault();
	const id = getProdIdFromIcon(this);

	const product = productStore.findProduct(id);
	if (!product) {
		alert('Error: no existe el producto con id ' + id);
		return false;
	}
	renderEditForm(product, true);	// El 2º param indica si queremos editar (true) o añadir (false)
}

function delProd(e) {
	e.preventDefault();
	const id = getProdIdFromIcon(this);

	const product = productStore.findProduct(id);
	if (!product) {
		alert('Error: no existe el producto con id ' + id);
		return false;
	}
	if (!confirm(`Seguro que desea borrar el producto '${product.name}' con id ${product.id}?`)) {
		alert('Proceso cancelado');
		return false;
	}
	if (product.units) {
		if (!confirm(`El producto '${product.name}' con id ${product.id} tiene ${product.units} unidades. Seguro que desea borralo?`)) {
			alert('Proceso cancelado');
			return false;
		} else if (!product.changeUnits(-product.units)) {
			alert('Error al eliminar las unidades del producto en el almacén');
			return false;
		}
	}
	// Ahora el producto ya NO tiene unidades			
	if (!productStore.delProduct(id)) {
		alert('Error al eliminar el producto del almacén');
		return false;
	}
	renderDelProduct(id);
	renderStoreImport(productStore.totalImport());		// Pintamos el total

	alert('Producto eliminado correctamente del almacén');
}

function increaseUnits(e) {
	e.preventDefault();
	const id = getProdIdFromIcon(this);
	stockProd(id, 1);
}

function decreaseUnits(e) {
	e.preventDefault();
	const id = getProdIdFromIcon(this);
	stockProd(id, -1);
}

function stockProd(id, units) {
	const product = productStore.findProduct(id);
	if (!product) {
		alert('Error: no existe el producto con id ' + id);
		return false;
	}
	if (!productStore.changeProductUnits(id, units)) {
		alert('Error al cambiar las unidades del producto en el almacén');
		return false;
	}
	renderChangeUnitsInStore(product);
	renderStoreImport(productStore.totalImport());		// Pintamos el total
}

function listProd(e) {
	e.preventDefault();
	const opt = document.querySelector('input[name="opt-list"]:checked').value;
	switch (opt) {
		case 'alf':
			renderListProduct(
				'Listado de productos alfabético',
				productStore.orderByName());
			break;
		case 'uds':
			renderListProduct(
				'Listado de productos por unidades (desc)',
				productStore.orderByUnits());
			break;
	}
	document.getElementById('list-prod').reset();					// Borramos el formulario		
}

function lowProd(e) {
	e.preventDefault();
	const uds = document.getElementById('low-uds').value;
	const opt = document.querySelector('input[name="opt-low"]:checked').value;

	switch (opt) {
		case 'alf':
			renderListProduct(
				'Productos bajo stock alfabético',
				productStore.underStock(uds).sort(
					(prodA, prodB) => prodA.name.
						localeCompare(prodB.name)));
			break;
		case 'uds':
			renderListProduct(
				'Productos bajo stock por unidades',
				productStore.underStock(uds).sort(
					(prodA, prodB) => prodA.units - prodB.units));
			break;
	}
	document.getElementById('low-prod').reset();					// Borramos el formulario		
}

function getProducts() {
	return productStore.products;
}

function getMaxProductId() {
	return getProducts().reduce((max, prod) => prod.id > max ? prod.id : max, 0);
}

