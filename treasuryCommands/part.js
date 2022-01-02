const utils = require('../utils.js');
const { MessageEmbed } = require('discord.js');
const ee = require('../config/embed.json');
const fs = require('fs');

module.exports = {
    condition: (c) => {
        const database = JSON.parse(fs.readFileSync('./database.json'))
        return database.parts.some(elem => {
            return c.map(string => {return string.charAt(0).toUpperCase() + string.slice(1);}).join(' ').endsWith(elem)
        })
    },
    command: async (c, msg) => {
        const database = JSON.parse(fs.readFileSync('./database.json'))
        let partRaw = c.map(string => {return string.charAt(0).toUpperCase() + string.slice(1);}).join(' ');
        if (partRaw.startsWith('Kavasa Prime B')) {
            await msg.reply(`No Relic/Prime part found for query [${c.join(' ')}]`)
                .then(msg => {
                    setTimeout(() => msg.delete(), 3000)
                });
            return;
        }
        let partText = '';
        let set = partRaw.split('Prime')[0].concat('Prime') == 'Kavasa Prime' ? 'Kavasa Prime Collar' : partRaw.split('Prime')[0].concat('Prime');
        let part = partRaw.split('Prime')[1].replace('Collar', '').trim();
        Object.keys(database.relics).forEach(relic => {
            database.relics[relic].table.common.concat(database.relics[relic].table.uncommon, database.relics[relic].table.rare).forEach((partMatch, idx) => {
                if (partMatch.name == partRaw) {
                    if (idx <= 2) {
                        partText += `\nC  │ `
                    } else if (idx <= 4 && idx > 2) {
                        partText += `\nUC │ `
                    } else if (idx > 4) {
                        partText += `\nRA │ `
                    }
                    partText += database.relics[relic].tokens ? database.relics[relic].tokens.toString() : '???';
                    partText += ` │ ${relic}`
                }
            });
        });
        const partEmbed = new MessageEmbed()
            .setTimestamp()
            .setTitle(`[ ${set} ${part}${database.sets[set][part].twoX ? ' 2x' : ''} ]  {${database.sets[set][part].count}}`)
            .setDescription(`\`\`\`ml\n${partText}\`\`\``)
            .setColor(ee[database.sets[set][part].color])
            .setFooter({text: ee.footer.text, iconURL: ee.footer.icon})
        await msg.reply({embeds: [partEmbed]});
    }
};