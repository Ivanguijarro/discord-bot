const command = require("./command")

require("module-alias/register")
const userUtils = require("@user")

module.exports = {
  commands: ["play", "playsound", "p"],
  expectedArgs: "<link|video name>",
  minArgs: 1,
  maxArgs: 10,
  callback: async (message, args, text, client) => {
    const { channel } = message.member.voice
    if (!channel) return message.channel.send(`**${message.author.username}**, necesitas estar en un canal de voz`)

    if (message.content.includes("www.youtube.com/playlist")) {
      await client.player.playlist(message, {
        search: args[0],
        maxSongs: -1,
      })
      await message.channel.send(
        `${emojis[keys[Math.floor(Math.random() * keys.length)]]} La playlist se ha puesto a la cola`
      )
    } else {
      let audio = await client.player.play(message, text)
      if (audio)
        await message.channel.send(
          `${
            audio.name.includes("Pigstep")
              ? emojis.musicDiscPigstep
              : emojis[keys[Math.floor(Math.random() * keys.length)]]
          } Reproduciendo **${audio.name}**`
        )
    }
    await userUtils.incUserSchema(message.guild, message.author, "music", 1)
  },
}