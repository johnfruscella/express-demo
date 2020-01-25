const Joi = require('joi'); //Joi is a class and, using Pascal naming convention, is Capitalized
const express = require('express');
const app = express();

app.use(express.json());

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

app.post('/api/courses', (req, res) => {
    const schema = {
        name: Joi.string().min(3).required()
    };

    const result = Joi.validate(req.body, schema);
    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }
    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course);
});

app.put('/api/courses/:id', (req, res) =>{
// Look up the course
// If not existing, return 404
const course = courses.find(c => c.id === parseInt(req.params.id));
if (!course) res.status(404).send(`Error 404: The course can not be found`);

// Validate
// If invalid, return 400 - Bad request
const schema = {
    name: Joi.string().min(3).required()
};

const result = Joi.validate(req.body, schema);
if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
}
// Update course
course.name = req.body.name;
// Return the updated course
res.send(course);
});

app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) res.status(404).send(`Error 404: The course can not be found`);
    res.send(course);
});


//Port 
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`listening on port ${port}`);
});