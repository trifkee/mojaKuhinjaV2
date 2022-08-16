const mongoose = require('mongoose')

const jelovnikSchema =  new mongoose.Schema({
    name:{
        type:String,
        required:'Obavezno polje',
    },

    image:{
        type:String,
        required:'Obavezno polje',
    },

    description:{
        type:String,
    },

    calories:{
        type:Number,
    },

    time:{
        type:Number,
    },
    
    peoples:{
        type:Number,
    },

    category:{
        type:String,
    },

    price:{
        type:Number,
    },


})

// 
module.exports = mongoose.model('jelovnik', jelovnikSchema)