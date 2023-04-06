const mongoose =require('mongoose');

let BarrasSchema = mongoose.Schema({
    nb:{
        type: Number,
        required: true
    },
    query: 
    [
        {
            dm: {Number},
            as: {Number}
        }
    ]
});

let Barras = module.exports = mongoose.model('Barras', BarrasSchema);