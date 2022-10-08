require('dotenv').config()

const Student = require('../models/Student')
const asyncHandler = require('express-async-handler')
const qrcode = require('qrcode')
const nodemailer = require('nodemailer')

const sendEmail =  async ( id , email)=>{

    const code = await qrcode.toDataURL(`http://cscamp.me/student/${id}`)

    let transporter = nodemailer.createTransport({
        service : 'gmail',
        host:"smtp.gmail.com",
        secure: false,
        auth:{
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASS
        }
    })

    const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: email,
        subject: "Your qrCode in Cs camp",
        attachDataUrls:true,
        html: `<h1> your code </h1>  <img width = "300" src="${code}" alt="qrCode" />`
    }

    try{

        const result = await transporter.sendMail(mailOptions)

    }catch(e){
        console.log(e);
    }
}

// @desc Get Student
// @route GET /student/:id
// @access Private
const getStudent =  asyncHandler(async (req , res)=>{
    const id = req.params
    const student = await Student.findById(id)

    if(!student){
        return res.status(400).json({ message: 'No Student Found' })
    }

    res.json(student)

})

// @desc Get all Students
// @route GET /student
// @access Private
const getAllStudents = asyncHandler(async (req , res)=>{
    const students = await Student.find().exec()

    res.json(students)
})

// @desc create new Student
// @route POST /student
// @access Private
const createNewStudent = asyncHandler(async (req , res)=>{
    const { firstName, lastName, phone, email, university, faculty, department, academicLevel, vjudge, codeforces} = req.body

    // Confirm data
    if(!firstName || !lastName || !phone || !email || !university || !faculty || !department || !academicLevel){
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Check for duplicate email
    const duplicate = await Student.findOne({email}).lean().exec()

    if(duplicate){
        return res.status(409).json({ message: 'Duplicate email' })
    }

    const studentObject = {
        firstName,
        lastName,
        phone,
        email,
        university,
        faculty,
        department,
        academicLevel,
        vjudge,
        codeforces
    }

    // Create and store new student
    const student = await Student.create(studentObject)

    if (student) { //created 

        sendEmail(student._id , email)

        res.status(201).json({ message: `New student ${firstName} ${lastName} created` })
    } else {
        res.status(400).json({ message: 'Invalid student data received' })
    }
})

// @desc update Student
// @route PUT /student
// @access Private
const updateStudent = asyncHandler(async (req , res)=>{
    const { id , firstName, lastName, phone, email, university, faculty, department, academicLevel, vjudge, codeforces} = req.body

    // Confirm data
    if( !id || !firstName || !lastName || !phone || !email || !university || !faculty || !department || !academicLevel){
        return res.status(400).json({ message: 'All fields are required' })
    }

    const student = await Student.findById(id)

    // Check for duplicate email
    const duplicate = await Student.findOne({email}).lean().exec()

    if(duplicate && duplicate?._id.toString() !== id){
        return res.status(409).json({ message: 'Duplicate email' })
    }

        student.firstName = firstName
        student.lastName = lastName
        student.phone = phone
        student.email = email
        student.university = university
        student.faculty = faculty
        student.department = department
        student.academicLevel = academicLevel
        student.vjudge = vjudge
        student.codeforces = codeforces

        const updatedStudent = student.save()

        res.json({message: `${updatedStudent.firstName} updated`})
})

// @desc delete Student
// @route DELETE /student
// @access Private
const deleteStudent = asyncHandler(async (req , res)=>{
        const {id} = req.body

        // Confirm data
        if(!id){
            return res.status(400).json({ message: 'id is required' })
        }

        const student = await Student.findById(id).exec()

        if(!student){
            return res.status(400).json({ message: 'Student not found' })
        }

        const result = student.deleteOne()

        res.json(`Student ${result.firstName} ${result.lastName} with ID ${result._id} deleted`)
})


module.exports = {
    getStudent,
    getAllStudents,
    createNewStudent,
    updateStudent,
    deleteStudent
}




