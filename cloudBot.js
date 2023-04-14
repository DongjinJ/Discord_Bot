const { Client, Intents, MessageEmbed, MessageActionRow, MessageButton, DataResolver } = require('discord.js');
const config = require("./config.json")
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES] });

client.once('ready', () => {
    console.log('Ready!');
});

client.on('message', msg => {
    if()
});
client.login(config.cloud);