const mongoose = require('mongoose')
//const { mongoPath } = require('./config.json')
const mongoPath = 'mongodb+srv://ivanguijarro:Ivanguijarro99@poro-bot.umx20.mongodb.net/porobot?retryWrites=true&w=majority'

module.exports = async () => {
    await mongoose.connect(mongoPath, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    })
    return mongoose
}
