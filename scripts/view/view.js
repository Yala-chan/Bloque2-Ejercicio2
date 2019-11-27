function renderNewProduct(product) {
    const $productTBodyUI = document.getElementById('almacen').firstElementChild.firstElementChild.nextElementSibling;
    // El TBODY es el hermano del 1º hijo del 1º hijo del DIV almacen. Esto se evitaría poniéndole una 'id'

    // Miramos si ya está el producto
    let $productUI = document.getElementById('prod-' + product.id);
    if ($productUI) {            // Si está lo modificamos
        $productUI.children[1].textContent = product.name;
        $productUI.children[2].textContent = product.units;
        $productUI.children[3].textContent = product.price;
        $productUI.children[4].textContent = product.productImport().toFixed(2) + ' €';
    } else {            // Si no lo añadimos
        $productUI = productToTr(product);
        $productTBodyUI.appendChild($productUI);
    }
    if (!product.units) disableDecrement($productUI, true);
    else disableDecrement($productUI, false);
}

function renderDelProduct(id) {
    const $productTBodyUI = document.getElementById('almacen').firstElementChild.firstElementChild.nextElementSibling;
    // El TBODY es el hermano del 1º hijo del 1º hijo del DIV almacen. Esto se evitaría poniéndole una 'id'

    // Miramos si ya está el producto
    let $productUI = document.getElementById('prod-' + id);
    if ($productUI) {
        $productUI.parentElement.removeChild($productUI);
    }
}

function renderChangeUnitsInStore(product) {
    const $productUI = document.getElementById('prod-' + product.id);
    $productUI.children[2].textContent = product.units;
    $productUI.children[4].textContent = product.productImport().toFixed(2) + ' €';

    if (!product.units) disableDecrement($productUI, true);
    else disableDecrement($productUI, false);
}

function renderStoreImport(total) {
    document.getElementById('total').innerHTML = total.toFixed(2);
}

function renderListProduct(title, products) {
    const $listTitleUI = document.getElementById('list-title');
    $listTitleUI.innerHTML = title;
    const $listUI = document.getElementById('list');
    $listUI.innerHTML = '';
    products.forEach(prod => $listUI.innerHTML +=
        '<li>' + prod.toString() + '</li>');
}

function productToTr(product) {
    let $productUI = document.createElement('tr');
    $productUI.id = 'prod-' + product.id;
    $productUI.innerHTML = `
    <td>${product.id}</td>
    <td>${product.name}</td>
    <td>${product.units}</td>
    <td>${product.price}</td>
    <td>${product.productImport().toFixed(2)} €</td>`;
    let $actionTD = document.createElement('td');
    const buttons=[
        {icon: 'expand_less', fn: increaseUnits},
        {icon: 'expand_more', fn: decreaseUnits},
        {icon: 'delete', fn: delProd},
        {icon: 'edit', fn: editProd},
    ];
    buttons.forEach(button=>{
        let $icon=document.createElement('button');
        $icon.className="mdc-icon-button material-icons";
        $icon.innerHTML=button.icon;
        $icon.addEventListener('click', button.fn);
        $actionTD.appendChild($icon);
    })
    $productUI.appendChild($actionTD);
    return $productUI;
}

function getProdIdFromIcon(icon) {
    return Number(icon.parentElement.parentElement.id.split('-')[1]);
}

function renderEditForm(product, edit) {
    document.getElementById('forms').classList.remove('hidden');
    const $formUI = document.getElementById('new-prod');
    $formUI.querySelector('legend').textContent = edit?'Editar producto':'Nuevo producto';
    $formUI.querySelector('button[type="submit"]').textContent = edit?'Modificar':'Añadir';
    if (edit) {
        const $idUI = document.getElementById('new-id');
        $idUI.parentElement.classList.remove('hidden');
        $idUI.value = product.id;
        document.getElementById('new-name').value = product.name;
        const $unitsUI = document.getElementById('new-units');
        $unitsUI.parentElement.classList.remove('hidden');
        $unitsUI.value = product.units;
        document.getElementById('new-price').value = product.price;
    } else {
 		document.getElementById('new-id').value='';		// Boramos la id para que al hacer el 'reset' lo vacíe y no lo recargue
        $formUI.reset();    // Borramos el form
        document.getElementById('new-id').parentElement.classList.add('hidden');
        document.getElementById('new-units').parentElement.classList.add('hidden');
    }
}

function disableDecrement($productUI, disable) {
    const $iconUI = $productUI.lastChild.children[1];
    if (disable) $iconUI.setAttribute('disabled', 'disabled');
    else $iconUI.removeAttribute('disabled');
}

function showSection(section) {
    const sections=['productos', 'forms', 'listados'];
    sections.forEach(item=> item==section?
        document.getElementById(item).classList.remove('hidden'):
        document.getElementById(item).classList.add('hidden')
    )
}

function activeMenuItem(li) {
    li.parentElement.querySelector('li.active').classList.remove('active');
    li.classList.add('active');
}
