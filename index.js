require('dotenv').config()
require('./src/config/database')

const text = require(`./src/config/lang/${process.env.LANGUAGE}`)

const express = require('express')
const app = express()
const port = process.env.PORT || 5000

const { Telegraf } = require('telegraf')
const bot = new Telegraf(process.env.BOT_TOKEN)

const MatchMaker = require('./src/matchmaker')
let Matchmaker = new MatchMaker()

const Glog = require('./src/glogs')
let glog = new Glog()

const UsersHandler = require('./src/usershandler')
let usersHandler = new UsersHandler()

Matchmaker.init()

bot.start((ctx) => {
  try {
    const id = ctx.message.from.id
    ctx.reply(text.START.FIRST)
    usersHandler.checkUser(id).then(userExists => {
      if (userExists && userExists.age) {
        ctx.reply(text.START.END)
      } else {
        glog.nlog("tmsg", `${ctx.message.from.username} new start`)
        usersHandler.getGenger(id)
      }
    })
  } catch (e) {
    glog.nlog('error', e)
  }
})

bot.command('help', (ctx) => {
  try {
    ctx.reply(text.HELP).then(() => {
      ctx.reply(text.START.END)
    })
  } catch (e) {
    glog.nlog('error', e)
  }
})

bot.command('ping', (ctx) => {
  try {
    const start = new Date()
    const s = start / 1000 - ctx.message.date
    ctx.replyWithHTML(`${text.PING} - <code>⏱ ${s.toFixed(3)} sec</code>`)
  } catch (e) {
    glog.nlog('error', e)
  }
})

bot.command('search', (ctx) => {
  try {
    let id = ctx.message.chat.id
    usersHandler.checkUser(id).then(userExists => {
      if (userExists && userExists.age) {
        Matchmaker.find(id)
      } else {
        usersHandler.getGenger(id)
      }
    })
  } catch (e) {
    glog.nlog('error', e)
  }
})

bot.command('next', (ctx) => {
  try {
    let id = ctx.message.chat.id
    Matchmaker.next(id)
  } catch (e) {
    glog.nlog('error', e)
  }
})

bot.command('stop', (ctx) => {
  try {
    let id = ctx.message.chat.id
    Matchmaker.stop(id)
  } catch (e) {
    glog.nlog('error', e)
  }
})

bot.command('exit', (ctx) => {
  try {
    let id = ctx.message.chat.id
    Matchmaker.exit(id)
  } catch (e) {
    glog.nlog('error', e)
  }
})

bot.command('report', (ctx) => {
  try {
    let id = ctx.message.chat.id
    Matchmaker.report(id)
  } catch (e) {
    glog.nlog('error', e)
  }
})

bot.command('premium', (ctx) => {
  try {
    let id = ctx.message.chat.id
    Matchmaker.report(id)
  } catch (e) {
    glog.nlog('error', e)
  }
})

bot.on('text', (ctx) => {
  try {
    let id = ctx.message.chat.id
    let message = ctx.message
    Matchmaker.connect(id, ['text', message])
  } catch (e) {
    glog.nlog('error', e)
  }
})

bot.on('sticker', (ctx) => {
  try {
    let id = ctx.message.chat.id
    let sticker = ctx.message
    Matchmaker.connect(id, ['sticker', sticker])
  } catch (e) {
    glog.nlog('error', e)
  }
})

bot.on('voice', (ctx) => {
  try {
    let id = ctx.message.chat.id
    let voice = ctx.message
    Matchmaker.connect(id, ['voice', voice])
  } catch (e) {
    glog.nlog('error', e)
  }
})

bot.on('photo', (ctx) => {
  try {
    let id = ctx.message.chat.id
    let photos = ctx.message.photo
    let photoID = photos[photos.length - 1].file_id
    Matchmaker.connect(id, ['photo', photoID])
  } catch (e) {
    glog.nlog('error', e)
  }
})

bot.on('video', (ctx) => {
  try {
    let id = ctx.message.chat.id
    let videoID = ctx.message.video.file_id
    Matchmaker.connect(id, ['video', videoID])
  } catch (e) {
    glog.nlog('error', e)
  }
})

bot.on('video_note', (ctx) => {
  try {
    let id = ctx.message.chat.id
    let video_note = ctx.message
    Matchmaker.connect(id, ['video_note', video_note])
  } catch (e) {
    glog.nlog('error', e)
  }
})

bot.on('callback_query', (ctx) => {
    let query = ctx.callbackQuery.data.split(']')

    switch (query[0]) {
      case 'openPhoto':
        try{
        const urlPhoto = `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/photos/${query[1]}`
        ctx.deleteMessage().then(ctx.replyWithPhoto({ url: urlPhoto })).catch(err => console.log(err))
          } catch (e) {
    glog.nlog('error', e)
        }
        break;
      case 'openVideo':
        try {
        const urlVideo = `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/videos/${query[1]}`
        ctx.deleteMessage().then(ctx.replyWithVideo({ url: urlVideo })).catch(err => console.log(err))
        } catch (e) {
    glog.nlog('error', e)
  }
        break;
      case 'setGender':
        try{
        const gender = query[1]
        usersHandler.changeGender(query[2], gender)
        ctx.deleteMessage().catch(err => console.log(err)).then(() => {
          usersHandler.getAge(query[2])
        })      
          } catch (e) {
    glog.nlog('error', e)
  }
        break;
      case 'setAge':
      try{
        const age = query[1]
        usersHandler.changeAge(query[2], age)
        ctx.reply(text.START.END)
        ctx.deleteMessage().catch(err => console.log(err))
        } catch (e) {
    glog.nlog('error', e)
  }
        break;
      default:
        console.log('unknown')
        break;
    }
})

bot.launch()

app.get('/', (req, res) => res.send("Hello World!"))

app.listen(port, () => {
  glog.nlog("sys", `Example app listening at http://localhost:${port}`)
})