const express = require('express')
const router = express.Router()
const studentController = require("../controller/studentController")
const verifyJWT = require('../middleware/verifyJWT')

// router.use(verifyJWT)

router.route('/')
    .get(studentController.getAllStudents)
    .post(studentController.createNewStudent)
    .put(studentController.updateStudent)
    .delete(studentController.deleteStudent)

router.get('/:id',studentController.getStudent)

module.exports = router