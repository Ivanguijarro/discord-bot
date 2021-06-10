module.exports = client => {
    const channelId = '470503733613035526'
    client.on('guildMemberAdd', (member) => {
        console.log(member)

        const message = `¡Bienvenido/a <@${member.id}>!`

        const channel = member.guild.channels.cache.get(channelId)
        channel.send(message)
  })
}