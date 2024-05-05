import TelegramBot from 'node-telegram-bot-api'
import express from 'express'
import cors from 'cors'
import {formatDate} from "./formatDate.js";

const token = '6757073330:AAFtn6evlg50y9F70ncomVXWlikDF6LhKLk'
const webAppUrl  = 'http://flavorscatalogbot.netlify.app/'

const bot = new TelegramBot(token, {polling: true});
const app = express()

app.use(express.json())
app.use(cors())

let userId = {}

bot.on('message', async (msg) => {
    const chatId = msg.chat.id
    const text = msg.text
    userId = chatId

    if (text === '/start') {
        await bot.sendMessage(userId, `Давайте начнем 🥩

Пожалуйста, нажмите на кнопку ниже, чтобы заказать свой идеальный обед!`, {
            reply_markup: {
                keyboard: [[{text: "Заказать еду", web_app: {url: webAppUrl}}]]
            }
        })
    }
})

app.post('/web-data', async (req, res) => {
    const {products = []} = req.body
    const currentDate = new Date()
    const formattedDate = formatDate(currentDate)
    try {
        await bot.sendMessage(userId, `Каталог вкусов - Ваш заказ
        
${formattedDate} вы оформили заказ\n\n${products.map(item => {
            return `🔹 ${item.title} (Количество: ${item.quantity})\n`;
        }).join('')}`);
        return res.status(200).json({});
    } catch (error) {
        console.error('Error answering WebApp query:', error);
        return res.status(500).json({})
    }
})

const PORT = 5000;

app.listen(PORT, () => console.log('server started on PORT ' + PORT))