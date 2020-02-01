const express = require('express');
const router = express.Router();

const courses = [
    { id: 1, name: 'course1' },
    { id: 2, name: 'course2' },
    { id: 3, name: 'course3' }
]
// because of courses router created in index.js express will handle any request for /api/courses through that so I can remove api/courses here and just use /
router.get('/', (req, res) => {
    res.send(courses);

});

router.post('/', (req, res) => {
    const { error } = validateCourse(req.body); //like result.error
    if (error) return res.status(400).send(error.details[0].message);

    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course);
});

router.put('/:id', (req, res) => {
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
router.delete('/:id', (req, res) => {
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

router.get('/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send(`Error 404: The course can not be found`);
    res.send(course);
});

module.exports = router;