const env = process.env.NODE_ENV || "development"

if (env === "development" || env === "test") {
    const config = require('./config.json')
    const envConfig = config[env]
    Object.keys(envConfig).forEach(key => {
        process.env[key] = config[env][key]
    })
}