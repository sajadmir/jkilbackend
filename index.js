const connectToMongo=require('./db');
const express = require('express')
var cors = require('cors')
connectToMongo();
const port = 5000
var app = express()
app.use(cors())
app.use(express.json())
// Available Routs
app.use('/api/auth',require('./routes/auth'))
app.use('/api/sale',require('./routes/sale'))

app.listen(port, () => {
  console.log(`JKIL Sales app listening on port ${port}`)
})