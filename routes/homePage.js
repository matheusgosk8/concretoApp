const express = require('express');
const kcks = require('../models/kcks');
const CaKs = require('../models/CaKs');
const Barras = require('../models/Barras');
const BarrasEstribos = require('../models/BarrasEstribos');
const pdfService = require('../service/pdf-service');
const { Error } = require('mongoose');
const { default: puppeteer } = require('puppeteer');



const router = express.Router();

class resultados{
    constructor(){

        this.bw = 0;
        this.h =0;
        this.e =0;
        this.d =0;
        this.fck =0;
        this.nca =0;
        this.pca=0;
        this.msk1 =0;
        this.msk2 =0;
        this.vsk =0;
        this.msd1 =0;
        this.msd2 =0;
        this.vsd =0;
        this.pkc = 0;
        this.pks =0;  
        this.pas =0;
        this.nkc = 0;
        this.nks =0;
        this.nas =0;

        //Etribos
        this.eca =0;
        this.fcd =0;
        this.fyk = 0;
        this.fyd = 0;
        this.vrd2 = 0;
        this.alp2 = 0;
        this.vc = 0;
        this.ftcm = 0;
        this.fctkinf = 0;
        this.ftd = 0;
        this.vsw = 0;
        this.asw = 0;
    }
}

router.get('/', (req, res)=>{
    res.render('home');
})


let printResults  = {};
let cloneObj ={};
let cloneTab ={};
let cloneBarras ={};
let cloneEst ={};

function clone(instance){
  return Object.assign(
    Object.create(

        Object.getPrototypeOf(instance),
    ),
      JSON.parse(JSON.stringify(instance)),
  );
}

router.post('/result', async(req, res)=>{

    const newResultado = new resultados();
        newResultado.bw = req.body.ibw;
        newResultado.h =  req.body.ih;
        newResultado.e =  req.body.ie;
        newResultado.d = (newResultado.h - newResultado.e);
        newResultado.fck= req.body.ifck;
        newResultado.nca= req.body.inca;
        newResultado.pca= req.body.ipca;
        newResultado.eca= req.body.ieca;
        newResultado.msk1=req.body.imsk1;
        newResultado.msk2=req.body.imsk2;
        newResultado.vsk =req.body.ivsk;
        newResultado.msd1= (req.body.imsk1*1.4*100).toFixed(3);
        newResultado.msd2= (req.body.imsk2*1.4*100).toFixed(3);
        newResultado.vsd = (req.body.ivsk*1.4).toFixed(3);

      
        newResultado.pkc = ((newResultado.bw*(Math.pow(newResultado.d,2)))/newResultado.msd1).toFixed(3);

        newResultado.nkc = ((newResultado.bw*(Math.pow(newResultado.d,2)))/newResultado.msd2).toFixed(3);

     

        switch(parseInt(newResultado.eca)){
          case parseInt(25):
             newResultado.fyk = 25;
             break;
          case parseInt(50): 
             newResultado.fyk = 50;
             break;
          case parseInt(60):
             newResultado.fyk = 60;
             break
          default:  newResultado.fyk =0;
        }

       
        //Cálculos dos estribos:
        newResultado.fyd = (newResultado.fyk/1.15).toFixed(3);
        newResultado.fcd =( (newResultado.fck*1000)/1.4).toFixed(3);
        newResultado.alp2 = (1-(newResultado.fck/250)).toFixed(3);
        newResultado.vrd2 = (0.27*newResultado.alp2*newResultado.fcd*(newResultado.bw/100)*(newResultado.d/100)).toFixed(3);
        newResultado.ftcm =(0.3*Math.pow(newResultado.fck, (2/3))).toFixed(3);
        newResultado.fctkinf = (0.7*newResultado.ftcm).toFixed(3);
        newResultado.ftd = (1000*newResultado.fctkinf/1.4).toFixed(3); 
        newResultado.vc =( 0.6*newResultado.ftd*(newResultado.bw/100)*(newResultado.d/100)).toFixed(3);

        newResultado.vsw =( newResultado.vsd - newResultado.vc).toFixed(3);

        if(newResultado.vsw > 0){
           newResultado.asw = (newResultado.vsw/(0.9*(newResultado.d/100)*newResultado.fyd)).toFixed(3);
        }else{
          newResultado.asw = (newResultado.bw*0.14).toFixed(3);
        }
        try{
            class Tab{
                constructor(){

                 this.tabPkc = 0;
                 this.tabPks = 0;
    
                 this.tabNkc = 0;
                 this.tabNfks= 0;
 
                }
            
            };

            const newTab =new Tab();
            /*---------- Armadura positiva ------- */

            let pkcTab = await kcks.aggregate([
                {
                  $match: {
                    fck: parseInt(newResultado.fck),
                    "query.kc": { $gte: parseFloat(newResultado.pkc),},},
                },
                {$unwind: "$query"},
                {
                  $match: {
                    "query.kc": {$gte: parseFloat(newResultado.pkc)},},
                },
                {
                  $sort:{ "query.kc": 1},
                },
                {$limit:1},
              ]).exec();

            let pkey ;
              
              pkcTab.map((index)=>{
                let val = index.query;
                pkey = val.l_table

                newTab.tabPkc = val.kc;
             
              })

            
              let pksTab = await CaKs.aggregate(
                [
                  {
                    $match: {
                      ca: parseInt(newResultado.pca),
                      "query.key": {
                        $eq: parseInt(pkey),},},},
                  {$unwind: "$query",},
                  {$match: {
                      "query.key": {
                        $eq: parseInt(pkey),},},},
                ]
              ).exec();

              let pks;
              pksTab.map((index)=>{
                let val = index.query;
                pks = val.ks;

                newTab.tabPks = val.ks;
              })
              newResultado.pks = pks;
              newResultado.pas = ((newResultado.pks*newResultado.msd1)/newResultado.d).toFixed(3);

              /* ------Armadura negativa ------- */

              let nkcTab = await kcks.aggregate([
                {
                  $match: {
                    fck: parseInt(newResultado.fck),
                    "query.kc": { $gte: parseFloat(newResultado.nkc),},},
                },
                {$unwind: "$query"},
                {
                  $match: {
                    "query.kc": {$gte: parseFloat(newResultado.nkc)},},
                },
                {
                  $sort:{ "query.kc": 1},
                },
                {$limit:1},
              ]).exec();

            let nkey ;
              
              nkcTab.map((index)=>{
                let val = index.query;
                nkey = val.l_table

                newTab.tabNkc = val.kc;
             
              })

              let nksTab = await CaKs.aggregate(
                [
                  {
                    $match: {
                      ca: parseInt(newResultado.nca),
                      "query.key": {
                        $eq: parseInt(nkey),},},},
                  {$unwind: "$query",},
                  {$match: {
                      "query.key": {
                        $eq: parseInt(nkey),},},},
                ]
              ).exec();

              let nks;
              nksTab.map((index)=>{
                let val = index.query;
                nks = val.ks;

                newTab.tabNks = val.ks;
              })

              newResultado.nks = nks;
              newResultado.nas = ((newResultado.nks*newResultado.msd2)/newResultado.d).toFixed(3);


              // tabelas das barras
              let barras = await Barras.find({},{"query._id": 0, "_id":0});
              // Estribos
              let BarrasEst = await BarrasEstribos.find({}, {"_id": 0, "query._id": 0});

             
              // Clonagens pra impressão
             cloneObj =    clone(newResultado);
             cloneTab =    clone(newTab);
             // Clonagens pra impressão
            
            res.render('resultado',{resultado: newResultado, tab: newTab, bar: barras, barEst: BarrasEst});


        }catch(erro){
            console.log(erro.message)
        }

      
})


router.get('/result', async(req, res)=>{

  try{
    let barras = await Barras.find({},{"query._id": 0, "_id":0});
    let BarrasEst = await BarrasEstribos.find({}, {"_id": 0, "query._id": 0});

    res.render('resultado',{resultado: cloneObj, tab: cloneTab, bar: barras, barEst: BarrasEst});

   
  }catch(err){
    console.log(err.message)
  }

   
})


router.get('/pdf', async(req, res)=>{
    
    try{
      // // tabelas das barras
      let bar = await Barras.find({},{"query._id": 0, "_id":0});
      // // Estribos
      let barEst = await BarrasEstribos.find({}, {"_id": 0, "query._id": 0});
      let pdfBuffer =  await pdfService.buildPDF('printResult',{cloneObj, cloneTab, bar, barEst});
     

      res.set({ 'Content-Type': 'application/pdf', 'Content-Length': pdfBuffer.length });

      res.send(pdfBuffer); 

    }catch(error){
      console.log(error.message)
    }

});



module.exports = router;