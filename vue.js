
const eventBus = new Vue();
Vue.component('product-form', {
	template: `
		<form @submit.prevent>
			<fieldset>
				<legend>Nuevo producto</legend>
				<!-- Aquí los inputs y botones del form -->
				<div class="form-group hidden">
					<label>Id:</label>
					<input type="text" class="form-control" readonly="readonly" v-model="newProd.id">
				</div>
				<div class="form-group">
					<label>Nombre:</label>
					<input type="text" class="form-control" required="" v-model="newProd.name">
				</div>
				<div class="form-group hidden">
					<label>Unidades:</label>
					<input type="number" class="form-control" required="" min="0" value="0" v-model="newProd.units">
				</div>
				<div class="form-group">
					<label>Precio/u.:</label>
					<input type="number" class="form-control" required="" min="0" step="0.01" v-model="newProd.price">
				</div>
				<button type="button" class="btn btn-default btn-primary" @click="addProduct()">Añadir</button>
				<button type="reset" class="btn btn-danger">Reset</button>
			</fieldset>
		</form>`,
		data: ()=> ({
			newProd: {},
		}),
		methods: {
			addProduct() {
				eventBus.$emit('addProduct', this.newProd);
			},
		},
});

Vue.component('product-table', {
	template: `
	<div>
		<table class="table table-striped table-hover">
			<thead class="thead-dark bg-primary">
				<tr>
					<th>Id</th>
					<th>Nombre</th>
					<th>Uds.</th>
					<th>Precio/u</th>
					<th>Importe</th>
					<th>Acciones</th>
				</tr>
			</thead>
			<tbody>
				<product-item v-for="product in almacen.products" :key="product.id" :product="product" @delProduct="delProduct">
				</product-item>
				<!-- Aquí insertaremos los productos-->
			</tbody>
		</table>
		<p class="lead float-right">Importe total del almacén: <strong>{{ almacen.totalImport() }} €</strong></p>
	</div>`,

	data: ()=> ({
		almacen: new Store(1),
	}),
	created() {
		eventBus.$on('addProduct', this.addProduct);
		this.almacen = new Store(1);
		this.almacen.addProduct(1, "Television", 1050);
		this.almacen.changeProductUnits(1, 150);
		this.almacen.addProduct(2, "Sombrero de paja", 5);
		this.almacen.changeProductUnits(2, 20);
	},
	
	methods: {
		maxId() {
			return this.almacen.products.reduce((max, item) => item.id > max? item.id: max, 0);
		},
		delProduct(id) {
			this.almacen.delProduct(id);
		},
		addProduct(newProd) {
			this.almacen.addProduct(this.maxId()+1, newProd.name, newProd.price);
		},
	}
});

Vue.component('product-item', {
	template: `
	<tr>
		<td>{{product.id}}</td>
		<td>{{product.name}}</td>
		<td>{{product.units}}</td>
		<td>{{product.price}}</td>

		<td>{{ (product.units*product.price).toFixed(2) }} €</td>
		<td>
		<button class="mdc-icon-button material-icons" @click="changeProductUnits(product.id, +1)">expand_less</button>
		<button class="mdc-icon-button material-icons" @click="changeProductUnits(product.id, -1)">expand_more</button>
		<button class="mdc-icon-button material-icons" @click="delProduct(product.id)">delete</button>
		<!-- <button class="mdc-icon-button material-icons">edit</button> -->
		</td>
	</tr>`,
	props: ['product'],
	data: ()=> ({
	}),
	methods: {
		delProduct(id) {
			this.$emit('delProduct', id);
		},
		changeProductUnits(id, units) {
			this.product.changeUnits(units);
		}
	}
});

var app = new Vue({
	el: '#app',
	data: {		
	},
});

app.created;