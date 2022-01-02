const utils = require('../utils.js');
const { MessageEmbed } = require('discord.js');
const ee = require('../config/embed.json');
const fs = require('fs');

module.exports = {
    condition: (c) => {
        const database = JSON.parse(fs.readFileSync('./database.json'))
        return (Object.values(database.eras).includes(c[0].toLowerCase())
        && /^[a-zA-Z][0-9]{1,2}?$/gm.test(c[1]) && !c[2])
        || (/^[almn][a-zA-Z][0-9]{1,2}?$/gm.test(c[0])
        && !c[1]);
    },
    command: async (c, msg) => {
        const database = JSON.parse(fs.readFileSync('./database.json'))
        let relicName = '';
        if (/^[almn][a-zA-Z][0-9]{1,2}?$/gm.test(c[0])) {
            relicName = utils.capitalizeFirstLetter(database.eras[c[0].charAt(0)]) + ' ' + c[0].charAt(1).toUpperCase() + c[0].slice(2);
        } else {
            relicName = utils.capitalizeFirstLetter(c[0]) + ' ' + c[1].at(0).toUpperCase() + c[1].slice(1);
        }
        if (!database.relics[relicName]) {
            await msg.reply(`No Relic/Prime part found for query [${c.join(' ')}]`)
                .then(msg => {
                    setTimeout(() => msg.delete(), 3000)
                });
            return;
        }
        let relicText = '';
        let relicTitleText = '';
        let eeCountLeast = 1000;
        const relic = database.relics[relicName];
        relicTitleText += `[ ${relicName} ] `;

        if (relic.drop == 'YES') {
            relicTitleText += '{UV} ';
        } else if (relic.drop.includes('DEPENDS')) {
            relicTitleText += '{D} ';
        } else {
            relicTitleText += '{V} ';
        }

        relicTitleText += relic.tokens ? relic.tokens.toString() : '???';
        relicTitleText += relic.update ? ` ${relic.update}\n` : '\n';

        relic.table.common.concat(relic.table.uncommon, relic.table.rare).forEach((part, idx) => {
            if (idx <= 2) {
                relicText += `\nC  │ `
            } else if (idx <= 4 && idx > 2) {
                relicText += `\nUC │ `
            } else if (idx > 4) {
                relicText += `\nRA │ `
            }

            try {
                relicText += `${part.stat.count}${' '.repeat(3-part.stat.count.toString().length)}│ ${part.name}`;
                if (part.stat.color == 'ed') {
                    relicText += `${database.sets[part.set][part.part].twoX ? ' 2x' : ''} {ED}`;
                } else if (part.stat.color == 'red') {
                    relicText += `${database.sets[part.set][part.part].twoX ? ' 2x' : ''} {RED}`;
                } else if (part.stat.color == 'orange') {
                    relicText += `${database.sets[part.set][part.part].twoX ? ' 2x' : ''} {ORANGE}`;
                } else if (part.stat.color == 'yellow') {
                    relicText += `${database.sets[part.set][part.part].twoX ? ' 2x' : ''} {YELLOW}`;
                } else if (part.stat.color == 'green') {
                    relicText += `${database.sets[part.set][part.part].twoX ? ' 2x' : ''} {GREEN}`;
                } else {
                }
                if (part.stat.count != ' ' && part.stat.count < eeCountLeast) eeCountLeast = part.stat.count;
            } catch (e) {
                relicText += `${part.stat.count}${' '.repeat(3-part.stat.count.toString().length)}│ ${part.name}`;
            }
        });

        const relicEmbed = new MessageEmbed()
            .setTimestamp()
            .setTitle(relicTitleText)
            .setDescription(`\`\`\`ml\n${relicText}\`\`\``)
            .setFooter({text: ee.footer.text, iconURL: ee.footer.icon})
        if (eeCountLeast <= 7) {
            relicEmbed.setColor(ee.ed);
        } else if (eeCountLeast > 7 && eeCountLeast <= 15) {
            relicEmbed.setColor(ee.red);
        } else if (eeCountLeast > 15 && eeCountLeast <= 35) {
            relicEmbed.setColor(ee.orange);
        } else if (eeCountLeast > 35 && eeCountLeast <= 64) {
            relicEmbed.setColor(ee.yellow);
        } else if (eeCountLeast >= 65) {
            relicEmbed.setColor(ee.green);
        }
        await msg.reply({embeds: [relicEmbed]});
    }
};