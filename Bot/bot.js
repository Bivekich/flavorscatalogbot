import TelegramBot from 'node-telegram-bot-api'
import express from 'express'
import cors from 'cors'
import {formatDate} from "./formatDate.js";
import {User} from "./db.js"

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

        try {
            await User.updateOne({userId: chatId}, {userId: chatId}, {upsert: true})
        } catch (error) {
            console.error('Ошибка отслеживания пользователя', error)
        }
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
    } else if (data.startsWith('stats_')) {
        const range = data.split('_')[1]
        let days
        if (range === '1day') days = 1
        else if (range === '7days') days = 7
        else if (range === '30days') days = 30
        
        const dataThreshold = new Date()
        dataThreshold.setDate(dataThreshold.getDate() - days)
        
        try {
            const userCount = await User.countDocuments({createdAt: {$gte: dataThreshold}})
            await bot.sendMessage(chatId, `Количество уникальных пользователей за последние ${days} дней: ${userCount}`)
        } catch (error) {
            console.error('Ошибка получения статистики', error)
            await bot.sendMessage(chatId, 'Не удалось получить статистику.')
        }
    }
});

bot.onText(/\/stats/, async (msg) => {
    const chatId = msg.chat.id;
    
    await bot.sendMessage(chatId, 'Выберите промежуток времени для статистики:', {
        reply_markup: {
            inline_keyboard: [
                [{text: '1 день', callback_data: 'stats_1day'}],
                [{text: '7 дней', callback_data: 'stats_7days'}],
                [{text: '30 дней', callback_data: 'stats_30days'}],
            ]
        }
    })
})

const PORT = 8000;

app.listen(PORT, () => console.log('server started on PORT ' + PORT))