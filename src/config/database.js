const mongoose = require('mongoose')

const Glog = require('../glogs')
let glog = new Glog()

mongoose.set('useFindAndModify', false)
mongoose.connect(process.env.MONGO_URI, { 
		useNewUrlParser: true, 
		useUnifiedTopology: true 
	}).then(() => {
        glog.nlog("sys", `Databases started!`)
    }).catch((err) => {
        glog.nlog("error", `Databases error! ${err.message}`)
    })