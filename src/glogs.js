class glog {
    nlog(type, msg) {
        const date = new Date()
        switch (type) {
            case "sys":
                console.log("\x1b[35m", `LOG_SYS (T:${date.toLocaleTimeString("ua-UA")}): ${msg}`)
                console.log("\x1b[0m")
                break;
            case "tmsg":
                console.log("\x1b[36m%s\x1b[0m", `LOG_TGMSG (T:${date.toLocaleTimeString("ua-UA")}): ${msg}`)
                console.log("\x1b[0m")
                break;
            case "error":
                console.log("\x1b[31m", `LOG_ERR (T:${date.toLocaleTimeString("ua-UA")}): ${msg}`)
                console.log("\x1b[0m")
                break;
            default:
                console.log("\x1b[31m", `LOG_UNKNOW (T:${date.toLocaleTimeString("ua-UA")}): ${msg}`)
                console.log("\x1b[0m")
        }
    }
}

module.exports = glog