const ms = require('ms')
const TelegramApi = require('node-telegram-bot-api')

const token = '1931832423:AAFeMK0FrM96YKb3IQ-te8sAODzQ3t_XV5o'

const bot = new TelegramApi(token, {polling: true})

const chats = {}

const gameOptions={
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{text: '1', callback_data: '1'}, {text: '2', callback_data: '2'}, {text: '3', callback_data: '3'}],
            [{text: '4', callback_data: '4'}, {text: '5', callback_data: '5'}, {text: '6', callback_data: '6'}],
            [{text: '7', callback_data: '7'}, {text: '8', callback_data: '8'}, {text: '9', callback_data: '9'}],
        ]
    })
}



const start = () =>{
    bot.on('message', async msg => {
        const text = msg.text
        const chatId = msg.chat.id
    
        bot.setMyCommands([
            {command: '/start', description: 'Начальное приветствие'},
            {command: '/info', description: 'Получить информацию о пользователе'},
            {command: '/game', description: 'Игра' }
        ])
        
        if(text === '/info'){
            await bot.sendMessage(chatId, `Тебя зовут: ${msg.from.first_name}, ${msg.from.username}`)
            await bot.sendSticker(chatId, 'https://cdn.tlgrm.app/stickers/dc7/a36/dc7a3659-1457-4506-9294-0d28f529bb0a/192/1.webp')
        }
        if(text === '/game'){
            await bot.sendMessage(chatId, `Сейчас я загадаю цифру от 0 до 9, а ты должен отгадать`)
            const randomNumber = Math.floor(Math.random() * 10)
            chats[chatId] = randomNumber
            return bot.sendMessage(chatId, 'Отгадай', gameOptions)
        }
        return bot.sendMessage(chatId, 'Непонятно')
    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id
        if(data === chats[chatId]){
            return await bot.sendMessage(chatId, `Поздравляю, ты угадал цифру ${chatId}`)
        } else {
            return bot.sendMessage(chatId, `К сожалению ты не угадал, бот загадал ${chatId}`)
        }
    })
}

start()