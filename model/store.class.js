'use strict'
//const Product = require('./product.class');

class Store {
    constructor (id) {
	    this.id=Number(id);
    	this.products=[];
    }

    findProduct(id) {
        return this.products.find(prod=>prod.id==id);
    }

    addProduct(id, name, price) {
		if (this.findProduct(id))
			return false;
        this.products.push(new Product(id, name, price));
        return true;
    }

    delProduct(id) {
        const product=this.findProduct(id);
        if (!product || product.units) {
            return false;
        }
		this.products=this.products.filter(product=>product.id!=id);
        return true;
    }

    editProduct(id, name, units, price) {
        const product=this.findProduct(id);
        if (!product) {
            return false;
        }
        product.name = name;
        product.units = units;
        product.price = price;
        return true;
    }

    changeProductUnits(id, units) {
        const product=this.findProduct(id);
        if (!product) {
            return false;
        }
        return product.changeUnits(units);
    }

    totalImport() {
        return this.products.reduce((total, prod)=>total+prod.productImport(), 0);
    }

    underStock(stock) {
        return this.products.filter(prod=>prod.units<stock);
    }

    orderByUnits() {
        return this.products.sort((prodA,prodB)=>prodB.units-prodA.units);
    }

    orderByName() {
        return this.products.sort((prodA,prodB)=>prodA.name.localeCompare(prodB.name));
    }

}

//module.exports = Store;
