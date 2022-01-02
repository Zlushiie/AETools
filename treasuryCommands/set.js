const utils = require('../utils.js');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const ee = require('../config/embed.json');
const fs = require('fs');

const part = (c, msg) => {
    const database = JSON.parse(fs.readFileSync('./database.json'))
    let partRaw = c.map(string => {return string.charAt(0).toUpperCase() + string.slice(1);}).join(' ');
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
    return partEmbed;
}

module.exports = {
    condition: (c) => {
        const database = JSON.parse(fs.readFileSync('./database.json'))
        return database.sets[c.map(string => {return string.charAt(0).toUpperCase() + string.slice(1);}).join(' ')];
    },
    command: async (c, msg) => {
        const database = JSON.parse(fs.readFileSync('./database.json'))
        let set = database.sets[c.map(string => {return string.charAt(0).toUpperCase() + string.slice(1);}).join(' ')];
        let setText = '';
        let eeCountLeast = 1000;
        const parts = new MessageActionRow();

        Object.keys(set).forEach(part => {
            parts.addComponents(
                new MessageButton()
                    .setCustomId(`${c.map(string => {return string.charAt(0).toUpperCase() + string.slice(1);}).join(' ')} ${part}`)
                    .setLabel(part)
                    .setStyle('PRIMARY')
            );
            setText += `\n${set[part].count}${' '.repeat(3-set[part].count.toString().length)}│ ${part}`;
            if (set[part].color == 'ed') {
                if (set[part].count < eeCountLeast) eeCountLeast = set[part].count;
                setText += `${set[part].twoX ? ' 2x' : ''} {ED}`;
            } else if (set[part].color == 'red') {
                if (set[part].count < eeCountLeast) eeCountLeast = set[part].count;
                setText += `${set[part].twoX ? ' 2x' : ''} {RED}`;
            } else if (set[part].color == 'orange') {
                if (set[part].count < eeCountLeast) eeCountLeast = set[part].count;
                setText += `${set[part].twoX ? ' 2x' : ''} {ORANGE}`;
            } else if (set[part].color == 'yellow') {
                if (set[part].count < eeCountLeast) eeCountLeast = set[part].count;
                setText += `${set[part].twoX ? ' 2x' : ''} {YELLOW}`;
            } else if (set[part].color == 'green') {
                if (set[part].count < eeCountLeast) eeCountLeast = set[part].count;
                setText += `${set[part].twoX ? ' 2x' : ''} {GREEN}`;
            } else {
            }
            if (set[part].count < eeCountLeast) eeCountLeast = set[part].count;
        });

        const setEmbed = new MessageEmbed()
            .setTimestamp()
            .setTitle(`[ ${c.map(string => {return string.charAt(0).toUpperCase() + string.slice(1);}).join(' ')} Set ]`)
            .setDescription(`\`\`\`ml\n${setText}\`\`\``)
            .setFooter({text: ee.footer.text, iconURL: ee.footer.icon})
        if (eeCountLeast <= 7) {
            setEmbed.setColor(ee.ed);
        } else if (eeCountLeast > 7 && eeCountLeast <= 15) {
            setEmbed.setColor(ee.red);
        } else if (eeCountLeast > 15 && eeCountLeast <= 35) {
            setEmbed.setColor(ee.orange);
        } else if (eeCountLeast > 35 && eeCountLeast <= 64) {
            setEmbed.setColor(ee.yellow);
        } else if (eeCountLeast >= 65) {
            setEmbed.setColor(ee.green);
        }

        await msg.reply({embeds: [setEmbed], components: [parts]});

        const filter = (interaction) => {
            if (interaction.user.id === msg.author.id) return true;
        }

        const collector = await msg.channel.createMessageComponentCollector({
            componentType: "BUTTON",
            filter,
            max: 4,
            time: 180000
        })

        collector.on("collect", (buttonInteraction) => {
            buttonInteraction.reply({embeds: [part(buttonInteraction.customId.split(' '), msg)]})
        })
    }
};