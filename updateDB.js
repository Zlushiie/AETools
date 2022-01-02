module.exports = async () => {
    const axios = require('axios');
    const puppeteer = require('puppeteer');
    const fs = require('fs');
    const relicURL = 'https://warframe.fandom.com/wiki/Void_Relic/ByRelic';
    const key = 'AIzaSyATKFkNptVvDin8bje9G0JZi03JmmhCcY4'
    const sheetRaw = await axios.get(`https://sheets.googleapis.com/v4/spreadsheets/14Lxib9u73S8lGJjbWrgiXXhfP3NFyzbH_aqh-gwMyn8/values/A1:P500?key=${key}`)
        .then(( res ) => {
            return res.data.values;
        })
    var merchantSheet = {};
    var partSheet = {};
    var data = {};
    var tableTemp;
    var partTemp = {};
    var tableTemp2;
    var table;
    var avgTemp;
    var relic1;
    var relics = {};
    var database = {};

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(relicURL, {waitUntil: 'load', timeout: 0});
    await page.waitForSelector('#mw-content-text > div.mw-parser-output > table > tbody > tr:nth-child(407) > td:nth-child(5)');

    var data1 = await page.evaluate(() => {
        const $ = window.$;
        const selector = '#mw-content-text > div.mw-parser-output > table > tbody > tr > td';
        var data2 = [];
        $(selector).each((idx, elem) => {
            data2.push($(elem).text());
        })

        return data2
    });

    browser.close();

    data1 = data1.filter((elem, idx) => {
        if (idx % 5 == 0) {return false;}
        return true;
    });

    data1.forEach((elem, idx) => {
        if (idx % 4 == 0) {
            data[elem.replace(/(\r\n|\n|\r)/gm, '')] = {}
        } else if (idx % 4 == 1){
            data[data1[idx-1].replace(/(\r\n|\n|\r)/gm, '')]['common'] = elem.split('\n').filter(e => e);
        } else if (idx % 4 == 2){
            data[data1[idx-2].replace(/(\r\n|\n|\r)/gm, '')]['uncommon'] = elem.split('\n').filter(e => e);
        } else if (idx % 4 == 3){
            data[data1[idx-3].replace(/(\r\n|\n|\r)/gm, '')]['rare'] = elem.split('\n').filter(e => e);
        }
    })

    for (var i = 0; true; i++) {
        if(sheetRaw[i] ? !sheetRaw[i][0] : true) {break;}
        merchantSheet[sheetRaw[i][0]] = {token: sheetRaw[i][1] ? sheetRaw[i][1] : 0, update: sheetRaw[i][2], drop: sheetRaw[i][3] ? sheetRaw[i][3] : 'NO'};
    }

    var twoXlist = []
    for (var i = 0; true; i++) {
        if(!sheetRaw[i][4]) {break;}
        twoXlist.push({set: sheetRaw[i][4], part: sheetRaw[i][5]})
    }
    for (var i = 0; true; i++) {
        partTemp = {};
        if (!sheetRaw[i][6]) {break;}
        if (!partSheet[sheetRaw[i][6]]) {
            partSheet[sheetRaw[i][6]] = {};
        }

        partTemp.count = parseInt(sheetRaw[i][8]);

        twoXlist.forEach((elem, idx) => {
            if (elem.set == sheetRaw[i][6]
                && elem.part == sheetRaw[i][7]) {
                partTemp.twoX = true;
                partTemp.count = Math.floor(partTemp.count/2)
            }
        })

        if (partTemp.count <= 7) {
            partTemp.color = 'ed';
        } else if (partTemp.count > 7 && partTemp.count <= 15) {
            partTemp.color = 'red';
        } else if (partTemp.count > 15 && partTemp.count <= 35) {
            partTemp.color = 'orange';
        } else if (partTemp.count > 35 && partTemp.count <= 64) {
            partTemp.color = 'yellow';
        } else if (partTemp.count >= 65) {
            partTemp.color = 'green';
        } else {
            partTemp.color = null;
        }

        partSheet[sheetRaw[i][6]][sheetRaw[i][7]] = partTemp;
    }

    for (const relicName in data) {
        if (relicName.startsWith('Requiem')) {
            continue;
        }
        relic1 = {};
        table = {};
        tableTemp = [];
        tableTemp2 = {};
        avgTemp = [];
        relic1.drop = merchantSheet[relicName].drop;
        relic1.update = merchantSheet[relicName].update;
        relic1.tokens = merchantSheet[relicName].token;

        data[relicName].common.concat(data[relicName].uncommon, data[relicName].rare).forEach(
            (drop, idx) =>
            {
                tableTemp2 = {};
                if (drop != 'Forma Blueprint') {
                    if (drop.split('Prime')[0].trim().concat(' Prime') == 'Kavasa Prime') {
                        tableTemp2.set = 'Kavasa Prime Collar'
                        if (drop.split('Prime')[1].trim() == 'Kubrow Collar Blueprint') {tableTemp2.part = 'Blueprint';};
                        if (tableTemp2.part != 'Blueprint') {tableTemp2.part = drop.split('Prime')[1].trim();};
                    } else if (drop.split('Prime')[0].trim().concat(' Prime') == 'Silva & Aegis Prime') {
                        tableTemp2.set = 'Silva and Aegis Prime'
                        tableTemp2.part = drop.split('Prime')[1].trim()
                    } else if (drop == 'Venka Prime Blades') {
                        tableTemp2.set = 'Venka Prime'
                        tableTemp2.part = 'Blade'
                    } else {
                        tableTemp2.set = drop.split('Prime')[0].concat('Prime');
                        tableTemp2.part = drop.split('Prime')[1].trim()
                    }
                    if (/.(Blueprint)/gm.test(tableTemp2.part)) {
                        tableTemp2.part = tableTemp2.part.split(' ')[0]
                    }

                    tableTemp2.name = tableTemp2.set + ' ' + tableTemp2.part;
                    tableTemp2.stat = partSheet[tableTemp2.set][tableTemp2.part];
                } else {
                    tableTemp2.name = 'Forma';
                    tableTemp2.stat = {"count": ' ', "color": ' '};
                }
                tableTemp.push(tableTemp2);
            }
        )
        table.common = tableTemp.slice(0, 3);
        table.uncommon = tableTemp.slice(3, -1);
        table.rare = tableTemp.slice(5);
        relic1.table = table;

        relic1.high = 0;
        relic1.low = 1000;

        table.common.concat(table.uncommon, table.rare).forEach((part, idx) => {
            relic1.high = relic1.high < part.stat.count && part.stat.count != ' ' ? part.stat.count : relic1.high;
            relic1.low = relic1.low > part.stat.count && part.stat.count != ' ' ? part.stat.count : relic1.low;
            avgTemp.push(part.stat.count != ' ' ? part.stat.count : null);
        });
        relic1.avg = Math.trunc(avgTemp.filter(e => e).reduce((a,b)=>a+b)/avgTemp.filter(e => e).length);
        relics[relicName] = relic1;
    }

    database['relics'] = relics;
    database['sets'] = partSheet;
    database['eras'] = {'l' : 'lith', 'm' : 'meso', 'n' : 'neo', 'a' : 'axi'};
    database['parts'] = ['Blueprint', 'Chassis', 'Neuroptics', 'Systems', 'Barrel', 'Receiver', 'Stock', 'Grip', 'Lower Limb', 'String', 'Upper Limb', 'Blade', 'Handle', 'Link', 'Pouch', 'Stars', 'Gauntlet', 'Ornament', 'Head', 'Disc', 'Boot', 'Hilt', 'Chain', 'Guard', 'Carapace', 'Cerebrum', 'Band', 'Buckle', 'Harness', 'Wings'];
    database['colors'] = ['ed', 'red', 'orange', 'yellow', 'green'];
    database['lastUpdate'] = Date.now();

    fs.writeFileSync('database.json', JSON.stringify(database))
    console.log(`[${database.lastUpdate}] DB updated`);
}