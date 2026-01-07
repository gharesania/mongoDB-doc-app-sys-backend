const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors')
const path = require('path');
const connectDB = require('./config/db');
// connectDB();

const userRoutes = require('./routes/userRoutes.js')


const port = process.env.PORT || 7008;

//Middleware
app.use(express.json())
app.use(cors())

//Routes
app.use('/api/user', userRoutes);
app.use('/uploads/', express.static(path.join(__dirname , 'uploads')));


//http://localhost:7008/api/user/register

app.get('/', (req, res) => 
    res.send("Hello World !")
)
app.listen(port, () => {
    console.log(`Server is running at ${port} ✅`);
})