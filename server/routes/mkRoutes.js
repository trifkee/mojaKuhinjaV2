const express = require('express')
const router = express.Router()
const mkController = require('../controllers/mkController')
const jelovnik = require('../models/jelovnik')
// 
const Cart = require('../models/korpa')

//
router.get('/', mkController.pocetna)
router.get('/meni/:id', mkController.meniKategorija)
router.get('/meni/:id/:id', mkController.jelo)
router.post('/meni/:id/:id/dodaj', mkController.dodajKorpa )
router.get('/meni/:id/:id', mkController.istaknuto)
// router.get('/korpa', mkController.korpa)
// 
router.get('/tajniKljuc', mkController.pocetnaAdmin)
router.get('/dodaj-jelo', mkController.dodajJelo)
router.post('/dodaj-jelo', mkController.dodajJeloSubmit)
// router.get('/meni/:id/name' , mkController.meniKategorijaSortName)
//
router.get('/add-to-cart/:id', function(req, res, next){
    let jeloId = req.params.id
    let cart = new Cart(req.session.cart ? req.session.cart : {})

    jelovnik.findById(jeloId, function(err, jelo){
        if(err){
            return res.redirect('/')
        }else{
            let jelo2 = {...jelo._doc, id: jelo._id.toString()}
            console.log(jelo2)
            cart.add(jelo2, jelo.id)
            req.session.cart = cart
            // console.log(req.session.cart)
            res.redirect('/')
        }
    })
})

router.get('/remove-from-cart/:id', function(req, res, next){
    let jeloId = req.params.id

    // req.session.cart.items[id]?.qty > 0 ? req.session.cart.items[id].qty-- : req.session.cart.items.
    console.log(req.session.cart)
    req.session.cart.totalPrice -= req.session.cart.items[jeloId].price;
    delete req.session.cart.items[jeloId]
    req.session.cart.totalQty--;
    console.log(req.session.cart)
    

    res.redirect('/korpa')
})


router.get('/korpa-plus/:id', function(req,res, next){
    let jeloId = req.params.id

    let novaKolicina = req.session.cart.items[jeloId].qty++;
    let novaCena = req.session.cart.items[jeloId].price += req.session.cart.items[jeloId].price / novaKolicina
    console.log(`Nova cena je ${novaCena}`);
    req.session.cart.totalPrice += novaCena
    // console.log(req.session.cart)
    console.log(`Nova totalna cena je ${req.session.cart.totalPrice}`);

    res.redirect('/korpa')
})

router.get('/korpa-minus/:id', function(req,res, next){
    let jeloId = req.params.id

    let novaKolicina = req.session.cart.items[jeloId].qty--;
    let novaCena = req.session.cart.items[jeloId].price -= req.session.cart.items[jeloId].price / novaKolicina
    console.log(`Nova cena je ${novaCena}`);
    req.session.cart.totalPrice -= novaCena
    console.log(`Nova cena je ${req.session.cart.totalPrice}`);
    // console.log(req.session.cart)
    res.redirect('/korpa')
})

router.get('/korpa', function(req, res, next){

    try{
        if(!req.session.cart){
            return res.render('korpa', {products:null, totalPrice: 0})
        }
        let cart = new Cart(req.session.cart ? req.session.cart : {})
            return res.render('korpa', {products: cart.generateArray(), totalPrice: cart.totalPrice, title:'Moja Kuhinja - korpa '})
    }catch(error){
        res.status(500).send( {message:error.message || "Nastala je greska!"})
    }
})

// router.post('/checkout', function(req,res, next){
//     const mail = `
//     <p>Vasa porudzbina</p>
//     <ul>
//         <li>${req.body.name}</li>
//         <li>${req.body.qty}</li>
//         <li>${req.body.price}</li>
//     </ul>
//     `;
// })
//
module.exports = router