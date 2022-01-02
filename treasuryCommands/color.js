const utils = require('../utils.js');
const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require('discord.js');
const ee = require('../config/embed.json');
const fs = require('fs');

module.exports = {
    condition: (c) => {
        const database = JSON.parse(fs.readFileSync('./database.json'))
        return database.colors.includes(c[0]);
    },
    command: async (c, msg) => {
        const database = JSON.parse(fs.readFileSync('./database.json'))
        let chunk = 15;
        let colorTextTemp = '';
        let colorText = [];
        let options = [];
        let pages = {};
        let parts = [];

        Object.keys(database.sets).forEach(set => {
            Object.keys(database.sets[set]).forEach(part => {
                if (database.sets[set][part].color == c[0]) {
                    parts.push({count: database.sets[set][part].count, name: [set, part].join(' ')});
                }
            });
        });

        parts.sort((a, b) => a.count - b.count)

        switch (c[0]) {
            case 'ed':
                parts.forEach(part => {
                    colorTextTemp += `\n${part.count}${' '.repeat(3-part.count.toString().length)}│ ${part.name} {ED}`;
                })
                break;
            case 'red':
                parts.forEach(part => {
                    colorTextTemp += `\n${part.count}${' '.repeat(3-part.count.toString().length)}│ ${part.name} {RED}`;
                })
                break;
            case 'orange':
                parts.forEach(part => {
                    colorTextTemp += `\n${part.count}${' '.repeat(3-part.count.toString().length)}│ ${part.name} {ORANGE}`;
                })
                break;
            case 'yellow':
                parts.forEach(part => {
                    colorTextTemp += `\n${part.count}${' '.repeat(3-part.count.toString().length)}│ ${part.name} {YELLOW}`;
                })
                break;
            case 'green':
                parts.forEach(part => {
                    colorTextTemp += `\n${part.count}${' '.repeat(3-part.count.toString().length)}│ ${part.name} {GREEN}`;
                })
                break;
            default:
                break;
        }

        colorTextTemp = colorTextTemp.split('\n').map(e => e);

        for (i = 0,k = 0, j = colorTextTemp.length; i < j; i += chunk, k++) {
            pages[k+1] = colorTextTemp.slice(i, i + chunk).join('\n');
            options.push({label: `Page ${k+1}`, description: `Click here to view Page ${k}`, value: (k+1).toString()})
        }

        const page = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId('page')
                    .setPlaceholder('Select a page')
                    .addOptions(options)
            );

        const colorEmbed = new MessageEmbed()
            .setTimestamp()
            .setTitle(`[ ${c[0].toUpperCase()} ] *1/${options.length}*`)
            .setDescription(`\`\`\`ml\n${pages[1] ? pages[1] : 'NONE'}\`\`\``)
            .setColor(ee[c[0]])
            .setFooter({text: ee.footer.text, iconURL: ee.footer.icon})

        await msg.reply({embeds: [colorEmbed], components: [page]});

        const filter = (interaction) => {
            if (interaction.user.id === msg.author.id) return true;
        }

        const collector = await msg.channel.createMessageComponentCollector({
            componentType: "SELECT_MENU",
            filter,
            max: options.length*3,
            time: 180000
        })

        collector.on("collect", async (menuInteraction) => {
            const colorEmbed = new MessageEmbed()
                .setTimestamp()
                .setTitle(`[ ${c[0].toUpperCase()} ] *${menuInteraction.values}/${options.length}*`)
                .setDescription(`\`\`\`ml\n${pages[menuInteraction.values] ? pages[menuInteraction.values] : 'NONE'}\`\`\``)
                .setColor(ee[c[0]])
                .setFooter({text: ee.footer.text, iconURL: ee.footer.icon})

            await menuInteraction.message.edit({embeds: [colorEmbed], components: [page]});
            await menuInteraction.deferUpdate();
        })
    }
};