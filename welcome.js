module.exports = (client) => {
  const channelId = '470503733613035526'
  const targetChannel = '829296012945784864'

  client.on('guildMemberAdd', async(member) => {
    //console.log(member)
    console.log("Nuevo miembro")

    const message = `¡Bienvenido al servidor <@${member.id}>! Porfavor revisa las ${member.guild.channels.cache.get(targetChannel).toString()}`

    const channel = member.guild.channels.cache.get(channelId)
    channel.send(message)
  })
  client.on('guildMemberRemove', (member) => {
    //console.log(member)
    console.log("Fuera miembro")

    const message = `<@${member.id}> se ha ido, ojalá vuelva`

    const channel = member.guild.channels.cache.get(channelId)
    channel.send(message)
  })
} 