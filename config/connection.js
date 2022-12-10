const mongoose = require('mongoose')
const db = require('../models')
const Role = db.role;


const ConnectDB = async () => {
    mongoose.
        connect(
            process.env.DB_URI,
            { useNewUrlParser: true, useUnifiedTopology: true }
        )
        .then(() => {
            console.log('Connected to MongoDB');
            initial()
        })
        .catch((err) => {
            console.log(err);
            process.exit()
        });


    function initial() {
        Role.estimatedDocumentCount((err, count) => {
            if (!err && count === 0) {
                new Role({
                    name: "user"
                }).save(err => {
                    if (err) {
                        console.log("error", err)
                    }

                    console.log("Created User")
                });

                new Role({
                    name: "admin"
                }).save(err => {
                    if (err) {
                        console.log("error", err)
                    }

                    console.log("Created Admin")
                })
            }
        })
    }

}

module.exports = ConnectDB