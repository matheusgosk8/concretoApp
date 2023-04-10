const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();


const kcks = require('../models/kcks');
const Caks = require('../models/CaKs');
const Barras = require('../models/Barras');
const BarrasEstribos = require('../models/BarrasEstribos');


router.get('/', async(req, res)=>{
  let finalData = [];

    try{

        let Objcol1 = await kcks.find({fck: 20}, {"query.l_table": 0, "_id":0});
        let Objcol2 = await kcks.find({fck: 25}, {"query.l_table": 0, "_id":0});
        let Objcol3 = await kcks.find({fck: 30}, {"query.l_table": 0, "_id":0});
        let Objcol4 = await kcks.find({fck: 35}, {"query.l_table": 0, "_id":0});
        let Objcol5 = await kcks.find({fck: 40}, {"query.l_table": 0, "_id":0});
        let Objcol6 = await kcks.find({fck: 45}, {"query.l_table": 0, "_id":0});
        let Objcol7 = await kcks.find({fck: 50}, {"query.l_table": 0, "_id":0});

        let Objcol8 = await Caks.find({ca: 25}, {"query._id": 0, "query.key": 0});
        let Objcol9 = await Caks.find({ca: 50}, {"query._id": 0, "query.key": 0});
        let Objcol10 = await Caks.find({ca: 60}, {"query._id": 0, "query.key": 0});
       
        let col1 =[];
        Objcol1.map((c1)=>{
          let val;
          val = c1.query;
          col1 = val.kc;
        })
        let col2 =[];
        Objcol2.map((c1)=>{
          let val;
          val = c1.query;
          col2 = val.kc;
        })
        let col3 =[];
        Objcol3.map((c1)=>{
          let val;
          val = c1.query;
          col3 = val.kc;
        })
        let col4 =[];
        Objcol4.map((c1)=>{
          let val;
          val = c1.query;
          col4 = val.kc;
        })
        let col5 =[];
        Objcol5.map((c1)=>{
          let val;
          val = c1.query;
          col5 = val.kc;
        })
        let col6 =[];
        Objcol6.map((c1)=>{
          let val;
          val = c1.query;
          col6 = val.kc;
        })
        let col7 =[];
        Objcol7.map((c1)=>{
          let val;
          val = c1.query;
          col7 = val.kc;
        })

        let col8 = [];
        Objcol8.map((v1)=>{
          let val;
          val = v1.query;
          col8 = val;
        })

        let col9 = [];
        Objcol9.map((v1)=>{
          let val;
          val = v1.query;
          col9 = val;
        })

        let col10 = [];
        Objcol10.map((v1)=>{
          let val;
          val = v1.query;
          col10 = val;
        })

    


        /*----- Barras---- */
        let barras = await Barras.find({},{"query._id": 0, "_id":0});



        /* ---- Barras etribos ---- */
        let BarrasEst = await BarrasEstribos.find({}, {"_id": 0, "query._id": 0});
 





   
        res.render('data', 
        {col1: col1,
        col2: col2,
        col3: col3,
        col4: col4,
        col5: col5,
        col6: col6,
        col7: col7,
        col8: col8,
        col9: col9,
        col10: col10,
        bar: barras,
        barEst:BarrasEst
        }
        );


  

    }catch(error){
        console.log(error.message)
    }

});

module.exports = router;