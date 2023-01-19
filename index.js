
require('dotenv').config()
const connectToMongo=require('./db');
const express = require('express')
var cors = require('cors')
connectToMongo();
const PORT = process.env.PORT || 5000
var app = express()
app.use(cors())
app.use(express.json())
// Available Routs
app.use('/api/auth',require('./routes/auth'))
app.use('/api/sale',require('./routes/sale'))

app.listen(PORT, () => {
  console.log(process.env.DATABASE)
  console.log(`JKIL Sales app listening on port ${PORT}`)
})