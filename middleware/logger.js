function log(req, res, next) {
    console.log(`logging...`); //req.body
    next(); //passes control to the next middleware or give response. This ends this funtion.
};

module.exports = log;