import TelegramBot from 'node-telegram-bot-api'
import express from 'express'
import cors from 'cors'
import {formatDate} from "./formatDate.js";

const token = '6757073330:AAFtn6evlg50y9F70ncomVXWlikDF6LhKLk'
const webAppUrl  = 'https://flavorscatalogbot.netlify.app/'

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

Пожалуйста, нажмите на кнопку ниже, чтобы заказать фермерскую продукцию!

Доставка от 2500 рублей бесплатная.`, {
            reply_markup: {
                keyboard: [[{text: "Заказать еду", web_app: {url: webAppUrl}}]]
            }
        })
        console.log(userId)
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
        }).join('')}`, {
            reply_markup: {
                inline_keyboard: [[{ text: "Сделать новый заказ", callback_data: "new_order" }]]
            }
        });

        return res.status(200).json({});
    } catch (error) {
        console.error('Error answering WebApp query:', error);
        return res.status(500).json({})
    }
})

bot.on('callback_query', async (query) => {
    const data = query.data;
    const chatId = query.message.chat.id;

    if (data === "new_order") {
        await bot.sendMessage(chatId, "Для создания нового заказа нажмите на -> /start");
    }
});


const PORT = 8000;

app.listen(PORT, () => console.log('server started on PORT ' + PORT))