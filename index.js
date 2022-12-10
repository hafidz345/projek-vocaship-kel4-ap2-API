const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors')
require('dotenv').config();
const ConnectDB = require('./config/connection')
const PORT = process.env.PORT || 3001;
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cors());

ConnectDB()
require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

