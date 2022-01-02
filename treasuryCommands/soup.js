const utils = require('../utils.js');
const { MessageEmbed } = require('discord.js');
const ee = require('../config/embed.json');
const fs = require('fs');

module.exports = {
    condition: (c) => {
        return c[0].match(/^[0-9]+[a-zA-Z]{2}[0-9]{1,2}$/gm);
    },
    command: async (c, msg) => {
        const database = require('../database.json');
        let soupText = '';
        let counts = [];
        let relicNames = [];
        let edCountTemp = 0;
        let redCountTemp = 0;
        let orangeCountTemp = 0;
        let edCount = [];
        let redCount = [];
        let orangeCount = [];

        c.map(e => e.trim()).forEach(relicRaw => {
            try {
                counts.push(relicRaw.match(/^[0-9]+/gm)[0])
                relicNames.push(database.eras[relicRaw.match(/[a-zA-Z]{1}/gm)[0]].charAt(0).toUpperCase() +
                                database.eras[relicRaw.match(/[a-zA-Z]{1}/gm)[0]].slice(1) +
                                ` ${relicRaw.match(/[a-zA-Z][0-9]{1,2}$/gm)[0].charAt(0).toUpperCase() +
                                    relicRaw.match(/[a-zA-Z][0-9]{1,2}$/gm)[0].slice(1)}`);
            } catch (e) {
                return;
            }
        });

        relicNames.forEach(relicName => {
            edCountTemp = 0;
            redCountTemp = 0;
            orangeCountTemp = 0;
            database.relics[relicName].table.common.concat(database.relics[relicName].table.uncommon, database.relics[relicName].table.rare).forEach((part, idx) => {
                if (part.stat.color == 'ed') {
                    edCountTemp++
                } else if (part.stat.color == 'red') {
                    redCountTemp++
                } else if (part.stat.color == 'orange') {
                    orangeCountTemp++
                }
            })
            edCount.push(edCountTemp);
            redCount.push(redCountTemp);
            orangeCount.push(orangeCountTemp);
        })

        for (let i = 0; i < Math.min(counts.length, relicNames.length, edCount.length, redCount.length); i++) {
            soupText += `${counts[i]}x${' '.repeat(3-counts[i].length)}| ${relicNames[i]}${' '.repeat(9-relicNames[i].length)}| ${edCount[i]} ED | ${redCount[i]} RED | ${orangeCount[i]} ORANGE\n`
        }

        const soupEmbed = new MessageEmbed()
            .setTimestamp()
            .setTitle(`Soup formatted`)
            .setDescription(`\`\`\`ml\n${soupText}\`\`\``)
            .setFooter({text: ee.footer.text, iconURL: ee.footer.icon})
        await msg.reply({embeds: [soupEmbed]});
    }
}