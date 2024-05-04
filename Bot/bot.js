import TelegramBot from 'node-telegram-bot-api'
import express from 'express'
import cors from 'cors'

const token = '6757073330:AAFtn6evlg50y9F70ncomVXWlikDF6LhKLk'
const webAppUrl  = 'https://flavorscatalogbot.netlify.app/'

const bot = new TelegramBot(token, {polling: true});
const app = express()

app.use(express.json())
app.use(cors())

bot.on('message', async (msg) => {
    const chatId = msg.chat.id
    const text = msg.text

    if (text === '/start') {
        await bot.sendMessage(chatId, `Давайте начнем 🥩

Пожалуйста, нажмите на кнопку ниже, чтобы заказать свой идеальный обед!.`, {
            reply_markup: {
                keyboard: [[{text: "Заказать еду", web_app: {url: webAppUrl}}]]
            }
        })
    }
})

app.post('/web-data', async (req, res) => {
    const {queryId ,products = []} = req.body
    try {
        await bot.answerWebAppQuery(queryId, {
            type: 'article',
            id: queryId,
            title: 'Успешная покупка',
            input_message_content: {
                message_text: ` вы оформили заказ\n\n${products.map(item => item.title).join(', ')}`
            }
        })
        return res.status(200).json({});
    } catch (e) {
        return res.status(500).json({})
    }
})

const PORT = 8000;

app.listen(PORT, () => console.log('server started on PORT ' + PORT))