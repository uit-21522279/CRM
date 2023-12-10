const path = require('path')
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const app = express()
app.use(cors());
const port = 3000

const route = require('./routes/index')

//middleware
app.use(express.urlencoded({extended: true}));
app.use(express.json())

// HTTP logger
app.use(morgan('combined'))

route(app)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})