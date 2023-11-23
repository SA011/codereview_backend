const dotenv = require("dotenv");
const Express = require("express");

dotenv.config();

const Connection = require('./database/connect.js');
const router = require('./routes/api.js');
const cors = require('cors');

const PORT = process.env.PORT || 8080;
const app = Express();

app.use(Express.json());
app.use('/api',router);



app.listen(PORT, () => {
    console.log(`The Server is running on Port ${PORT}`);
});
