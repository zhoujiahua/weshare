const { SS_KEY } = require("@config/secrets");
const session = require("express-session");
const appRoot = require("app-root-path");
const cors = require("cors");

// Used libaray
module.exports = (app) => {
    // Used cors
    app.use(cors());

    // Used session
    app.use(session({
        secret: SS_KEY,
        resave: false,
        saveUninitialized: true,
        cookie: {
            secure: false,
            maxAge: 1000 * 60 * 30
        }
    }))
}