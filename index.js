const Discord = require(`discord.js`);
const config = require(`./config/config.json`);
const fs = require('fs');
const client = new Discord.Client({
    allowedMentions: {
        repliedUser: false,
    },
    partials: [
        'CHANNEL'
    ],
    intents: [
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_MEMBERS,
        //Discord.Intents.FLAGS.GUILD_BANS,
        //Discord.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
        //Discord.Intents.FLAGS.GUILD_INTEGRATIONS,
        //Discord.Intents.FLAGS.GUILD_WEBHOOKS,
        //Discord.Intents.FLAGS.GUILD_INVITES,
        //Discord.Intents.FLAGS.GUILD_VOICE_STATES,
        //Discord.Intents.FLAGS.GUILD_PRESENCES,
        Discord.Intents.FLAGS.GUILD_MESSAGES,
        Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        //Discord.Intents.FLAGS.GUILD_MESSAGE_TYPING,
        Discord.Intents.FLAGS.DIRECT_MESSAGES,
        Discord.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
        //Discord.Intents.FLAGS.DIRECT_MESSAGE_TYPING
    ],
    presence: {
        status: `dnd`
    }
});

//command collection
var treasuryCommands = [];
const treasuryFiles = fs.readdirSync(`treasuryCommands`);
for (idx in treasuryFiles) {
    var cmd = require(`./treasuryCommands/${treasuryFiles[idx]}`);
    treasuryCommands.push({condition: cmd.condition, command: cmd.command});
}

const updateDB = require('./updateDB')

console.log('DB update requested');
updateDB();

setInterval( () => {
    console.log('DB update requested');
    updateDB();
}, 180000);

const database = require('./database.json')

const ready = require(`./ready`)
client.on('ready', ready.bind(client));
client.on('messageCreate', async (message) => {
    if (!message.content) return;
    if (message.author.bot) return;
    if (message.channel.type == 'DM') {


        if (!await (await client.guilds.cache.get(config.mainServer).members.fetch(message.author.id)).roles.cache.has(config.dept.roles.treasury)) {
            await message.reply(`You're not a part of AE's treasury team, sorry!`)
            .then(async msg => {
                setTimeout(() => msg.delete(), 5000)
            });
            return;
        }
        const c = message.content.trim().toLowerCase().split(' ').filter((e) => e);
        for (const element of treasuryCommands) {
            //condition, has role
            if (element.condition(c)
                && await (await client.guilds.cache.get(config.mainServer).members.fetch(message.author.id)).roles.cache.has(config.dept.roles.treasury)) {
                element.command(c, message);
                return;
            }
        }
        await message.reply(`No Relic/Prime part found for query [${c.join(' ')}]`)
        .then(async msg => {
            setTimeout(() => msg.delete(), 5000)
        });
        return;


    }
    if (!message.content.startsWith(config.prefix)) return;
    if (!config.dept.channels.treasury.includes(message.channelId)) {
        await message.reply({content: 'Please use this command inside one of the valid channels'})
        .then(async msg => {
            setTimeout(() => msg.delete(), 3000)
        });
        return;
    }


    const c = message.content.slice(config.prefix.length).trim().toLowerCase().split(' ').filter((e) => e);
    for (const element of treasuryCommands) {
        //condition, in channel
        if (element.condition(c)
            && config.dept.channels.treasury.includes(message.channelId)) {
            element.command(c, message);
            return;
        }
    }

    await message.reply(`No Relic/Prime part found for query [${c.join(' ')}]`)
    .then(async msg => {
        setTimeout(() => msg.delete(), 5000)
    });
    return;
});

if (config.antiCrash) {require(`./antiCrash`)()}

//start it up
client.login(config.token)
console.log(`AETools Started`);