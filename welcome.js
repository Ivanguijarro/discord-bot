const mongo = require('./mongo')
const mongoose = require('mongoose')
const command = require('./command')
const welcomeSchema = require('./schemas/welcome-schema')

async function getSchema(guild) {
  let result = await welcomeSchema.findOne({
    guildId: guild.id,
  })
  if (!result) {
    await new profileSchema({
      guildId: guild.id,
    }).save()
    result = await welcomeSchema.findOne({
      guildId: guild.id,
    })
  }
  return result
}

module.exports = client => {
    const cache = {}
    
    command(client, 'setwelcome', async (message) => {
        const { member, channel, content, guild} = message

        if(!member.hasPermission('ADMINISTRATOR')){
            channel.send('No tienes permisos para usar ese comando')
            return
        } 
        
        let text = content

        const split = text.split(' ')

        if(split.length < 2){
          channel.send('Introduce un mensaje de bienvenida')
          return
        }

        split.shift()
        text = split.join(' ')

        await getSchema(guild) 

        await welcomeSchema.updateOne({
          guildId: guild.id
        },{
          $set:{"text": text}
        })
        
        const onJoin = async member => { 
          const { guild } = member

          let data = cache[guild.id]

          if(!data){
            console.log('OBTENIENDO DE LA BASE DE DATOS')
            await mongo().then(async (mongoose) => {
              try{
                const result = getSchema(guild)

                cache[guild.id] = data = [result.channelId, result.text]
              } finally {
                mongoose.connection.close()
              }
            })
          }

          const channelId = data[0]
          const text = data[1]

          const channel = guild.channels.cache.get(channelId)
          channel.send(text)
        }

        command(client, 'simjoin', message => {
          onJoin(message.member)
        })

        client.on('guildMemberAdd', member => {
          onJoin(member)
        })
    })
}
