'use strict'

class Product {
    constructor (id, name, price, units=0) {
        this.id=Number(id);
        this.name=String(name);
        this.price=Number(price);
        this.units=Number(units);
    }

    changeUnits(units) {
        if (this.units+units<0) {
	        return false;
        }
        this.units+=units;
        return true;
    }

    productImport() {
        return this.price*this.units;
    }

    toString() {
        return `${this.name} (${this.units}): ${this.price.toFixed(2)} €/u => ${this.productImport().toFixed(2)} €`; 
    }

}

//module.exports = Product;
