const Discord = require("discord.js");
const client = new Discord.Client();

const config = require("./config.json");
const command = require("./command");
const privateMessage = require("./private-message")
const welcome = require("./welcome")
const mongo = require('./mongo')


client.on("ready", async () => {
  console.log("¡Poro-bot listo!");
  await mongo().then((mongoose) => {
    try{
      console.log('¡Conectado a mongo!')
    } finally {
      mongoose.connection.close()
    }
  })
  client.setMaxListeners(60)

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
    if (message.member.hasPermission("ADMINISTRATOR")) {
      const content = message.content.replace('-status ', '');
      client.user.setPresence({
        activity: {
          name: content,
          type: 0,
        },
      });
    } else {
      message.channel.send("No tienes permiso para usar ese comando")
    }
  });
  client.user.setPresence({
    activity: {
      name: "League of Legends",
      type: 0,
    }
  });

  //firstMessage(client,'852262834238914640','hello world',['🏀'])
  privateMessage(client,'ping','Pong!')
  privateMessage(client,'teemo','Cómo osas pronunciar el nombre del gran TEEMO escoria!?')

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
  command(client, ['help','h'], (message) => {
    const logo = 'https://i.imgur.com/ghtkRY4.jpg'

    const embed = new Discord.MessageEmbed()
    .setTitle('COMANDOS')
    .setThumbnail(logo)
    .setColor('#3374FF')
    //.setDescription("El prefijo del bot es '/'\n`Generales:`\n**/comandos** -> Muestra los comandos del bot\n**/usuarios** -> Muestra los usuarios totales del servidor\n**/codigo** -> Codigo javascript del bot (por si le interesa a alguien)\n`Otros:`\n**/ping** -> Puedes jugar al Ping Pong con el bot\n**/f** -> Press F to pay respects\n")
    .setDescription("El prefijo del bot es '-'")
    .addFields(
      {
        name: '`Generales:`',
        value: '**-help o -h** -> Muestra los comandos del bot\n**-serverinfo** -> Información del servidor\n**-usuarios** -> Muestra los usuarios totales del servidor\n**-codigo** -> Codigo javascript del bot (por si le interesa a alguien)'
      },
      {
        name: '`Otros:`',
        value: '**-ping** -> Puedes jugar al Ping Pong con el bot\n**-f** -> Press F to pay respects'
      },
      {
        name: '`Moderacion (ADMIN)`',
        value: '**-ban** -> Banea al usuario\n**-kick** -> Expulsa al usuario\n**-status** -> Cambia el estado del bot\n**-clear o -borrar** -> Elimina el numero de mensajes que especifiques\n**-cct** -> Crea un canal de texto con el nombre que especifiques\n**-ccv** -> Crea un canal de voz con el nombre que especifiques'
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
        },
        {
          name: 'Ayuda',
          value: '-help o -h'
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
          message.channel.send(`${tag} especifica a quien quieres explusar`)
        }
    }else{
      message.channel.send(`${tag}, no tienes permisos para usar ese comando`)
    }
  })
  welcome(client)


});

client.login(config.token);
client.login(process.env.poro_token);