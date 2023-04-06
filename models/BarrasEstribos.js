const mongoose = require ("mongoose");

let BarrasEstribosSchema = mongoose.Schema({
    esep:{
        type: Number,
        required: true
    },
    query: [
        {
            dm: {Number},
            asw: {Number}
        }
    ]

});

let BarrasEstribos = module.exports = mongoose.model('barrasEstribos', BarrasEstribosSchema);