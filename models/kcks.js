const mongoose = require('mongoose');

let kcksSchema = mongoose.Schema({
    fck: {
        type: Number,
        required: true
    },
    query:{
        kc: Number,
        l_tabela: Number
    }

})

let KcKs = module.exports = mongoose.model('Kcks', kcksSchema );