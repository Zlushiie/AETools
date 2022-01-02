const utils = require('../utils.js');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const ee = require('../config/embed.json');
const fs = require('fs');

const relic = (c, msg) => {
    const database = JSON.parse(fs.readFileSync('./database.json'))
    let relicName = '';
    if (/^[almn][a-zA-Z][0-9]{1,2}?$/gm.test(c[0])) {
        relicName = utils.capitalizeFirstLetter(database.eras[c[0].charAt(0)]) + ' ' + c[0].charAt(1).toUpperCase() + c[0].slice(2);
    } else {
        relicName = utils.capitalizeFirstLetter(c[0]) + ' ' + c[1].at(0).toUpperCase() + c[1].slice(1);
    }
    if (!database.relics[relicName]) {
        msg.reply(`No Relic/Prime part found for query [${c.join(' ')}]`)
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
            if (part.stat.color == 'ed') {
                relicText += `${part.stat.count}${' '.repeat(3-part.stat.count.toString().length)}│ ${part.name} {ED}`;
            } else if (part.stat.color == 'red') {
                relicText += `${part.stat.count}${' '.repeat(3-part.stat.count.toString().length)}│ ${part.name} {RED}`;
            } else if (part.stat.color == 'orange') {
                relicText += `${part.stat.count}${' '.repeat(3-part.stat.count.toString().length)}│ ${part.name} {ORANGE}`;
            } else if (part.stat.color == 'yellow') {
                relicText += `${part.stat.count}${' '.repeat(3-part.stat.count.toString().length)}│ ${part.name} {YELLOW}`;
            } else if (part.stat.color == 'green') {
                relicText += `${part.stat.count}${' '.repeat(3-part.stat.count.toString().length)}│ ${part.name} {GREEN}`;
            } else {
                relicText += `${part.stat.count}${' '.repeat(3-part.stat.count.toString().length)}│ ${part.name}`;
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
    return relicEmbed;
}

module.exports = {
    condition: (c) => {
        const database = JSON.parse(fs.readFileSync('./database.json'))
        return /^[a-zA-Z][0-9]{1,2}?$/gm.test(c[0])
        && !c[1];
    },
    command: async (c, msg) => {
        const database = JSON.parse(fs.readFileSync('./database.json'))
        let lsItems = []
        let disAmbigText = '';
        for (era of Object.values(database.eras)) {
            if (database.relics[utils.capitalizeFirstLetter(era) + ' ' + (c[0].charAt(0).toUpperCase() + c[0].slice(1))]) {
                lsItems.push(utils.capitalizeFirstLetter(era) + ' ' + (c[0].charAt(0).toUpperCase() + c[0].slice(1)));
            }
        }
        const relics = new MessageActionRow();

        if (lsItems.length == 1) {
            await msg.reply({embeds: [relic(lsItems[0].split(' '), msg)]})
            return;
        }

        lsItems.forEach((elem, idx) => {
            disAmbigText += `${idx + 1} │ ${elem}\n`
            relics.addComponents(
                new MessageButton()
                    .setCustomId((idx+1).toString())
                    .setLabel((idx+1).toString())
                    .setStyle('PRIMARY')
            );
        })

        const disAmbigEmbed = new MessageEmbed()
            .setTimestamp()
            .setTitle(`Disambiguation for [${c[0].toUpperCase()}]`)
            .setDescription(`\`\`\`ml\n${disAmbigText}\`\`\``)
            .setFooter({text: ee.footer.text, iconURL: ee.footer.icon})

        await msg.reply({embeds: [disAmbigEmbed], components: [relics]});

        const filter = (interaction) => {
            if (interaction.user.id === msg.author.id) return true;
        }

        const collector = await msg.channel.createMessageComponentCollector({
            filter,
            max: 4,
            time: 180000
        })

        collector.on("collect", (buttonInteraction) => {
            if(buttonInteraction.customId === '1') buttonInteraction.reply({embeds: [relic(lsItems[0].split(' '), msg)]})
            if(buttonInteraction.customId === '2') buttonInteraction.reply({embeds: [relic(lsItems[1].split(' '), msg)]})
            if(buttonInteraction.customId === '3') buttonInteraction.reply({embeds: [relic(lsItems[2].split(' '), msg)]})
            if(buttonInteraction.customId === '4') buttonInteraction.reply({embeds: [relic(lsItems[3].split(' '), msg)]})
        })
    }
};
