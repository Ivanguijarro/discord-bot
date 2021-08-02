const Discord = require("discord.js");

module.exports = (client) => {
  const channelId = '470503733613035526'

  const targetChannel = '829296012945784864'

  client.on('guildMemberAdd', (member) => {
    //console.log(member)
    console.log("Nuevo miembro")

    const welcomembed = new Discord.MessageEmbed()
        .setAuthor(`¡${member.user.tag} se ha unido!`, member.user.avatarURL())
        .setDescription(`¡Bienvenido al servidor <@${member.id}>! Porfavor revisa las ${member.guild.channels.cache.get(targetChannel).toString()}`)
        .setColor("#3374FF");
    const channel = member.guild.channels.cache.get(channelId)
    channel.send(welcomembed)
  })
  client.on('guildMemberRemove', (member) => {
    //console.log(member)
    console.log("Fuera miembro")

    const welcomembed = new Discord.MessageEmbed()
        .setAuthor(`¡${member.user.tag} se ha ido!`, member.user.avatarURL())
        .setDescription("¡Esperamos que vuelva pronto!")
        .setColor("#3374FF");
    const channel = member.guild.channels.cache.get(channelId)
    channel.send(welcomembed)
  })
} 