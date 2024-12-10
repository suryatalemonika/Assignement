const mongoose = require('mongoose');

const dbConnect = mongoose.connect('mongodb://localhost:27017/mydatabase')
    .then((result) => {
        console.log(`Connected to Database`);
    })
    .catch((error) => {
        console.log(`Error while connecting to database ${error}`);
    })


module.exports = {
    dbConnect
}

