const { SlashCommandStringOption } = require('@discordjs/builders');
const { Client, Intents, MessageEmbed, MessageActionRow, MessageButton, DataResolver } = require('discord.js');
const config = require("./config.json")
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES] });

const fs = require('fs')
const schedule = require('node-schedule');
const axios = require('axios');
const cheerio = require('cheerio');

require("dotenv").config();

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey:process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const testMode = true;
var serviceChannelID = '';
if(testMode === true){
    serviceChannelID = process.env.TEST_SERVER_ID;
}
else{
    serviceChannelID = process.env.CLIENT_SERVER_ID;
}


var updateData = schedule.scheduleJob('0 6 ? * 3', function(){
    const dataBuffer = fs.readFileSync('party.json')
    const dataJSON = dataBuffer.toString()
    const data = JSON.parse(dataJSON)

    data.First.Clear = 'False'
    data.Second.Clear = 'False'
    data.Third.Clear = 'False'
    data.Forth.Clear = 'False'
    data.Fifth.Clear = 'False'
    data.Update = 'True'

    const saveJSON = JSON.stringify(data)
    fs.writeFileSync('party.json', saveJSON)
});

var initTime = schedule.scheduleJob('59 5 ? * 3', function(){
    const dataBuffer = fs.readFileSync('party.json')
    const dataJSON = dataBuffer.toString()
    const data = JSON.parse(dataJSON)

    data.Update = 'False'

    const saveJSON = JSON.stringify(data)
    fs.writeFileSync('party.json', saveJSON)
});

client.once('ready', () => {
    console.log('Server Ready!');
});

client.on('messageCreate', async(msg) => {
    const dataBuffer = fs.readFileSync('party.json')
    const dataJSON = dataBuffer.toString()
    const data = JSON.parse(dataJSON)
    if (msg.author.username != '쿠쿠세이튼')
        /*              Main Server                 */
        if(msg.channelId === serviceChannelID){
            var str = msg.content;
            if(str.indexOf('!쌀') != -1){
                console.log(`[${msg.author.username}] Command: ${str}`)
                var split_str = str.split(' ');
                const gold = Number(split_str[1]);
                const best_4 = Math.ceil(gold * 0.95 * 3 / 4 / 1.1);
                const best_8 = Math.ceil(gold * 0.95 * 7 / 8 / 1.1);
                msg.reply('4인: ' + best_4.toString() + ' / 8인: ' + best_8.toString())
            }
            else if(str.indexOf('!쿠크') != -1){
                var split_str = str.substring(str.indexOf(' '));
                const request = split_str;
                const runPrompt = async(str) => {
                    var answer = "No Data"
                    // const response = await openai.createCompletion({
                    //     model:"text-davinci-003",
                    //     prompt:str,
                    //     max_tokens:300,
                    //     temperature:0.2,
                    // }).then(function(result){
                    //     answer = result.data.choices[0].text;
                    //     console.log(str);
                    //     console.log(">> ", answer);
                    //     msg.reply(answer);
                    // });
                    const response = await openai.createChatCompletion({
                        model: "gpt-3.5-turbo",
                        messages: [{ role: "user", content: str }],
                    }).then(function(result){
                        answer = result.data.choices[0].message.content;
                        console.log(str);
                        console.log(">> ", answer);
                        msg.reply(answer);
                    });
                    // console.log(response.data.choices[0].message.content);
                }
                runPrompt(request);
                
            }
            else if(str.indexOf('!전투정보') != -1){
                console.log(`[${msg.author.username}] Command: ${str}`)
                var split_str = str.split(' ');
                
                nickName = split_str[1];

                const encodeNickname = encodeURI(nickName);
                await axios.get(`https://lostark.game.onstove.com/Profile/Character/${encodeNickname}`)
                .then(function(result) {
                    const $ = cheerio.load(result.data)
                    var expeditionLevel = $("div.level-info__expedition").text();
                    expeditionLevel = expeditionLevel.substring(expeditionLevel.indexOf('.')+1);
                    var charLevel = $("div.level-info__item").text();
                    charLevel = charLevel.substring(charLevel.indexOf('.')+1);
                    var itemLevel = $("div.level-info2__expedition").text();
                    itemLevel = itemLevel.substring(itemLevel.indexOf('.')+1);
                    
                    var ability = new Array();
                    $('div.profile-ability-battle > ul > li > span').each(function() {
                        ability.push($(this).text())
                    })
                    
                    var card = new Array();
                    $('div.profile-card__content > ul > li > div.card-effect__title').each(function() {
                        card.push($(this).text())
                    });

                    var cardDescription = new Array();
                    $('div.profile-card__content > ul > li > div.card-effect__dsc').each(function() {
                        cardDescription.push($(this).text())
                    });
                    
                    var imageLink = $('div.profile-equipment__character > img').attr('src');
                    
                    var embed = new MessageEmbed()
                        .setColor("RANDOM")
                        .setTitle(split_str[1])
                        .addFields(
                        {name: `원정대 레벨`, value: expeditionLevel, inline:true},
                        {name: `전투 레벨`, value: charLevel, inline:true},
                        {name: `아이템 레벨`, value: itemLevel, inline:true},
                        )
                        .setImage(url=imageLink+'?size=1024');
                
                    var critical = 0;
                    var specialization = 0;
                    var speed = 0;
                    embed.addFields({ name: '\u200B', value: '\u200B' },);
                    for(i = 0;i < ability.length;i += 2){
                        embed.addFields(
                            {name: ability[i], value: ability[i+1], inline:true},
                        )
                        if(ability[i] == '치명'){
                            critical = Number(ability[i+1]);
                        }
                        if(ability[i] == '특화'){
                            specialization = Number(ability[i+1]);
                        }
                        if(ability[i] == '신속'){
                            speed = Number(ability[i+1]);
                        }
                    }
                    var totalAbility = critical + specialization + speed;
                    embed.addFields({name: '특성합 (치특신)', value: totalAbility.toString()});

                    embed.addFields({ name: '\u200B', value: '\u200B' },);
                    var engrave = new Array();
                    $('div.swiper-wrapper > ul > li > span').each(function() {
                        engrave.push($(this).text())
                    });
                    for(i = 0;i < engrave.length;i++){
                        embed.addFields(
                            {name: `각인 ${i+1}`, value: engrave[i], inline:true},
                        )
                    }
                    embed.addFields({ name: '\u200B', value: '\u200B' },);
                    var jewels = new Array();
                    var jewelsDescription = new Array();
                    var jewelTotal = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                    $('div.box_wrapper > ul > li > p.skill_detail').each(function() {
                        var temp_str = $(this).text();

                        if (temp_str.indexOf('재사용') != -1){
                            const frontIndex = temp_str.indexOf('대기시간 ') + '대기시간 '.length;
                            const rearIndex = temp_str.indexOf('%');
                            const effectValue = temp_str.substring(frontIndex, rearIndex);
                            var effectValue_Num = Number(effectValue);
                            var temp_result = '';
                            switch(effectValue_Num){
                                case 2.0:
                                    temp_result = '1레벨 홍염';
                                    jewelTotal[0]++;
                                    break;
                                case 4.0:
                                    temp_result = '2레벨 홍염';
                                    jewelTotal[1]++;
                                    break;
                                case 6.0:
                                    temp_result = '3레벨 홍염';
                                    jewelTotal[2]++;
                                    break;
                                case 8.0:
                                    temp_result = '4레벨 홍염';
                                    jewelTotal[3]++;
                                    break;
                                case 10.0:
                                    temp_result = '5레벨 홍염';
                                    jewelTotal[4]++;
                                    break;
                                case 12.0:
                                    temp_result = '6레벨 홍염';
                                    jewelTotal[5]++;
                                    break;
                                case 14.0:
                                    temp_result = '7레벨 홍염';
                                    jewelTotal[6]++;
                                    break;
                                case 16.0:
                                    temp_result = '8레벨 홍염';
                                    jewelTotal[7]++;
                                    break;
                                case 18.0:
                                    temp_result = '9레벨 홍염';
                                    jewelTotal[8]++;
                                    break;
                                case 20.0:
                                    temp_result = '10레벨 홍염';
                                    jewelTotal[9]++;
                                    break;
                                default:
                                    temp_result = '-';
                                    break;
                            }
                            jewels.push(temp_result);
                            jewelsDescription.push(temp_str);
                        }
                        else if (temp_str.indexOf('피해') != -1){
                            const frontIndex = temp_str.indexOf('피해 ') + '피해 '.length;
                            const rearIndex = temp_str.indexOf('%');
                            const effectValue = temp_str.substring(frontIndex, rearIndex);
                            var effectValue_Num = Number(effectValue);
                            var temp_result = '';
                            switch(effectValue_Num){
                                case 3.0:
                                    temp_result = '1레벨 멸화';
                                    jewelTotal[0]++;
                                    break;
                                case 6.0:
                                    temp_result = '2레벨 멸화';
                                    jewelTotal[1]++;
                                    break;
                                case 9.0:
                                    temp_result = '3레벨 멸화';
                                    jewelTotal[2]++;
                                    break;
                                case 12.0:
                                    temp_result = '4레벨 멸화';
                                    jewelTotal[3]++;
                                    break;
                                case 15.0:
                                    temp_result = '5레벨 멸화';
                                    jewelTotal[4]++;
                                    break;
                                case 18.0:
                                    temp_result = '6레벨 멸화';
                                    jewelTotal[5]++;
                                    break;
                                case 21.0:
                                    temp_result = '7레벨 멸화';
                                    jewelTotal[6]++;
                                    break;
                                case 24.0:
                                    temp_result = '8레벨 멸화';
                                    jewelTotal[7]++;
                                    break;
                                case 30.0:
                                    temp_result = '9레벨 멸화';
                                    jewelTotal[8]++;
                                    break;
                                case 40.0:
                                    temp_result = '10레벨 멸화';
                                    jewelTotal[9]++;
                                    break;
                                default:
                                    temp_result = '-';
                                    break;
                            }
                            jewels.push(temp_result);
                            jewelsDescription.push(temp_str);
                        }
                        else{

                        }
                        
                    });
                    // for(i = 0;i < jewels.length;i++){
                    //     embed.addFields(
                    //         {name: jewels[i], value: jewelsDescription[i], inline:true}
                    //     )
                    // }
                    var temp_comment = '';
                    for(i = 0;i < jewelTotal.length;i++){
                        const temp_num = i + 1;
                        if(jewelTotal[i] != 0){
                            temp_comment += (temp_num.toString() + '레벨 보석: ' + jewelTotal[i].toString() + '\n');
                        }
                    }
                    embed.addFields({name: '보석 통계', value: temp_comment});
                    embed.addFields({ name: '\u200B', value: '\u200B' },);
                    for(i = 0;i < card.length;i++){
                        embed.addFields(
                            {name: card[i], value: cardDescription[i], inline:true}
                        )
                    }
                    
                    msg.reply({embeds: [embed]});
                })
                .catch(function(result) {
                    console.log(result)
                })
                // const $ = cheerio.load(html.data);
                // console.log(cheerio.load(html.data))
                // const expeditionLevel = $("level-info__expedition").text();
                // const itemLevel = $("level-info__item").text();
                // console.log(`원정대 Lv.${expeditionLevel} / 아이템 Lv.${itemLevel}`);
            }
            else{
                msg.reply('[Error]: 명령어 오류')
                msg.reply('[Command Format] !쌀 (금액)')
            }
        }
        /*              Not Service Channel                 */
        else {

        }
});

client.on('interactionCreate', async interaction => {
    // console.log(interaction);
    if (!interaction.isButton()) return;

    const dataBuffer = fs.readFileSync('party.json')
    const dataJSON = dataBuffer.toString()
    const data = JSON.parse(dataJSON)

    if (interaction.customId == '1파티') {
        const row = new MessageActionRow()
        if (data.First.Clear === 'False') {
            data.First.Clear = 'True'
            row.addComponents(
                new MessageButton()
                    .setCustomId('1파티')
                    .setLabel('Clear')
                    .setStyle('PRIMARY'),
            );
            await interaction.update({ content: '1파티 클리어', components: [row] });
        }
        else {
            data.First.Clear = 'False'
            row.addComponents(
                new MessageButton()
                    .setCustomId('1파티')
                    .setLabel('Not Clear')
                    .setStyle('SECONDARY'),
            );
            await interaction.update({ content: '1파티 수정', components: [row] });
        }
        const saveJSON = JSON.stringify(data)
        fs.writeFileSync('party.json', saveJSON)
    }
    if (interaction.customId == '2파티') {
        const row = new MessageActionRow()
        if (data.Second.Clear === 'False') {
            data.Second.Clear = 'True'
            row.addComponents(
                new MessageButton()
                    .setCustomId('2파티')
                    .setLabel('Clear')
                    .setStyle('PRIMARY'),
            );
            await interaction.update({ content: '2파티 클리어', components: [row] });
        }
        else {
            data.Second.Clear = 'False'
            row.addComponents(
                new MessageButton()
                    .setCustomId('2파티')
                    .setLabel('Not Clear')
                    .setStyle('SECONDARY'),
            );
            await interaction.update({ content: '2파티 수정', components: [row] });
        }
        const saveJSON = JSON.stringify(data)
        fs.writeFileSync('party.json', saveJSON)
    }
    if (interaction.customId == '3파티') {
        const row = new MessageActionRow()
        if (data.Third.Clear === 'False') {
            data.Third.Clear = 'True'
            row.addComponents(
                new MessageButton()
                    .setCustomId('3파티')
                    .setLabel('Clear')
                    .setStyle('PRIMARY'),
            );
            await interaction.update({ content: '3파티 클리어', components: [row] });
        }
        else {
            data.Third.Clear = 'False'
            row.addComponents(
                new MessageButton()
                    .setCustomId('3파티')
                    .setLabel('Not Clear')
                    .setStyle('SECONDARY'),
            );
            await interaction.update({ content: '3파티 수정', components: [row] });
        }
        const saveJSON = JSON.stringify(data)
        fs.writeFileSync('party.json', saveJSON)
    }
    if (interaction.customId == '4파티') {
        const row = new MessageActionRow()
        if (data.Forth.Clear === 'False') {
            data.Forth.Clear = 'True'
            row.addComponents(
                new MessageButton()
                    .setCustomId('4파티')
                    .setLabel('Clear')
                    .setStyle('PRIMARY'),
            );
            await interaction.update({ content: '4파티 클리어', components: [row] });
        }
        else {
            data.Forth.Clear = 'False'
            row.addComponents(
                new MessageButton()
                    .setCustomId('4파티')
                    .setLabel('Not Clear')
                    .setStyle('SECONDARY'),
            );
            await interaction.update({ content: '4파티 수정', components: [row] });
        }
        const saveJSON = JSON.stringify(data)
        fs.writeFileSync('party.json', saveJSON)
    }
    if (interaction.customId == '5파티') {
        const row = new MessageActionRow()
        if (data.Fifth.Clear === 'False') {
            data.Fifth.Clear = 'True'
            row.addComponents(
                new MessageButton()
                    .setCustomId('5파티')
                    .setLabel('Clear')
                    .setStyle('PRIMARY'),
            );
            await interaction.update({ content: '5파티 클리어', components: [row] });
        }
        else {
            data.Fifth.Clear = 'False'
            row.addComponents(
                new MessageButton()
                    .setCustomId('5파티')
                    .setLabel('Not Clear')
                    .setStyle('SECONDARY'),
            );
            await interaction.update({ content: '5파티 수정', components: [row] });
        }
        const saveJSON = JSON.stringify(data)
        fs.writeFileSync('party.json', saveJSON)
    }
});

client.login(process.env.DISCORD_TOKEN);