const morgan = require('morgan');
const helmet = require('helmet');
const Joi = require('@hapi/joi'); //Joi is a class and, using Pascal naming convention, is Capitalized
const logger = require('./logger');
const authenticator = require('./authenticator');
const express = require('express');
const app = express();

// console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
// console.log(`app: ${app.get('env')}`);

app.use(express.json());
app.use(express.urlencoded({ extended: true})); //key=value&key=value
app.use(express.static('public'));
app.use(helmet());

if (app.get('env') === 'development'){
app.use(morgan('tiny'));
console.log('Morgan enabled...');
};

app.use(logger);
app.use(authenticator);
 function validateCourse(course) {
    const schema = Joi.object({
        name: Joi.string() 
          .min(3)
          .required()
      });
      return schema.validate({name: "course"}); 
     //return Joi.validate(course, schema);
 }



const courses = [
    { id: 1, name: 'course1' },
    { id: 2, name: 'course2' },
    { id: 3, name: 'course3' }
]

app.get('/', (req, res) => {
    res.send(`Welcome!`);

});

app.get('/api/courses', (req, res) => {
    res.send(courses);

});

app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send(`Error 404: The course can not be found`);
    res.send(course);
});

  
  
app.post('/api/courses', (req, res) => {
    const { error } = validateCourse(req.body); //like result.error
    if (error) return res.status(400).send(error.details[0].message);

    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course);
});

app.put('/api/courses/:id', (req, res) => {
    // Look up the course
    // If not existing, return 404
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send(`Error 404: The course can not be found`);

    // Validate
    // If invalid, return 400 - Bad request
    const { error } = validateCourse(req.body); //like result.error
    if (error) return res.status(400).send(error.details[0].message);
    // Update course
    course.name = req.body.name;
    // Return the updated course
    res.send(course);
});

//Delete course
app.delete('/api/courses/:id', (req, res) => {
    // Look up the course
    // if doesn't exist 404 error
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send(`Error 404: The course can not be found`);

    // if does exist then delete
    const index = courses.indexOf(course);
    courses.splice(index, 1);
    // Return the same course to the client
    res.send(course);
});







//Port 
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`listening on port ${port}`);
});