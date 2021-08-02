const mongoose = require('./mongoose')

const reqString = {
    type: String,
    required: true
}

const welcomeSchema = mongoose.Schema({
    _id: reqString,
    guildId: reqString,
    text: {
        type: String,
        default: "Bienvenido"
    }
})

module.exports = mongoose.model('welcome-channels', welcomeSchema)