const utils = require('../utils.js');
const { MessageEmbed } = require('discord.js');
const ee = require('../config/embed.json');
const fs = require('fs');

module.exports = {
    condition: (c) => {
        return c[0] == 'help';
    },
    command: async (c, msg) => {
        await msg.reply('Check out our how-to at https://github.com/Zlushiie/TreasuryTools/blob/main/README.md')
    }
}