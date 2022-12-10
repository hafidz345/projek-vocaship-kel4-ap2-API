const config = require('../config/auth.config');
const db = require('../models');
const User = db.user;
const Role = db.role;
const mongoose = require('mongoose')

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');


exports.signup = (req, res) => {
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8)
    });

    user.save((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }

        if (req.body.roles) {
            Role.find(
                {
                    name: { $in: req.body.roles }
                },
                (err, roles) => {
                    if (err) {
                        res.status(500).send({ message: err });
                        return;
                    }

                    user.roles = roles.map(role => role._id);
                    user.save(err => {
                        if (err) {
                            res.status(500).send({ message: err });
                            return;
                        }

                        res.send({ message: "User was registered successfully" })
                    });
                }
            );
        } else {
            Role.findOne({ name: "user" }, (err, role) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }

                user.roles = [role._id];
                user.save(err => {
                    if (err) {
                        res.status(500).send({ message: err });
                        return;
                    }

                    res.send({ message: "User was registered successfully" })
                });
            });
        }
    });
};

exports.signin = (req, res) => {
    User.findOne({
        email: req.body.email
    })
        .populate("roles", "-__v")
        .exec((err, user) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }

            if (!user) {
                return res.status(400).send({ message: "User Not Found" });
            }
            var passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );

            if (!passwordIsValid) {
                return res.status(401).send({
                    accessToken: null,
                    message: "Invalid Password!"
                });
            }

            var token = jwt.sign({ id: user.id }, config.secret, {
                expiresIn: 86400 //24hours
            });

            var authorities = [];

            for (let i = 0; i < user.roles.length; i++) {
                authorities.push("ROLE_" + user.roles[i].name.toUpperCase())
            }
            res.status(200).send({
                id: user._id,
                username: user.username,
                email: user.email,
                roles: authorities,
                accessToken: token
            });
        });
};

exports.getDataUser = (req, res, next) => {
    User.find()
        .then((users) => {
            res.status(201).send(users);
        })
        .catch((err) => {
            res.status(404).send(err)
        })
}

exports.getDataUserById = (req, res, next) => {
    try {
        if (mongoose.Types.ObjectId.isValid(req.params.id)) {
            User.findById(req.params.id)
                .then((User) => {
                    res.send(User)
                })
                .catch((err) => {
                    res.send(err)
                })
        }
        else {
            res.status(400).send({ message: "Invalid ID" })
        }
    }
    catch {

    }
}

exports.updateUser = (req, res, next) => {
    try {
        if (mongoose.Types.ObjectId.isValid(req.params.id)) {
            User.findByIdAndUpdate(req.params.id, {
                username: req.body.username,
                email: req.body.email,
                password: bcrypt.hashSync(req.body.password, 8),
            })
                .then(() => {
                    res.status(404).send({ message: "Berhasil diubah" })
                })
                .catch((err) => {
                    res.send(err)
                })
        }
    }
    catch (err) {
        res.send(err)
    }
}

exports.deleteById = (req, res, next) => {
    try {
        if (mongoose.Types.ObjectId.isValid(req.params.id)) {
            User.findByIdAndDelete(req.params.id)
                .then((user) => {
                    res.status(200).json({ message: 'Data berhasil dihapus' })
                })
                .catch((err) => {
                    res.send(err)
                })
        }
    }
    catch (err) {
        res.send(err);
    }
}