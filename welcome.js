

//module.exports = (client) => {
  const channelId = '470503733613035526'
  const targetChannel = '829296012945784864'

  client.on('guildMemberAdd', (member) => {
    console.log(member)
    console.log("Nuevo miembro")

    const message = `¡Bienvenido al servidor <@${member.id}>! Porfavor revisa las ${member.guild.channels.cache.get(targetChannel).toString()}`

    const channel = member.guild.channels.cache.get(channelId)
    channel.send(message)
  })
//} 