const axios = require('axios');
const cheerio = require('cheerio');

const encodeNickname = encodeURI("욱크루지");
const getBreeds = async () => {
  try {
    return await axios.get(`https://lostark.game.onstove.com/Profile/Character/${encodeNickname}`);
  } catch (error) {
    console.error(error);
  }
};

const countBreeds = async () => {
  const html = await getBreeds();
  const $ = cheerio.load(html.data);
  console.log(cheerio.load(html.data))
  const expeditionLevel = $("div.level-info__expedition").text();
  const itemLevel = $("div.level-info__item").text();
  console.log(`원정대 Lv.${expeditionLevel} / 아이템 Lv.${itemLevel}`);
};

countBreeds();