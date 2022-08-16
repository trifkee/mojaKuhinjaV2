const mongoose = require('mongoose')

const kategorijaSchema =  new mongoose.Schema({
    ime:{
        type:String,
        required:'Obavezno polje',
    },

    slika:{
        type:String,
        required:'Obavezno polje',
    }
})

// 
module.exports = mongoose.model('kategorije', kategorijaSchema)