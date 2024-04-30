import { Telegraf } from "telegraf"
const TOKEN = '6757073330:AAFtn6evlg50y9F70ncomVXWlikDF6LhKLk'
const bot = new Telegraf(TOKEN)

const web_link = 'https://flavorscatalogbot.netlify.app/'

bot.start((ctx) => 
ctx.reply(`Давайте начнем 🥩

Пожалуйста, нажмите на кнопку ниже, чтобы заказать свой идеальный обед!.`, {
    reply_markup: {
        keyboard: [[{text: "Заказать еду", web_app: {url: web_link}}]]
    }
}))

bot.launch()