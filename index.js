const debug = require('debug')('app:startup');
const config = require('config');
const morgan = require('morgan');
const helmet = require('helmet');
const Joi = require('@hapi/joi'); //Joi is a class and, using Pascal naming convention, is Capitalized
const logger = require('./middleware/logger');
const courses = require('./routes/courses');
const home = require('./routes/home');
const express = require('express');
const app = express();

// console.log(`NODE_ENV: ${process.env.NODE_ENV}`); When using this, process.env.NODE_ENV is set to undefined by default
// console.log(`app: ${app.get('env')}`);  app.get('env') showing environment variable with is set to development by default
app.set('view engine', 'pug'); //no need to require pug
app.set('views', './views'); //optional setting default


app.use(express.json());
app.use(express.urlencoded({ extended: true })); //key=value&key=value
app.use(express.static('public'));
app.use(helmet());
app.use('/api/courses', courses);
app.use('/', courses);

// Configuration
// console.log('Application Name ' + config.get('name'));
// console.log('Mail Server ' + config.get('mail.host'));
// console.log('Mail Password ' + config.get('mail.password')); //Checkout 0507 for info on this


//app.get('env') showing environment variable with is set to development by default
// can change environment variable in command line using export(for linux and mac) or set.for example export NODE_ENV=production , staging or develpoment
if (app.get('env') === 'development') {
    app.use(morgan('tiny'));
    debug('Morgan enabled...'); //will see this debugging info when you change DEBUG environment variable (export DEBUG=app:startup) won't see if (export DEBUG= )
};


app.use(logger);

function validateCourse(course) {
    const schema = Joi.object({
        name: Joi.string()
            .min(3)
            .required()
    });
    return schema.validate({ name: "course" });
    //return Joi.validate(course, schema);
}

//Port 
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`listening on port ${port}`);
});