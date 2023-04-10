const e=require("express"),t=require("../models/kcks"),s=require("../models/CaKs"),a=require("../models/Barras"),i=require("../models/BarrasEstribos"),r=require("../service/pdf-service"),{Error:c}=require("mongoose"),{default:d}=require("puppeteer"),o=e.Router();class n{constructor(){this.bw=0,this.h=0,this.e=0,this.d=0,this.fck=0,this.nca=0,this.pca=0,this.msk1=0,this.msk2=0,this.vsk=0,this.msd1=0,this.msd2=0,this.vsd=0,this.pkc=0,this.pks=0,this.pas=0,this.nkc=0,this.nks=0,this.nas=0,this.eca=0,this.fcd=0,this.fyk=0,this.fyd=0,this.vrd2=0,this.alp2=0,this.vc=0,this.ftcm=0,this.fctkinf=0,this.ftd=0,this.vsw=0,this.asw=0}}o.get("/",((e,t)=>{t.render("home")}));let k={},y={};function h(e){return Object.assign(Object.create(Object.getPrototypeOf(e)),JSON.parse(JSON.stringify(e)))}o.post("/result",(async(e,r)=>{const c=new n;switch(c.bw=e.body.ibw,c.h=e.body.ih,c.e=e.body.ie,c.d=c.h-c.e,c.fck=e.body.ifck,c.nca=e.body.inca,c.pca=e.body.ipca,c.eca=e.body.ieca,c.msk1=e.body.imsk1,c.msk2=e.body.imsk2,c.vsk=e.body.ivsk,c.msd1=(1.4*e.body.imsk1*100).toFixed(3),c.msd2=(1.4*e.body.imsk2*100).toFixed(3),c.vsd=(1.4*e.body.ivsk).toFixed(3),c.pkc=(c.bw*Math.pow(c.d,2)/c.msd1).toFixed(3),c.nkc=(c.bw*Math.pow(c.d,2)/c.msd2).toFixed(3),parseInt(c.eca)){case parseInt(25):c.fyk=25;break;case parseInt(50):c.fyk=50;break;case parseInt(60):c.fyk=60;break;default:c.fyk=0}c.fyd=(c.fyk/1.15).toFixed(3),c.fcd=(1e3*c.fck/1.4).toFixed(3),c.alp2=(1-c.fck/250).toFixed(3),c.vrd2=(.27*c.alp2*c.fcd*(c.bw/100)*(c.d/100)).toFixed(3),c.ftcm=(.3*Math.pow(c.fck,2/3)).toFixed(3),c.fctkinf=(.7*c.ftcm).toFixed(3),c.ftd=(1e3*c.fctkinf/1.4).toFixed(3),c.vc=(.6*c.ftd*(c.bw/100)*(c.d/100)).toFixed(3),c.vsw=(c.vsd-c.vc).toFixed(3),c.vsw>0?c.asw=(c.vsw/(c.d/100*.9*c.fyd)).toFixed(3):c.asw=(.14*c.bw).toFixed(3);try{class e{constructor(){this.tabPkc=0,this.tabPks=0,this.tabNkc=0,this.tabNfks=0}}const d=new e;let o,n,p,u;(await t.aggregate([{$match:{fck:parseInt(c.fck),"query.kc":{$gte:parseFloat(c.pkc)}}},{$unwind:"$query"},{$match:{"query.kc":{$gte:parseFloat(c.pkc)}}},{$sort:{"query.kc":1}},{$limit:1}]).exec()).map((e=>{let t=e.query;o=t.l_table,d.tabPkc=t.kc})),(await s.aggregate([{$match:{ca:parseInt(c.pca),"query.key":{$eq:parseInt(o)}}},{$unwind:"$query"},{$match:{"query.key":{$eq:parseInt(o)}}}]).exec()).map((e=>{let t=e.query;n=t.ks,d.tabPks=t.ks})),c.pks=n,c.pas=(c.pks*c.msd1/c.d).toFixed(3),(await t.aggregate([{$match:{fck:parseInt(c.fck),"query.kc":{$gte:parseFloat(c.nkc)}}},{$unwind:"$query"},{$match:{"query.kc":{$gte:parseFloat(c.nkc)}}},{$sort:{"query.kc":1}},{$limit:1}]).exec()).map((e=>{let t=e.query;p=t.l_table,d.tabNkc=t.kc})),(await s.aggregate([{$match:{ca:parseInt(c.nca),"query.key":{$eq:parseInt(p)}}},{$unwind:"$query"},{$match:{"query.key":{$eq:parseInt(p)}}}]).exec()).map((e=>{let t=e.query;u=t.ks,d.tabNks=t.ks})),c.nks=u,c.nas=(c.nks*c.msd2/c.d).toFixed(3);let b=await a.find({},{"query._id":0,_id:0}),f=await i.find({},{_id:0,"query._id":0});k=h(c),y=h(d),r.render("resultado",{resultado:c,tab:d,bar:b,barEst:f})}catch(e){console.log(e.message)}})),o.get("/result",(async(e,t)=>{try{let e=await a.find({},{"query._id":0,_id:0}),s=await i.find({},{_id:0,"query._id":0});t.render("resultado",{resultado:k,tab:y,bar:e,barEst:s})}catch(e){console.log(e.message)}})),o.get("/pdf",(async(e,t)=>{try{let e=await a.find({},{"query._id":0,_id:0}),s=await i.find({},{_id:0,"query._id":0}),c=await r.buildPDF("printResult",{cloneObj:k,cloneTab:y,bar:e,barEst:s});t.set({"Content-Type":"application/pdf","Content-Length":c.length}),t.send(c)}catch(e){console.log(e.message)}})),module.exports=o;