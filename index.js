const express = require("express");
const app = express()

const PORT = process.env.PORT || 4500

app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use('/api/videos', require('./route'))

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))