const { default: mongoose } = require('mongoose');
const mongosse = require('mongoose');

const CaKsSchema = mongoose.Schema({

    ca: {
        type: Number,
        required: true
    },
    query: [
        {
            key: {Number},
            ks: {Number}
        }

    ]

});

let Caks= module.exports = mongoose.model('Caks', CaKsSchema);