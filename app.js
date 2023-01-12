require('dotenv').config()

const express = require('express')
const app = express()

const connectDB = require('./db/connect')
const productRouter = require('./routes/products')


const notFound = require('./middleware/not-found')
const errorHandler = require('./middleware/error-handler')


// Middleware
app.use(express.json())


// Routes
app.get('/', (req, res) => {
    res.send('<h1>Store API</h1><a href="/api/v1/products">Product routes</a>')
})

app.use('/api/v1/products', productRouter)

// Product Routes


app.use(notFound)
app.use(errorHandler)

const port = process.env.PORT || 3000

const startServer = async() => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, console.log(`Server is listening to ${port}...`))
    } catch (error) {
        console.log(error)
    }
}

startServer()