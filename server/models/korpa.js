module.exports = function Cart(oldCart){
    this.items = oldCart.items ?? {}
    this.totalQty = oldCart.totalQty ?? 0
    this.totalPrice = oldCart.totalPrice ?? 0

    this.add = function(item, id){
        let storedItem = this.items[id]
        if(!storedItem){
            storedItem = this.items[id] = {item: item.name, qty:0, price:item.price, image: item.image, id: id}
        }

        storedItem.qty++
        storedItem.price = storedItem.price * storedItem.qty

        this.totalQty++
        this.totalPrice = this.totalPrice + storedItem.price

        if(this.totalPrice < 0){
            this.totalPrice = 0;
        }
    }

    this.generateArray = function(){
        let arr = []
        for(let id in this.items){
            arr.push(this.items[id])
        }

        return arr
    }
}