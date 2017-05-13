var mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/comp5347', function () {
    console.log('mongodb connected')
})

module.exports = mongoose