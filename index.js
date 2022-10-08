require('dotenv').config()

const express = require('express')
const app = express()
const { logger, logEvents  } = require('./middleware/logger')
const errorHandler = require('./middleware/errorHandler')
const cookieParser = require('cookie-parser')
const cors = require("cors")
const corsOptions = require('./config/corsOptions')
const connectDB = require('./config/dbConn')
const mongoose = require('mongoose')
const port = process.env.PORT || 3000

connectDB()

app.use(logger)

app.use(cors(corsOptions))

app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.use(cookieParser())


app.use('/auth',require('./routes/authRoute'))
app.use('/user', require('./routes/userRoute'))
app.use('/student',require('./routes/studentRoute'))

app.all('*', (req, res) => {
    res.status(404)
    if (req.accepts('json')) {
        res.json({ message: '404 Not Found' })
    } else {
        res.type('txt').send('404 Not Found')
    }
})

app.use(errorHandler)

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
    app.listen(port, () => console.log(`Server running on port ${port}`))
})

mongoose.connection.on('error', err => {
    console.log(err)
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
})