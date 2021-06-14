const mongo = require('./mongo')
const command = require('./command')
const welcomeSchema = require('./schemas/welcome-schema')



module.exports = client => {
    command(client, 'setwelcome', async (message) => {
        const { member, channel, content, guild } = message

        if(!member.hasPermission('ADMINISTRATOR')){
            channel.send('No tienes permisos para usar ese comando')
            return
        }

        await mongo().then(async (mongoose) => { 
           try {
            await welcomeSchema.findOneAndUpdate({
              _id: guild.id
            }, {
                _id: guild.id, 
                channelId: channel.id,
                text,
            }, {
              upsert: true
            })
           } finally {
             mongoose.connection.close()
           }
        })
    })
}