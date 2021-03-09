module.exports = (req, res, next) => {
    console.log('-----req.headers-------', req.url)
    if (req.url.includes('/uploads') && !req.session.userid) { return res.redirect("/users/login") }
    next();
}