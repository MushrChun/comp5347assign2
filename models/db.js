var mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/comp5347test', function () {
    console.log('mongodb connected')
})

module.exports = mongoose