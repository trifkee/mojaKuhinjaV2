require('../models/database')
const kategorije = require('../models/kategorije')
const jelovnik = require('../models/jelovnik')
const korpa = require('../models/korpa')

// GET -POCETNA-
exports.pocetna = async(req,res)=>{
   try{
    const kategorija = await kategorije.find({})
    const latest = await jelovnik.find({}).sort({_id:-1}).limit(1)
    const jelo = {latest}
  

    res.render('index', {title:'Moja Kuhinja', kategorija, jelo,})
   }catch(error){
       res.status(500).send( {message:error.message || "Nastala je greska!"})
   }
}
// 

exports.pocetnaAdmin = async(req,res)=>{
    try{
        const kategorija = await kategorije.find({})
        const latest = await jelovnik.find({}).sort({_id:-1}).limit(1)
        const jelo = {latest}
        res.render('index2', {title:'Moja Kuhinja', kategorija, jelo})
       }catch(error){
           res.status(500).send( {message:error.message || "Nastala je greska!"})
       }
}

// GET -MENI-
exports.meniKategorija = async(req,res)=>{
    try{
        
        let kategorijaId = req.params.id
        const kategorijaPoId = await jelovnik.find({'category' : kategorijaId})
 
        res.render('menu', {title:'Moja Kuhinja - meni ', kategorijaPoId, currentCategory: kategorijaId})
    }catch(error){
        res.status(500).send( {message:error.message || "Nastala je greska!"})
    }
 }
// 

// 
// GET -JELO-
exports.jelo = async(req,res)=>{
    try{
        let jeloId = req.params.id
        const jelo = await jelovnik.findById(jeloId)

        res.render('jelo', {title:'Moja Kuhinja - jelo ', jelo})
    }catch(error){
        res.status(500).send( {message:error.message || "Nastala je greska!"})
    }
 }

 // GET -JELO ISTAKNUTO-
exports.istaknuto = async(req,res)=>{
    try{
        let jeloId = req.params.id
        const jelo = await jelovnik.findById(jeloId)
        res.render('jelo-latest', {title:'Poslednje dodato', jelo})
    }catch(error){
        res.status(500).send( {message:error.message || "Nastala je greska!"})
    }
 }

 exports.dodajJelo = async (req, res) =>{
    const infoErrorsObj = req.flash('infoErrors')
    const infoSubmitObj = req.flash('infoSubmit')
    res.render('dodaj-jelo', {title:'Dodaj jelo na meni', infoErrorsObj, infoSubmitObj,})
 }

 exports.dodajJeloSubmit = async (req,res) =>{
    try{

        let imageUploadFile
        let uploadPath
        let newImageName

        if(!req.files || Object.keys(req.files).length === 0){
            console.log('Slika nije uplodovana!')
        }else{

            imageUploadFile = req.files.image
            newImageName =  Date.now() + imageUploadFile.name

            uploadPath = require('path').resolve('./')+'/public/img/jelaSlike/' + newImageName //Putanja gde se cuvaju slike, vazno zbog CSSa
            imageUploadFile.mv(uploadPath, function(err){
                if(err) return res.status(500).send(err)
            })

        }

        const novoJelo = new jelovnik({
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            calories: req.body.calories,
            time: req.body.time,
            peoples: req.body.peoples,
            price: req.body.price,
            image: newImageName,
        })

        await novoJelo.save()

        req.flash('infoSubmit', 'Uspesno si dodao/la jelo!')
        res.redirect('/dodaj-jelo')
    }catch(error){
        
        req.flash('infoErrors', error)
        res.redirect('/dodaj-jelo')
    }
 }

//  GET -KORPA-
exports.korpa = async(req,res)=>{
    try{
       
        res.render('korpa', {title:'Moja Kuhinja - korpa '})
    }catch(error){
        res.status(500).send( {message:error.message || "Nastala je greska!"})
    }
 }

//  ----

exports.dodajKorpa = (req, res, next) =>{
    const dodatoJelo = jelovnik.findById(req.body.id)[0]
    korpa.save(dodatoJelo)
    console.log(korpa.getKorpa())
    res.end('Sacuvano')
}

//----

async function obrisiJelo() {
    try {
        await jelovnik.deleteOne({ name: 'name' });
    } catch (error) {
        console.log(error)
    }
}


// ------------------------------------------------------
// DODAJ JELA
// async function insertDymmyRecipeData(){
//   try {
//     await jelovnik.insertMany([
//       { 
//         'name':'Pasta u sosu od pečenih paprika',    
//         'image':'testenine_paprika_sos.jpg',
//         'description':'Iskoristite sveže paprike dok se još uvek mogu naći na pijaci i napravite ukusnu pastu. Ako ostavljate pečene paprike za zimnicu, onda ovaj fini sos možete praviti i tokom zime. Naravno, uvek birajte integralnu testeninu.Potrebno je:200 g kratke integralne testenine (ječmene, speltine,pšenične)Za sos je potrebno pripremiti: 4 pečene paprike, 50g tofu sira, 4-5 čenova belog luka, 3 kašike nutritivnog kvasca, 1 kašika maslinovog ulja, 240 ml biljnog mleka, 1 kašičica tucane ljute paprike, ½ kašičice dimljene paprike, so, biber, suvi bosiljak, Oljuštiti pečenu papriku. Izmiksati štapnim mikserom ili u blenderu sve sastojke. Skuvati testeninu. Dodati sos kuvanoj testenini i ostaviti na vrućoj ringli 1-2 minuta da se ukusi povežu.',
//         'calories':'320',
//         'time' : '45',
//         'peoples': '2',                    
//         'category' : 'rucak',
//         'price' : '150'
//       },
//     ]);
//   } catch (error) {
//     console.log('err', + error)
//   }
// }

// insertDymmyRecipeData();




// -----------------------------------
// async function dodajKategorije(){
//     try{
//         await kategorije.insertMany([
//             {
//                 'ime':'Dorucak',
//                 'slika':'dorucak.jpg',
//             },
//             {
//                 'ime':'Rucak',
//                 'slika':'rucak.jpg',
//             },
//             {
//                 'ime':'Vecera',
//                 'slika':'vecera.jpg',
//             },
//             {
//                 'ime':'Uzina',
//                 'slika':'uzina.jpg',
//             },
//         ])
//     }catch(error){
//         console.log('Greska!', + error)
//     }
// }

// dodajKategorije()