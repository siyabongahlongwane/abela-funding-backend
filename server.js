require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;
const { mongoose } = require('./db');

const authController = require('./controllers/auth');
const applicationController = require('./controllers/applications');
const userController = require('./controllers/user');
const mailController = require('./controllers/mail');

app.use(express.json({ limit: '2MB' }));
app.use(cors());

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

app.use('/api/auth', authController);
app.use('/api/applications', applicationController);
app.use('/api/users', userController);
app.use('/api/mail', mailController.router);