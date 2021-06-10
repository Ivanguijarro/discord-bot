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
    const { member } = message
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
      message.channel.send(`<@${member.id}>, no tienes permisos para usar ese comando`)
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
    const { member } = message
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
        message.channel.send(`<@${member.id}>, no tienes permisos para usar ese comando`)
    }
  })
  command(client, 'ccv', async (message) => { //  crear canales de voz 
    const name = message.content.replace('/ccv', '')
    const { member } = message
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
      message.channel.send(`<@${member.id}>, no tienes permisos para usar ese comando`)
    }
  })
  command(client, 'codigo', (message) => {
    const logo = 'https://i.imgur.com/ghtkRY4.jpg'

    const embed = new Discord.MessageEmbed()
    .setTitle('Codigo del bot')
    .setURL('https://github.com/Ivanguijarro/porobot')
    .setAuthor(message.author.username)
    .setThumbnail(logo)
    .setColor('#3374FF')

    message.channel.send(embed)
  })
  command(client, ['comandos','c'], (message) => {
    const logo = 'https://i.imgur.com/ghtkRY4.jpg'

    const embed = new Discord.MessageEmbed()
    .setTitle('COMANDOS')
    .setThumbnail(logo)
    .setColor('#3374FF')
    //.setDescription("El prefijo del bot es '/'\n`Generales:`\n**/comandos** -> Muestra los comandos del bot\n**/usuarios** -> Muestra los usuarios totales del servidor\n**/codigo** -> Codigo javascript del bot (por si le interesa a alguien)\n`Otros:`\n**/ping** -> Puedes jugar al Ping Pong con el bot\n**/f** -> Press F to pay respects\n")
    .setDescription("El prefijo del bot es '/'")
    .addFields(
      {
        name: '`Generales:`',
        value: '**/comandos o /c** -> Muestra los comandos del bot\n**/serverinfo** -> Información del servidor\n**/usuarios** -> Muestra los usuarios totales del servidor\n**/codigo** -> Codigo javascript del bot (por si le interesa a alguien)'
      },
      {
        name: '`Otros:`',
        value: '**/ping** -> Puedes jugar al Ping Pong con el bot\n**/f** -> Press F to pay respects'
      },
      {
        name: '`Moderacion (ADMIN)`',
        value: '**/ban** -> Banea al usuario\n**/kick** -> Expulsa al usuario'
      }
    )
    message.channel.send(embed)
  })
  command(client, 'serverinfo', (message) => {
    const { guild } = message

    const { name, memberCount, region, member} = guild
    const icon = guild.iconURL()

    const embed = new Discord.MessageEmbed()
      .setTitle(`Información de "${name}"`)
      .setThumbnail(icon)
      .setColor('#3374FF')
      .addFields(
        {
          name: 'Miembros',
          value: memberCount
        },
        {
          name: 'Region',
          value: region
        }
      )

    message.channel.send(embed)
  })
  command(client, 'ban', (message) => {
    const { member, mentions } = message

    const tag = `<@${member.id}>`

    if(member.hasPermission('ADMINISTRATOR') || member.hasPermission('BAN_MEMBERS')){
        const target = mentions.users.first()
        if(target){
          const targetMember = message.guild.members.cache.get(target.id)
          targetMember.ban()
          message.channel.send(`${tag} el usuario ha sido baneado`)
        }else{
          message.channel.send(`${tag} especifica a quien quieres banear`)
        }
    }else{
      message.channel.send(`${tag}, no tienes permisos para usar ese comando`)
    }
  })
  command(client, 'kick', (message) => {
    const { member, mentions } = message

    const tag = `<@${member.id}>`

    if(member.hasPermission('ADMINISTRATOR') || member.hasPermission('KICK_MEMBERS')){
        const target = mentions.users.first()
        if(target){
          const targetMember = message.guild.members.cache.get(target.id)
          targetMember.kick()
          message.channel.send(`${tag} el usuario ha sido expulsado`)
        }else{
          message.channel.send(`${tag} especifica a quien quieres banear`)
        }
    }else{
      message.channel.send(`${tag}, no tienes permisos para usar ese comando`)
    }
  })
});

//client.login(config.token);
client.login(process.env.poro_token);
