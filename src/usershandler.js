const User = require('./models/User')

const { Telegram } = require('telegraf')
const tg = new Telegram(process.env.BOT_TOKEN)

const { Markup } = require('telegraf')

const text = require(`./config/lang/${process.env.LANGUAGE}`)

const Glog = require('./glogs')
let glog = new Glog()

class UsersHandler {

    checkUser(_id) {
        try {
            return User.findById(_id, (err, res) => {
                if (err) {
                    glog.nlog("error", err)
                } else {
                    if (!res) {
                        const user = new User({
                            _id,
                            rating: 0,
                            paidStatus: 0
                        })
                        user.save()
                        
                    }
                    return res
                }
            })
        } catch (e) {
            glog.nlog('error', e)
        }
    }

    changeGender(_id, gender) {
        try {
            User.findOneAndUpdate({ _id }, { gender: Boolean(parseInt(gender)) }).then((user) => {
                user.save()
            })
        } catch (e) {
            glog.nlog('error', e)
        }
    }

    changeAge(_id, age) {
        try {
            User.findOneAndUpdate({ _id }, { age }).then((user) => {
                user.save()
            })
        } catch (e) {
            glog.nlog('error', e)
        }
    }

    changeReport(_id, state) {
        try {
            // if (state) {
            //     User.findById(_id).then((user) => {
            //         User.findOneAndUpdate({ _id }, { rating: user.rating + 1 }).then((cuser) => {
            //             cuser.save()
            //         })
            //     })
            // }
        } catch (e) {
            glog.nlog('error', e)
        }
    }

    getGenger(partnerID) {
        try {
            tg.sendMessage(partnerID, text.START.GENDER,
                Markup.inlineKeyboard([
                    [Markup.button.callback('♂️ Чоловік', `setGender]0]${partnerID}`), Markup.button.callback('♀️ Жінка', `setGender]1]${partnerID}`)],
                ])
            )
        } catch (e) {
            glog.nlog('error', e)
        }
    }

    getAge(partnerID) {
        try {
            tg.sendMessage(partnerID, text.START.AGE,
                Markup.inlineKeyboard([
                    [Markup.button.callback('<18', `setAge]<18]${partnerID}`), Markup.button.callback('18-22', `setAge]18-22]${partnerID}`), Markup.button.callback('23-27', `setAge]23-27]${partnerID}`), Markup.button.callback('28-32', `setAge]28-32]${partnerID}`), Markup.button.callback('32-36', `setAge]32-36]${partnerID}`), Markup.button.callback('36>', `setAge]36>]${partnerID}`)],
                ])
            )
        } catch (e) {
            glog.nlog('error', e)
        }
    }
}

module.exports = UsersHandler