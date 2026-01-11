const express = require('express');
require('dotenv').config();
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
// connectDB();

const userRoutes = require('./routes/userRoutes.js');
const doctorRoutes = require('./routes/doctorRoutes.js')
const dashboardRoutes = require('./routes/dashobaordRoutes.js')
const appointmentRoutes = require('./routes/appointmentRoute.js')


const app = express();
const port = process.env.PORT || 7008;

//Middleware
app.use(express.json())
app.use(cors())

app.get('/', (req, res) => res.send('Hello World!'))

//Routes
app.use('/api/user', userRoutes);
app.use('/api/doctor', doctorRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use("/api/appointment", appointmentRoutes);



app.use('/uploads', express.static(path.join(__dirname , "uploads")));


//http://localhost:7008/api/user/register


app.listen(port, () => {
    console.log(`Server is running at ${port} ✅`);
})