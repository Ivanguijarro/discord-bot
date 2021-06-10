const Discord = require("discord.js");
const client = new Discord.Client();

const config = require("./config.json");
const command = require("./command");
//const firstMessage = require("./first-message");
const privateMessage = require("./private-message")


client.on("ready", () => {
  console.log("The client is ready!");

  command(client, "ping", (message) => {
    message.channel.send("Pong!");
  });
  command(client, "f", (message) => {
    message.channel.send("F");
  });
  command(client, "usuarios", (message) => {
    client.guilds.cache.forEach((guild) => {
      message.channel.send(
        `${guild.name} tiene un total de ${guild.memberCount} miembros`
      );
    });
  });
  command(client, ["clear", "borrar"], async (message) => {
    const numMsgs = message.content.split(" ")[1];
    const promises = [];
    if (message.member.hasPermission("ADMINISTRATOR")) {
        if (!numMsgs || isNaN(numMsgs) || numMsgs < 0)
            return await message.channel.send(
            "Comando incorrecto, indica el numero de mensajes!"
        );
      await message.channel.messages
        .fetch({ limit: parseInt(numMsgs) > 50 ? 50 : parseInt(numMsgs) + 1 })
        .then(async (results) => {
          results.forEach((m) => {
            promises.push(m.delete());
          });
          await Promise.all(promises);
        });
    }else{
        await message.channel.send("No tienes permisos para usar ese comando")
    }
  });
  command(client, "status", (message) => {
    const content = message.content.replace('/status ', '');
    client.user.setPresence({
      activity: {
        name: content,
        type: 0,
      },
    });
  });
  //firstMessage(client,'852262834238914640','hello world',['🏀'])
  privateMessage(client,'ping','Pong!')

  command(client, 'cct', async (message) => {// crear canales de texto
    const name = message.content.replace('/cct', '')
    if (message.member.hasPermission("ADMINISTRATOR")) {
      if(name == ''){
        return await message.channel.send("Comando incorrecto, indica el nombre del canal")
      }
      message.guild.channels.create(name, {
        type: 'text',
      }).then((channel) => {
        console.log(channel)
      })
      return await message.channel.send("¡Canal de texto creado!")
    }else{
        await message.channel.send("No tienes permisos para usar ese comando")
    }
  })
  command(client, 'ccv', async (message) => { //  crear canales de voz 
    const name = message.content.replace('/ccv', '')
    if (message.member.hasPermission("ADMINISTRATOR")) {
      if(name == ''){
        return await message.channel.send("Comando incorrecto, indica el nombre del canal")
      }
      message.guild.channels.create(name, {
        type: 'voice',
      }).then((channel) => {
        console.log(channel)
      })
      return await message.channel.send("¡Canal de voz creado!")
    }else{
        await message.channel.send("No tienes permisos para usar ese comando")
    }
  })
  command(client, 'embed', (message) => {
      const logo = 'https://i.imgur.com/ghtkRY4.jpg'

    const embed = new Discord.MessageEmbed()
    .setTitle('Codigo del bot')
    .setURL('https://github.com/Ivanguijarro/porobot')
    .setAuthor(message.author.username)
    .setThumbnail(logo)
    .setColor('#3374FF')

    message.channel.send(embed)
  })
});

client.login(config.token);
//client.login(process.env.poro_token);
