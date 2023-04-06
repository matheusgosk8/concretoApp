const puppettear = require('puppeteer');
const fs = require('fs-extra');
const hbs = require('handlebars');
const path = require('path');


const compile = async(templateName, data)=>{
    const filePath = path.join(__dirname, "..",'views',`${templateName}.handlebars`);
    const html = await fs.readFile(filePath, 'utf-8');
    return hbs.compile(html)(data,{
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true});
}




async function buildPDF(templateName, data){
    try{
        const browser = await puppettear.launch();
        const page = await browser.newPage();
        

        const content = await compile(templateName, data);
     
        
        await page.emulateMediaType('screen');
        await page.setContent(content);
        await page.addStyleTag({path:'./public/css/print.css'});

        const pdf = await page.pdf({
            format: 'A4',
            printBackground: true
        });

        console.log('Page printed whit handlebars');
        await browser.close();

        return pdf;
 

    }catch(error){
        console.log(error.message);
    }


}

module.exports = {buildPDF, compile};