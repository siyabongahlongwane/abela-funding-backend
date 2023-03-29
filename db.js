const mongoose = require('mongoose');
const DB_CONNECTION = {
    username: process.env.DB_CONNECTION_USERNAME,
    password: process.env.DB_CONNECTION_PASSWORD,
    host: process.env.DB_CONNECTION_HOST,
    db: process.env.DB_CONNECTION_DB
}
const CONNECTION_URI = `mongodb+srv://${DB_CONNECTION.username}:${DB_CONNECTION.password}@${DB_CONNECTION.host}/${DB_CONNECTION.db}?retryWrites=true&w=majority`
console.log(CONNECTION_URI);
mongoose.connect(CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    if (err) console.log(err);
    else console.log('DB connection established!')
});

mongoose.set('strictQuery', true);


module.exports = mongoose;