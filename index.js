const Discord = require("discord.js");
const client = new Discord.Client();

const config = require("./config.json");
const command = require("./command");

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
    if (message.member.hasPermission("ADMINISTRATOR")) {
      client.user.setPresence({
        activity: {
          name: content,
          type: 0,
        },
      });
    }
  });
});

//client.login(config.token);
client.login(process.env.poro_token)
