const dotenv = require('dotenv');
const mongoose = require('mongoose')
const path = require('path');
const app = require('./app');


dotenv.config({ path: path.join(__dirname, '.env') });





const DB = process.env.DB_URI.replace('<db_password>', process.env.DB_PASSWORD);
const PORT = process.env.PORT || 3000;


let server;

mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('DB connection successful! ✅');

    server = app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT} 🚀 `);
    })

}).catch(err => {
    console.error('DB connection error:', err);
    process.exit(1); // Exit the process with failure
})


