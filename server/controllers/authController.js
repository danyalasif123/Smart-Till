const User = require("../models/User");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {

    try {

        const {

            name,

            email,

            password

        } = req.body;

        const exist = await User.findOne({

            email

        });

        if (exist) {

            return res.status(400).json({

                message: "Email already exists"

            });

        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({

            name,

            email,

            password: hashedPassword

        });

        res.status(201).json({

            message: "User created successfully",

            user

        });

    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

exports.login = async (req, res) => {

    try {

        const {

            email,

            password

        } = req.body;

        const user = await User.findOne({

            email

        });

        if (!user) {

            return res.status(400).json({

                message: "Invalid Email or Password"

            });

        }

        const match = await bcrypt.compare(

            password,

            user.password

        );

        if (!match) {

            return res.status(400).json({

                message: "Invalid Email or Password"

            });

        }

        const token = jwt.sign(

            {

                id: user._id

            },

            process.env.JWT_SECRET,

            {

                expiresIn: "1d"

            }

        );

        res.status(200).json({

            message: "Login Successful",

            token,

            user

        });

    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};