const Discord = require('discord.js')
const client = new Discord.Client()

const config = require('./config.json')
const command = require('./command')

client.on('ready', () => {
    console.log('The client is ready!')

    command(client, 'ping', (message) => {
        message.channel.send('Pong!')
    })
    command(client, 'f', (message) => {
        message.channel.send('F')
    })
})

client.login(config.token)
client.login(process.env.poro_token)
